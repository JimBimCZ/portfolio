import { describe, expect, test } from "vitest";
import { getCopy } from "./copy";
import { localiseSkills } from "./localise";
import { getProject } from "./projects";
import { skillStructure } from "./skills";

const skillGroups = localiseSkills(getCopy("en"));

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

  test("no skill id is used twice, so no dictionary entry is ambiguous", () => {
    const ids = skillStructure.flatMap((g) => g.skills.map((s) => s.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("every skill says what specifically, not just a technology name", () => {
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        expect(skill.detail.length, skill.name).toBeGreaterThan(0);
      }
    }
  });
});
