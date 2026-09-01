import { describe, expect, test } from "vitest";
import { LOCALES, counterpart, getCopy } from "./index";
import { cs } from "./cs";
import { en } from "./en";

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
      expect(Object.keys(nav).sort(), locale).toEqual(["about", "contact", "work"]);
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
      expect(person.bio.length, locale).toBe(3);
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
    }
  });
});
