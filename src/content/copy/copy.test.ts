import { describe, expect, test } from "vitest";
import { LOCALES, getCopy } from "./index";

describe("copy", () => {
  test("every locale resolves to a dictionary", () => {
    for (const locale of LOCALES) {
      expect(getCopy(locale), locale).toBeDefined();
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
