import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { getProject } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { SkillMatrix } from "./skill-matrix";

test("shows every group heading", () => {
  render(<SkillMatrix groups={skillGroups} />);
  for (const group of skillGroups) {
    expect(screen.getByText(group.title)).toBeInTheDocument();
  }
});

test("each evidence tag links to the app that proves the skill", () => {
  render(<SkillMatrix groups={skillGroups} />);
  const first = skillGroups[0].skills[0];
  const row = screen.getByRole("row", { name: new RegExp(first.name) });
  for (const slug of first.evidence) {
    const link = within(row).getByRole("link", { name: slug });
    expect(link).toHaveAttribute("href", getProject(slug)!.liveUrl ?? `/work/${slug}`);
  }
});

test("a skill whose evidence has no live deployment still links to its case study", () => {
  render(<SkillMatrix groups={skillGroups} />);
  const link = screen.getAllByRole("link", { name: "kanban" })[0];
  expect(link).toHaveAttribute("href", "/work/kanban");
});
