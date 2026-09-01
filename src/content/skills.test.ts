import { describe, expect, test } from "vitest";
import { getProject } from "./projects";
import { skillGroups } from "./skills";

describe("skills", () => {
  test("every evidence slug resolves to a real project", () => {
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        for (const slug of skill.evidence) {
          expect(getProject(slug), `${skill.name} cites ${slug}`).toBeDefined();
        }
      }
    }
  });

  test("every skill cites at least one project, so nothing is claimed unbacked", () => {
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        expect(skill.evidence.length, skill.name).toBeGreaterThan(0);
      }
    }
  });

  test("no skill is listed twice across groups", () => {
    const names = skillGroups.flatMap((g) => g.skills.map((s) => s.name));
    expect(new Set(names).size).toBe(names.length);
  });

  test("every skill says what specifically, not just a technology name", () => {
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        expect(skill.detail.length, skill.name).toBeGreaterThan(0);
      }
    }
  });
});
