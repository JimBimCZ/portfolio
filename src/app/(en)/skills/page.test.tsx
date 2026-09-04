import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import { localiseSkills } from "@/content/localise";
import { getProject } from "@/content/projects";
import Page, { metadata } from "./page";

const copy = getCopy("en");
const groups = localiseSkills(copy);

test("titles the page and describes what backs the matrix", () => {
  render(<Page />);

  expect(
    screen.getByRole("heading", { level: 1, name: copy.pages.skills.title }),
  ).toBeInTheDocument();
  expect(screen.getByText(copy.pages.skills.lede)).toBeInTheDocument();
  expect(metadata.title).toBe(copy.meta.skills.title);
  expect(metadata.description).toBe(copy.meta.skills.description);
});

// The home page shows the same matrix as a preview. This page is the one that
// has to carry all of it, or its nav entry is a worse version of the section
// the visitor just scrolled past.
test("renders every group and every skill, not a subset", () => {
  render(<Page />);

  for (const group of groups) {
    expect(
      screen.getByRole("heading", { name: group.title }),
    ).toBeInTheDocument();
    for (const skill of group.skills) {
      expect(screen.getByText(skill.name)).toBeInTheDocument();
      expect(screen.getByText(skill.detail)).toBeInTheDocument();
    }
  }
});

// An evidence tag that goes nowhere is the one failure this page cannot
// afford: the whole claim is that each skill is backed by something openable.
test("every evidence tag links to the live app, or to the case study when there is none", () => {
  const { container } = render(<Page />);

  // Collected in one pass. A role query per tag is O(tags x DOM) over a page
  // that renders every skill in the matrix, which is slow enough to blow the
  // default 5s timeout when the whole suite runs.
  const hrefsByTag = new Map<string, Set<string>>();
  for (const anchor of container.querySelectorAll("a")) {
    const text = anchor.textContent ?? "";
    const hrefs = hrefsByTag.get(text) ?? new Set<string>();
    hrefs.add(anchor.getAttribute("href") ?? "");
    hrefsByTag.set(text, hrefs);
  }

  for (const group of groups) {
    for (const skill of group.skills) {
      for (const slug of skill.evidence) {
        const expected = getProject(slug)?.liveUrl ?? `/work/${slug}`;
        expect([...(hrefsByTag.get(slug) ?? [])], slug).toEqual([expected]);
      }
    }
  }
});
