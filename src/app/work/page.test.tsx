import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { projects } from "@/content/projects";
import WorkPage from "./page";

test("lists every project with a link to its detail page", () => {
  render(<WorkPage />);

  for (const project of projects) {
    expect(screen.getByRole("link", { name: project.title })).toHaveAttribute(
      "href",
      `/work/${project.slug}`,
    );
  }
});

test("links each project that has a repository to GitHub", () => {
  render(<WorkPage />);

  const expected = projects.filter((project) => project.repo).map((p) => p.repo);
  const hrefs = screen
    .getAllByRole("link", { name: "GitHub" })
    .map((link) => link.getAttribute("href"));

  expect(hrefs).toEqual(expected);
});

test("shows a screenshot for every project that declares one", () => {
  render(<WorkPage />);

  for (const project of projects) {
    if (!project.imageAlt) continue;
    expect(screen.getByRole("img", { name: project.imageAlt })).toBeInTheDocument();
  }
});
