import { describe, expect, test } from "vitest";
import { BANDS, architecture, type Band } from "./architecture";
import type { ProjectSlug } from "./projects";
import { projects } from "./projects";

const entries = Object.entries(architecture);

describe("architecture", () => {
  test("describes every project in the log", () => {
    expect(Object.keys(architecture).sort()).toEqual(
      projects.map((project) => project.slug).sort(),
    );
  });

  test("every node sits in a declared band", () => {
    for (const [slug, { nodes }] of entries) {
      for (const node of nodes) {
        expect(BANDS, `${slug}/${node.id}`).toContain(node.band);
      }
    }
  });

  test("no node id is used twice in a project, so a note is never ambiguous", () => {
    for (const [slug, { nodes }] of entries) {
      const ids = nodes.map((node) => node.id);
      expect(new Set(ids).size, slug).toBe(ids.length);
    }
  });

  // An edge to an empty band would have nothing to attach to, and the renderer
  // silently drops it — so the diagram would quietly lose a relationship
  // rather than fail. Catch it here instead.
  test("every edge connects two bands that actually have nodes", () => {
    for (const [slug, { nodes, edges }] of entries) {
      const populated = new Set<Band>(nodes.map((node) => node.band));
      for (const edge of edges) {
        expect(populated, `${slug}: ${edge.protocol} from`).toContain(edge.from);
        expect(populated, `${slug}: ${edge.protocol} to`).toContain(edge.to);
      }
    }
  });

  test("no edge connects a band to itself", () => {
    for (const [slug, { edges }] of entries) {
      for (const edge of edges) {
        expect(edge.from, `${slug}: ${edge.protocol}`).not.toBe(edge.to);
      }
    }
  });

  test("every diagram has at least two bands and one edge", () => {
    for (const [slug, { nodes, edges }] of entries) {
      expect(new Set(nodes.map((node) => node.band)).size, slug).toBeGreaterThan(1);
      expect(edges.length, slug).toBeGreaterThan(0);
    }
  });

  test("every node and edge is labelled", () => {
    for (const [slug, { nodes, edges }] of entries) {
      for (const node of nodes) {
        expect(node.name.trim().length, `${slug}/${node.id}`).toBeGreaterThan(0);
      }
      for (const edge of edges) {
        expect(edge.protocol.trim().length, `${slug}: ${edge.from}->${edge.to}`).toBeGreaterThan(0);
      }
    }
  });
});

describe("pipelines", () => {
  const pipelines = entries.flatMap(([slug, { pipeline }]) =>
    pipeline ? [[slug, pipeline] as const] : [],
  );

  test("at least one project draws the path a request takes", () => {
    expect(pipelines.length).toBeGreaterThan(0);
  });

  test("no step id is used twice, so a step's prose is never ambiguous", () => {
    for (const [slug, pipeline] of pipelines) {
      const ids = pipeline.map((step) => step.id);
      expect(new Set(ids).size, slug).toBe(ids.length);
    }
  });

  test("every step names the module it happens in", () => {
    for (const [slug, pipeline] of pipelines) {
      for (const step of pipeline) {
        expect(step.name.trim().length, `${slug}/${step.id}`).toBeGreaterThan(0);
        // A path or a file, never a sentence: prose here would stay English
        // under /cs, the same rule node names follow.
        expect(step.name, `${slug}/${step.id}`).not.toMatch(/\s/);
      }
    }
  });

  // A one-step sequence is not a sequence, and the whole reason the field
  // exists is that the bands cannot show order.
  test("a declared pipeline has enough steps to be an order", () => {
    for (const [slug, pipeline] of pipelines) {
      expect(pipeline.length, slug).toBeGreaterThan(1);
    }
  });
  // Both diagrams render on the same page, so a name in both prints twice and
  // reads as a mistake. The bands name modules, the pipeline names the files
  // inside them, and this is what keeps that split honest.
  test("no step repeats a node name on the same page", () => {
    for (const [slug, pipeline] of pipelines) {
      const nodeNames = new Set(architecture[slug as ProjectSlug].nodes.map((n) => n.name));
      for (const step of pipeline) {
        expect(nodeNames, `${slug}/${step.id}`).not.toContain(step.name);
      }
    }
  });
});
