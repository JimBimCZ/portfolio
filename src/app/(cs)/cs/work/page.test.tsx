import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import { localiseProjects } from "@/content/localise";
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

test("reads the ship date as a Czech label and value", () => {
  render(<CzechWork />);

  expect(screen.getAllByText("Nasazeno: srpen 2026").length).toBe(projects.length);
});

test("titles the page in Czech", () => {
  expect(metadata.title).toBe(copy.meta.work.title);
  expect(metadata.description).toBe(copy.meta.work.description);
});
