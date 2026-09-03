import type { Copy, DesignDecision, Locale } from "./copy/types";
import { CAROUSEL_ORDER, getProject, projects, type ProjectData, type ProjectSlug } from "./projects";
import { skillStructure } from "./skills";
import { BANDS, architecture, type ArchEdge, type ArchNode, type Band } from "./architecture";

export type Metric = { label: string; value: string };

// Matches a plain integer, optionally grouped with commas every three digits
// ("846", "245,025"). Deliberately narrow: metric values also hold things
// like "2/sec", "Lévy", "pg_trgm" and "Postgres", which must pass through
// unchanged in every locale.
const THOUSANDS_SEPARATED_INTEGER = /^\d{1,3}(,\d{3})*$/;

/**
 * Metric values live in projects.ts as locale-invariant data, written with an
 * English thousands separator ("245,025"). English rendering must not change
 * at all, so this is a no-op for "en". Everywhere else, a comma is read as a
 * decimal point, so a value that is unambiguously a grouped integer gets its
 * commas swapped for the non-breaking space `Intl.NumberFormat("cs-CZ")`
 * groups with, and `copy/cs.ts`'s prose already uses ("245 025") — a
 * plain space would let a number break across a line. Anything that is not a
 * plain integer is returned untouched.
 */
export function formatMetricValue(value: string, locale: Locale): string {
  if (locale === "en") return value;
  if (!THOUSANDS_SEPARATED_INTEGER.test(value)) return value;
  return value.replace(/,/g, " ");
}

export type LocalisedProject = Omit<ProjectData, "metrics"> & {
  summary: string;
  role: string;
  highlights: readonly string[];
  metrics: Metric[];
  posterAlt?: string;
  liveNote?: string;
};

function merge(data: ProjectData, copy: Copy): LocalisedProject {
  const text = copy.projects[data.slug as ProjectSlug];
  if (data.metrics.length !== text.metricLabels.length) {
    throw new Error(
      `${data.slug}: ${data.metrics.length} metric values but ${text.metricLabels.length} labels`,
    );
  }
  const { metrics, ...rest } = data;
  return {
    ...rest,
    summary: text.summary,
    role: text.role,
    highlights: text.highlights,
    posterAlt: text.posterAlt,
    liveNote: text.liveNote,
    metrics: metrics.map((value, index) => ({
      value: formatMetricValue(value, copy.locale),
      label: text.metricLabels[index],
    })),
  };
}

export function localiseProjects(copy: Copy): LocalisedProject[] {
  return projects.map((project) => merge(project, copy));
}

export function localiseProject(slug: string, copy: Copy): LocalisedProject | undefined {
  const data = getProject(slug);
  return data && merge(data, copy);
}

export function localiseCarousel(copy: Copy): LocalisedProject[] {
  return CAROUSEL_ORDER.map((slug) => {
    const project = localiseProject(slug, copy);
    if (!project) throw new Error(`carousel references unknown project: ${slug}`);
    return project;
  });
}

export type Skill = { name: string; detail: string; evidence: readonly ProjectSlug[] };
export type SkillGroup = { title: string; skills: Skill[] };

export function localiseSkills(copy: Copy): SkillGroup[] {
  return skillStructure.map((group) => {
    const text = copy.skills[group.id];
    if (!text) throw new Error(`no copy for skill group: ${group.id}`);
    return {
      title: text.title,
      skills: group.skills.map((skill) => {
        const entry = text.skills[skill.id];
        if (!entry) throw new Error(`no copy for skill: ${group.id}/${skill.id}`);
        return { name: entry.name, detail: entry.detail, evidence: skill.evidence };
      }),
    };
  });
}

export type LocalisedNode = ArchNode & { note?: string };
export type LocalisedBand = { band: Band; title: string; nodes: LocalisedNode[] };
export type LocalisedArchitecture = {
  bands: LocalisedBand[];
  edges: readonly ArchEdge[];
  decisions: readonly DesignDecision[];
};

/**
 * Pairs a project's wiring with the reader's language: band titles and node
 * notes come from the dictionary, everything structural from architecture.ts.
 *
 * Bands come back in `BANDS` order with the empty ones dropped, so the
 * renderer can index rows off the array position and does not have to know
 * which bands a given project happens to use.
 */
export function localiseArchitecture(slug: string, copy: Copy): LocalisedArchitecture {
  const data = architecture[slug as ProjectSlug];
  if (!data) throw new Error(`no architecture for project: ${slug}`);

  const { decisions, notes = {} } = copy.projects[slug as ProjectSlug].design;

  // A renamed node id would otherwise drop its note without a word, leaving
  // the diagram quietly less informative than it reads in the dictionary.
  const ids = new Set(data.nodes.map((node) => node.id));
  for (const id of Object.keys(notes)) {
    if (!ids.has(id)) throw new Error(`${slug}: note for unknown node ${id}`);
  }

  const bands = BANDS.map((band) => ({
    band,
    title: copy.architecture.bands[band],
    nodes: data.nodes
      .filter((node) => node.band === band)
      .map((node) => ({ ...node, note: notes[node.id] })),
  })).filter((band) => band.nodes.length > 0);

  return { bands, edges: data.edges, decisions };
}
