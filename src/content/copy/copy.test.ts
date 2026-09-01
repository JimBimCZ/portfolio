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
