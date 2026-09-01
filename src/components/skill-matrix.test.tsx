import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import { localiseSkills } from "@/content/localise";
import { getProject } from "@/content/projects";
import { SkillMatrix } from "./skill-matrix";

const skillGroups = localiseSkills(getCopy("en"));

test("shows every group heading", () => {
  render(<SkillMatrix groups={skillGroups} />);
  for (const group of skillGroups) {
    expect(screen.getByText(group.title)).toBeInTheDocument();
  }
});

test("each evidence tag links to the app that proves the skill", () => {
  render(<SkillMatrix groups={skillGroups} />);
  for (const group of skillGroups) {
    for (const skill of group.skills) {
      const row = screen.getByRole("row", { name: new RegExp(skill.name) });
      for (const slug of skill.evidence) {
        const link = within(row).getByRole("link", { name: slug });
        // The case study is the fallback for a project with no live deployment,
        // so a tag is never a dead end.
        expect(link).toHaveAttribute("href", getProject(slug)!.liveUrl ?? `/work/${slug}`);
      }
    }
  }
});
