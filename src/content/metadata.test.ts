import { describe, expect, test } from "vitest";
import { alternatesFor } from "./metadata";

describe("alternatesFor", () => {
  test("relates the two trees and defaults to English", () => {
    expect(alternatesFor("/work/trader")).toEqual({
      canonical: "/work/trader",
      languages: {
        en: "/work/trader",
        cs: "/cs/work/trader",
        "x-default": "/work/trader",
      },
    });
  });

  test("handles the home page, where the Czech path is not a suffix", () => {
    expect(alternatesFor("/").languages.cs).toBe("/cs");
  });
});
