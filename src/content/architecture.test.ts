import { describe, expect, test } from "vitest";
import { BANDS, architecture, type Band } from "./architecture";
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
