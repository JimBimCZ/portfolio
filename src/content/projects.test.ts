import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { tours } from "../../scripts/capture/tours.mjs";
import { getCopy } from "./copy";
import { localiseCarousel, localiseProjects } from "./localise";
import { site } from "./site";
import { formatShipped, getProject, projects } from "./projects";

const localised = localiseProjects(getCopy("en"));
const carouselProjects = localiseCarousel(getCopy("en"));

describe("formatShipped", () => {
  test("renders an ISO year-month as a readable date", () => {
    expect(formatShipped("2026-08", "en")).toBe("August 2026");
  });

  test("handles a January date without off-by-one in the month", () => {
    expect(formatShipped("2025-01", "en")).toBe("January 2025");
  });

  test("renders a Czech date in Czech, lower case as the language requires", () => {
    expect(formatShipped("2026-08", "cs")).toBe("srpen 2026");
  });

  test("still renders English when asked for English", () => {
    expect(formatShipped("2026-08", "en")).toBe("August 2026");
  });
});

describe("getProject", () => {
  test("finds a project by slug", () => {
    expect(getProject("trader")?.title).toBe("Trader");
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
    for (const project of localised) {
      expect(project.shipped).toMatch(/^\d{4}-\d{2}$/);
      expect(project.title.length).toBeGreaterThan(0);
      expect(project.summary.length).toBeGreaterThan(0);
      expect(project.stack.length).toBeGreaterThan(0);
      expect(project.highlights.length).toBeGreaterThan(0);
    }
  });

  test("declared posters exist in public and are described for screen readers", () => {
    for (const project of localised) {
      if (!project.poster) continue;
      expect(existsSync(join(process.cwd(), "public", project.poster))).toBe(true);
      expect(project.posterAlt?.length ?? 0).toBeGreaterThan(0);
    }
  });
});

describe("carousel projects", () => {
  test("are ordered with work-planner first, so first paint is not Steam's storefront", () => {
    expect(carouselProjects.map((p) => p.slug)).toEqual([
      "work-planner",
      "trader",
      "secure-llm",
      "my-movies",
      "games-db",
      "legal",
    ]);
  });

  // The card is one anchor, so a slide with neither a deployment nor a
  // repository would render a link to nowhere. "Live" is the stronger claim
  // and keeps its own guard below.
  test("every carousel project has somewhere to send a visitor", () => {
    for (const project of carouselProjects) {
      expect(project.liveUrl ?? project.repo, project.slug).toMatch(/^https:\/\//);
    }
  });

  test("a project called live has the deployment that claim needs", () => {
    for (const project of carouselProjects) {
      if (project.status !== "live") continue;
      expect(project.liveUrl, project.slug).toMatch(/^https:\/\//);
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

  // tours.mjs states this as an invariant in a comment ("URLs here must match
  // `liveUrl`") but nothing enforced it — a moved deployment would silently
  // capture the wrong app.
  test("every tour's URL matches its project's liveUrl", () => {
    for (const [slug, tour] of Object.entries(tours)) {
      const project = getProject(slug);
      expect(project, `no project for tour entry ${slug}`).toBeDefined();
      expect(tour.url).toBe(project!.liveUrl);
    }
  });
});

describe("the name", () => {
  test("carries no diacritics", () => {
    expect(site.name).toBe("Vit Busek");
    expect(site.name.normalize("NFD")).toBe(site.name);
  });
});
