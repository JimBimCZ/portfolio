import { describe, expect, test } from "vitest";
import { getCopy } from "./copy";
import { LOCALES } from "./copy/types";
import { projects } from "./projects";
import { localiseCarousel, localiseProject, localiseProjects } from "./localise";

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

  test("pins specific value-to-label pairings, so a same-length transposition fails the suite", () => {
    // Guards the hazard length-checking alone misses: values live in
    // projects.ts, labels live in en.ts, and nothing but this assertion ties
    // a given value to its correct label — a same-length swap, within a
    // project or between two same-shaped projects, would otherwise pass
    // silently. Pulled from localiseProjects(en)'s merged output, not
    // restated from the dictionary, so a transposition in either source file
    // actually fails this.
    const localised = localiseProjects(en);

    const trader = localised.find((p) => p.slug === "trader")!;
    expect(trader.metrics.find((m) => m.value === "846")?.label).toBe(
      "tests across the stack",
    );

    const workPlanner = localised.find((p) => p.slug === "work-planner")!;
    expect(workPlanner.metrics.find((m) => m.value === "Postgres")?.label).toBe(
      "Drizzle + Neon",
    );
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
