import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import { localiseSkills } from "@/content/localise";
import { getProject } from "@/content/projects";
import CzechSkills, { metadata } from "./page";

const copy = getCopy("cs");
const groups = localiseSkills(copy);

test("renders the matrix in Czech", () => {
  render(<CzechSkills />);

  expect(
    screen.getByRole("heading", { level: 1, name: copy.pages.skills.title }),
  ).toBeInTheDocument();
  expect(screen.getByText(copy.pages.skills.lede)).toBeInTheDocument();
  for (const group of groups) {
    expect(screen.getByRole("heading", { name: group.title })).toBeInTheDocument();
  }
});

test("titles the page in Czech", () => {
  expect(metadata.title).toBe(copy.meta.skills.title);
  expect(metadata.description).toBe(copy.meta.skills.description);
});

// A case-study tag under /cs must stay inside the Czech tree. A live app is a
// different site and keeps its own URL in both languages.
test("keeps case-study evidence inside the Czech tree", () => {
  render(<CzechSkills />);

  for (const group of groups) {
    for (const skill of group.skills) {
      for (const slug of skill.evidence) {
        if (getProject(slug)?.liveUrl) continue;
        for (const tag of screen.getAllByRole("link", { name: slug })) {
          expect(tag).toHaveAttribute("href", `/cs/work/${slug}`);
        }
      }
    }
  }
});
