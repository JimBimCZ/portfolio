import { describe, expect, test } from "vitest";
import { LOCALES, counterpart, getCopy } from "./index";
import { cs } from "./cs";
import { en } from "./en";
import { BANDS } from "../architecture";

describe("counterpart", () => {
  test("maps an English path into the Czech tree", () => {
    expect(counterpart("/work/trader")).toBe("/cs/work/trader");
  });

  test("maps a Czech path back into the English tree", () => {
    expect(counterpart("/cs/work/trader")).toBe("/work/trader");
  });

  test("maps each home page to the other", () => {
    expect(counterpart("/")).toBe("/cs");
    expect(counterpart("/cs")).toBe("/");
  });
});

describe("copy", () => {
  test("every locale resolves to a dictionary", () => {
    for (const locale of LOCALES) {
      expect(getCopy(locale), locale).toBeDefined();
    }
  });

  // `dictionaries` in `./index` keys each Copy object by locale independently
  // of the object's own `locale` field — nothing stops the two from drifting
  // (a bad edit, or a third locale copy-pasted from an existing dictionary).
  // localise.ts's formatMetricValue trusts `copy.locale` to decide whether to
  // reformat a metric value, so a drift here would silently mis-format
  // English (or under-format Czech) with no other test catching it directly.
  test("each dictionary's own locale field matches the key it is registered under", () => {
    for (const locale of LOCALES) {
      expect(getCopy(locale).locale, locale).toBe(locale);
    }
  });

  // `global-not-found.tsx` has no parent layout, so it applies the template by
  // hand. Lose the placeholder and its title silently becomes the raw template.
  test("every title template keeps its placeholder", () => {
    for (const locale of LOCALES) {
      expect(getCopy(locale).meta.titleTemplate, locale).toContain("%s");
    }
  });

  test("the nav names every section the site routes to", () => {
    for (const locale of LOCALES) {
      const { nav } = getCopy(locale).ui;
      expect(Object.keys(nav).sort(), locale).toEqual([
        "about",
        "contact",
        "experience",
        "skills",
        "work",
      ]);
      for (const [key, label] of Object.entries(nav)) {
        expect(label.length, `${locale}.${key}`).toBeGreaterThan(0);
      }
    }
  });
});

describe("person copy", () => {
  test("every locale carries the whole bio and CV", () => {
    for (const locale of LOCALES) {
      const { person } = getCopy(locale);
      expect(person.bio.length, locale).toBe(4);
      expect(person.experience.length, locale).toBe(4);
      for (const job of person.experience) {
        expect(job.title.length, `${locale} ${job.org}`).toBeGreaterThan(0);
        expect(job.note.length, `${locale} ${job.org}`).toBeGreaterThan(0);
      }
      expect(person.privacy.sections.length, locale).toBe(4);
    }
  });

  test("the CV keeps its real employers and dates in every locale", () => {
    for (const locale of LOCALES) {
      const orgs = getCopy(locale).person.experience.map((job) => job.org);
      expect(orgs, locale).toEqual([
        "Three Pillar Global",
        "Notino",
        "Kinalisoft",
        "Axon Garside, Manchester UK",
      ]);
    }
  });
});

/**
 * Every leaf of a dictionary as a `path, value` pair — e.g. `person.bio.0` or
 * `projects.trader.summary`. Collecting the value alongside the path (rather
 * than re-walking the object per path) keeps the emptiness check below a plain
 * loop instead of a cast-heavy traversal.
 */
function leaves(node: unknown, prefix = ""): { path: string; value: unknown }[] {
  if (typeof node !== "object" || node === null) return [{ path: prefix, value: node }];
  return Object.entries(node).flatMap(([key, child]) =>
    leaves(child, prefix ? `${prefix}.${key}` : key),
  );
}

// The role label is written in three places per dictionary: `person.role` (the
// hero eyebrow), the `role` row of the spec block, and the home page's
// <title>. They drifted apart once already — the site claimed one role in its
// heading and another in its metadata — so tie them together here rather than
// trusting three hand-edited strings to stay in step.
describe("the role label", () => {
  test("reads the same in the spec block as in the hero", () => {
    for (const locale of LOCALES) {
      const copy = getCopy(locale);
      const row = copy.person.manifest.find(([key]) => key === "role");
      expect(row, `${locale}: no role row in the manifest`).toBeDefined();
      expect(row?.[1], locale).toBe(copy.person.role);
    }
  });

  test("is what the home page titles itself with", () => {
    for (const locale of LOCALES) {
      const copy = getCopy(locale);
      expect(copy.meta.home.title.endsWith(copy.person.role), locale).toBe(true);
    }
  });
});

describe("the Czech dictionary", () => {
  test("covers exactly the keys English covers", () => {
    expect(leaves(cs).map((leaf) => leaf.path).sort()).toEqual(
      leaves(en).map((leaf) => leaf.path).sort(),
    );
  });

  test("leaves nothing empty", () => {
    for (const locale of LOCALES) {
      for (const { path, value } of leaves(getCopy(locale))) {
        expect(String(value).trim().length, `${locale}.${path}`).toBeGreaterThan(0);
      }
    }
  });

  test("is actually Czech, not English pasted twice", () => {
    // Prose the reader judges the site by. Structural strings, job titles,
    // employer names and stack entries are deliberately identical across
    // locales and are not checked here.
    expect(cs.person.tagline).not.toBe(en.person.tagline);
    expect(cs.person.intro).not.toBe(en.person.intro);
    expect(cs.person.bio).not.toEqual(en.person.bio);
    for (const slug of Object.keys(en.projects) as (keyof typeof en.projects)[]) {
      expect(cs.projects[slug].summary, slug).not.toBe(en.projects[slug].summary);
      expect(cs.projects[slug].design.decisions[0].because, slug).not.toBe(
        en.projects[slug].design.decisions[0].because,
      );
    }
  });
});

describe("architecture copy", () => {
  test("names every band in every locale", () => {
    for (const locale of LOCALES) {
      const { bands } = getCopy(locale).architecture;
      expect(Object.keys(bands).sort(), locale).toEqual(BANDS.slice().sort());
    }
  });

  test("the section heading and diagram label differ between locales", () => {
    expect(cs.architecture.heading).not.toBe(en.architecture.heading);
    expect(cs.architecture.diagramLabel).not.toBe(en.architecture.diagramLabel);
  });
});

describe("design decisions", () => {
  test("every project gives one to three decisions in every locale", () => {
    for (const locale of LOCALES) {
      const { projects } = getCopy(locale);
      for (const [slug, project] of Object.entries(projects)) {
        expect(project.design.decisions.length, `${locale}.${slug}`).toBeGreaterThan(0);
        expect(project.design.decisions.length, `${locale}.${slug}`).toBeLessThanOrEqual(3);
      }
    }
  });

  // A decision that only names a choice is a stack list with extra steps. The
  // reason is the part worth reading.
  test("every decision states a reason, not just a choice", () => {
    for (const locale of LOCALES) {
      for (const [slug, project] of Object.entries(getCopy(locale).projects)) {
        for (const decision of project.design.decisions) {
          expect(decision.choice.trim().length, `${locale}.${slug}`).toBeGreaterThan(0);
          expect(decision.because.trim().length, `${locale}.${slug}`).toBeGreaterThan(20);
        }
      }
    }
  });
});
