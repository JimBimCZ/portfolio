import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import { localiseSkills, type SkillGroup } from "@/content/localise";
import { getProject } from "@/content/projects";
import { SkillMatrix } from "./skill-matrix";

const skillGroups = localiseSkills(getCopy("en"));

test("shows every group heading", () => {
  render(<SkillMatrix groups={skillGroups} locale="en" />);
  for (const group of skillGroups) {
    expect(screen.getByText(group.title)).toBeInTheDocument();
  }
});

test("each evidence tag links to the app that proves the skill", () => {
  render(<SkillMatrix groups={skillGroups} locale="en" />);
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

// Every project in `projects.ts` currently has a live URL, so the case-study
// fallback is exercised with a group of its own rather than with real data.
test("prefixes the case-study fallback with the page's locale", () => {
  const groups = [
    {
      title: "Fallback",
      skills: [{ name: "Unshipped", detail: "No live deployment.", evidence: ["unbuilt"] }],
    },
  ] as unknown as SkillGroup[];

  const { unmount } = render(<SkillMatrix groups={groups} locale="en" />);
  expect(screen.getByRole("link", { name: "unbuilt" })).toHaveAttribute(
    "href",
    "/work/unbuilt",
  );
  unmount();

  render(<SkillMatrix groups={groups} locale="cs" />);
  expect(screen.getByRole("link", { name: "unbuilt" })).toHaveAttribute(
    "href",
    "/cs/work/unbuilt",
  );
});
