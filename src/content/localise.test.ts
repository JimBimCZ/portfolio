import { describe, expect, test } from "vitest";
import { getCopy } from "./copy";
import { LOCALES } from "./copy/types";
import { projects, type ProjectSlug } from "./projects";
import {
  localiseCarousel,
  localiseProject,
  localiseProjects,
  type Metric,
} from "./localise";

const en = getCopy("en");

describe("localiseProjects", () => {
  test("keeps the log's order and every project", () => {
    expect(localiseProjects(en).map((p) => p.slug)).toEqual(
      projects.map((p) => p.slug),
    );
  });

  test("pairs each metric value with the label from the dictionary", () => {
    for (const locale of LOCALES) {
      for (const project of localiseProjects(getCopy(locale))) {
        expect(project.metrics.length, `${locale} ${project.slug}`).toBeGreaterThanOrEqual(2);
        for (const metric of project.metrics) {
          expect(metric.value.length, `${locale} ${project.slug}`).toBeGreaterThan(0);
          expect(metric.label.length, `${locale} ${project.slug}`).toBeGreaterThan(0);
        }
      }
    }
  });

  // Length-checking the zip (below) catches a mismatched count, but says
  // nothing about pairing: values live in projects.ts, labels live in en.ts,
  // and nothing but this table ties a given value to its correct label. A
  // same-length transposition — two labels swapped within one project, or a
  // whole labels array swapped between two same-shaped projects — would
  // otherwise pass every other test in this file. Pin the full table, in
  // order, for every project, so either source file failing to match the
  // other fails loudly here instead of shipping a mislabelled number. This
  // duplicates the data on purpose — that duplication is what makes an
  // accidental edit visible. Values and labels below were read directly out
  // of projects.ts and copy/en.ts, not derived from either at test time.
  test("pins every value-to-label pair, in order, for every project", () => {
    const expected: Record<ProjectSlug, Metric[]> = {
      trader: [
        { value: "2/sec", label: "price ticks streamed" },
        { value: "846", label: "tests across the stack" },
        { value: "Lévy", label: "closed-form price clock" },
      ],
      "games-db": [
        { value: "245,025", label: "appids indexed" },
        { value: "14,621", label: "hydrated with detail" },
        { value: "pg_trgm", label: "trigram search" },
      ],
      "my-movies": [
        { value: "9", label: "browse rows" },
        { value: "Tag-based", label: "cache revalidation" },
        { value: "Linkable", label: "search lives in the URL" },
      ],
      legal: [
        { value: "11", label: "Common Paper templates" },
        { value: "161", label: "tests across the stack" },
      ],
      "work-planner": [
        { value: "Postgres", label: "Drizzle + Neon" },
        { value: "291", label: "tests across the stack" },
      ],
    };

    const actual = Object.fromEntries(
      localiseProjects(en).map((project) => [project.slug, project.metrics]),
    );

    // toEqual on the whole table also folds in the count-per-project check,
    // so this and the length guard below can never disagree.
    expect(actual).toEqual(expected);
  });

  test("throws when a project's labels and values are not the same length", () => {
    const broken = {
      ...en,
      projects: { ...en.projects, trader: { ...en.projects.trader, metricLabels: [] } },
    };
    expect(() => localiseProjects(broken)).toThrow(/trader/);
  });
});

describe("localiseProject", () => {
  test("returns undefined for a slug that does not exist", () => {
    expect(localiseProject("does-not-exist", en)).toBeUndefined();
  });
});

describe("localiseCarousel", () => {
  test("is the five deployed apps, trader first", () => {
    expect(localiseCarousel(en).map((p) => p.slug)).toEqual([
      "trader",
      "games-db",
      "my-movies",
      "legal",
      "work-planner",
    ]);
  });
});
