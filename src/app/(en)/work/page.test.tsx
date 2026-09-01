import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { WorkPage } from "@/components/pages/work";
import { getCopy } from "@/content/copy";
import { localiseProjects } from "@/content/localise";

const copy = getCopy("en");
const projects = localiseProjects(copy);

test("lists every project with a link to its detail page", () => {
  render(<WorkPage copy={copy} locale="en" />);

  for (const project of projects) {
    expect(screen.getByRole("link", { name: project.title })).toHaveAttribute(
      "href",
      `/work/${project.slug}`,
    );
  }
});

test("links each project that has a repository to GitHub", () => {
  render(<WorkPage copy={copy} locale="en" />);

  const expected = projects.filter((project) => project.repo).map((p) => p.repo);
  const hrefs = screen
    .getAllByRole("link", { name: "GitHub" })
    .map((link) => link.getAttribute("href"));

  expect(hrefs).toEqual(expected);
});

test("shows a screenshot for every project that declares one", () => {
  render(<WorkPage copy={copy} locale="en" />);

  for (const project of projects) {
    if (!project.posterAlt) continue;
    expect(screen.getByRole("img", { name: project.posterAlt })).toBeInTheDocument();
  }
});
