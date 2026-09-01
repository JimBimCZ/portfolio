import type { Copy } from "./copy/types";
import { CAROUSEL_ORDER, getProject, projects, type ProjectData, type ProjectSlug } from "./projects";
import { skillStructure } from "./skills";

export type Metric = { label: string; value: string };

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
    metrics: metrics.map((value, index) => ({ value, label: text.metricLabels[index] })),
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
