import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import { localiseProject } from "@/content/localise";
import CzechProject, { generateStaticParams } from "./page";

const copy = getCopy("cs");

type PageArgs = Parameters<typeof CzechProject>[0];

function argsFor(slug: string) {
  return { params: Promise.resolve({ slug }) } as PageArgs;
}

// Slugs are the project's identity, not prose: they stay English on both sides.
test("generates the same English slugs as the English tree", async () => {
  const params = await generateStaticParams();

  expect(params).toContainEqual({ slug: "trader" });
  expect(params).toContainEqual({ slug: "legal" });
  expect(params).toHaveLength(5);
});

test("renders the project's Czech prose", async () => {
  const project = localiseProject("legal", copy)!;
  render(await CzechProject(argsFor("legal")));

  expect(
    screen.getByRole("heading", { level: 1, name: project.title }),
  ).toBeInTheDocument();
  expect(screen.getByText(project.summary)).toBeInTheDocument();
  expect(screen.getByText("srpen 2026")).toBeInTheDocument();
});

test("sends the reader back to the Czech log", async () => {
  render(await CzechProject(argsFor("legal")));

  expect(
    screen.getByRole("link", { name: copy.pages.project.back }),
  ).toHaveAttribute("href", "/cs/work");
});

test("an unknown slug does not render a page", async () => {
  await expect(CzechProject(argsFor("no-such-project"))).rejects.toThrow();
});
