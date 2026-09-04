import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import { localiseProjects } from "@/content/localise";
import { formatShipped } from "@/content/projects";
import CzechWork, { metadata } from "./page";

const copy = getCopy("cs");
const projects = localiseProjects(copy);

test("lists every project with a link into the Czech tree", () => {
  render(<CzechWork />);

  for (const project of projects) {
    expect(screen.getByRole("link", { name: project.title })).toHaveAttribute(
      "href",
      `/cs/work/${project.slug}`,
    );
  }
});

// Derived from the log rather than counted by hand: the projects no longer
// all ship in the same month, and a blanket count would have to be edited
// every time one does not.
test("reads the ship date as a Czech label and value", () => {
  render(<CzechWork />);

  for (const shipped of new Set(projects.map((project) => project.shipped))) {
    const expected = projects.filter((project) => project.shipped === shipped).length;
    const label = `Nasazeno: ${formatShipped(shipped, "cs")}`;
    expect(screen.getAllByText(label).length, label).toBe(expected);
  }
});

test("titles the page in Czech", () => {
  expect(metadata.title).toBe(copy.meta.work.title);
  expect(metadata.description).toBe(copy.meta.work.description);
});
