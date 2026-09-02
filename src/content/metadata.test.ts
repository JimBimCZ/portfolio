import { describe, expect, test } from "vitest";
import { alternatesFor } from "./metadata";

describe("alternatesFor", () => {
  test("canonicalises to English for the English locale", () => {
    expect(alternatesFor("/work/trader", "en")).toEqual({
      canonical: "/work/trader",
      languages: {
        en: "/work/trader",
        cs: "/cs/work/trader",
        "x-default": "/work/trader",
      },
    });
  });

  test("canonicalises to Czech for the Czech locale", () => {
    expect(alternatesFor("/work/trader", "cs")).toEqual({
      canonical: "/cs/work/trader",
      languages: {
        en: "/work/trader",
        cs: "/cs/work/trader",
        "x-default": "/work/trader",
      },
    });
  });

  test("handles the home page, where the Czech path is not a suffix", () => {
    expect(alternatesFor("/", "en").languages.cs).toBe("/cs");
    expect(alternatesFor("/", "cs").canonical).toBe("/cs");
  });
});
