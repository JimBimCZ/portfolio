import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { site } from "./site";
import { carouselProjects, formatShipped, getProject, projects } from "./projects";

describe("formatShipped", () => {
  test("renders an ISO year-month as a readable date", () => {
    expect(formatShipped("2026-08")).toBe("August 2026");
  });

  test("handles a January date without off-by-one in the month", () => {
    expect(formatShipped("2025-01")).toBe("January 2025");
  });
});

describe("getProject", () => {
  test("finds a project by slug", () => {
    expect(getProject("kanban")?.title).toBe("Kanban MVP");
  });

  test("returns undefined for an unknown slug", () => {
    expect(getProject("does-not-exist")).toBeUndefined();
  });
});

describe("projects", () => {
  test("slugs are unique, so routes cannot collide", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("are ordered newest first", () => {
    const shipped = projects.map((project) => project.shipped);
    expect([...shipped].sort().reverse()).toEqual(shipped);
  });

  test("every entry carries the fields the pages render", () => {
    for (const project of projects) {
      expect(project.shipped).toMatch(/^\d{4}-\d{2}$/);
      expect(project.title.length).toBeGreaterThan(0);
      expect(project.summary.length).toBeGreaterThan(0);
      expect(project.stack.length).toBeGreaterThan(0);
      expect(project.highlights.length).toBeGreaterThan(0);
    }
  });

  test("declared screenshots exist in public and are described for screen readers", () => {
    for (const project of projects) {
      if (!project.image) continue;
      expect(existsSync(join(process.cwd(), "public", project.image))).toBe(true);
      expect(project.imageAlt?.length ?? 0).toBeGreaterThan(0);
    }
  });
});

describe("carousel projects", () => {
  test("are ordered with trader first, so first paint is not Steam's storefront", () => {
    expect(carouselProjects.map((p) => p.slug)).toEqual([
      "trader",
      "games-db",
      "my-movies",
      "legal",
      "work-planner",
    ]);
  });

  test("every carousel project has a live URL to open", () => {
    for (const project of carouselProjects) {
      expect(project.liveUrl).toMatch(/^https:\/\//);
    }
  });

  test("every carousel project carries checkable metrics", () => {
    for (const project of carouselProjects) {
      expect(project.metrics.length).toBeGreaterThanOrEqual(2);
      expect(project.metrics.length).toBeLessThanOrEqual(4);
      for (const metric of project.metrics) {
        expect(metric.value.length).toBeGreaterThan(0);
        expect(metric.label.length).toBeGreaterThan(0);
      }
    }
  });

  test("a project behind sign-in says so, so the card can warn a visitor", () => {
    for (const project of carouselProjects) {
      if (!project.signInRequired) continue;
      expect(project.slug === "legal" || project.slug === "work-planner").toBe(true);
    }
  });
});

describe("carousel media", () => {
  test("every declared poster exists and is described for screen readers", () => {
    for (const project of carouselProjects) {
      expect(project.poster, `${project.slug} has no poster`).toBeDefined();
      expect(existsSync(join(process.cwd(), "public", project.poster!))).toBe(true);
      expect(project.posterAlt?.length ?? 0).toBeGreaterThan(0);
    }
  });

  test("every declared tour exists on disk", () => {
    for (const project of carouselProjects) {
      if (!project.tour) continue;
      expect(existsSync(join(process.cwd(), "public", project.tour))).toBe(true);
    }
  });
});

describe("the name", () => {
  test("carries no diacritics", () => {
    expect(site.name).toBe("Vit Busek");
    expect(site.name.normalize("NFD")).toBe(site.name);
  });
});
