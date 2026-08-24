import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getProject } from "@/content/projects";
import ProjectPage, { generateStaticParams } from "./page";

type PageArgs = Parameters<typeof ProjectPage>[0];

function argsFor(slug: string) {
  return { params: Promise.resolve({ slug }) } as PageArgs;
}

test("generates a route for every project", async () => {
  const params = await generateStaticParams();
  expect(params).toContainEqual({ slug: "kanban" });
  expect(params).toContainEqual({ slug: "legal-document-creator" });
});

test("renders the project's title, role, and highlights", async () => {
  const project = getProject("legal-document-creator");
  render(await ProjectPage(argsFor("legal-document-creator")));

  expect(
    screen.getByRole("heading", { level: 1, name: project!.title }),
  ).toBeInTheDocument();
  expect(screen.getByText(project!.role)).toBeInTheDocument();
  for (const highlight of project!.highlights) {
    expect(screen.getByText(highlight)).toBeInTheDocument();
  }
});

test("links to the repository when the project has one", async () => {
  render(await ProjectPage(argsFor("kanban")));

  expect(screen.getByRole("link", { name: "Source" })).toHaveAttribute(
    "href",
    "https://github.com/JimBimCZ/kanban",
  );
});

test("links to the live site when the project has one", async () => {
  render(await ProjectPage(argsFor("trader")));

  expect(screen.getByRole("link", { name: "Visit site" })).toHaveAttribute(
    "href",
    "https://trader-jimbimczs-projects.vercel.app",
  );
});

test("notes what to expect from a live demo when the project has a note", async () => {
  const project = getProject("trader");
  render(await ProjectPage(argsFor("trader")));

  expect(screen.getByText(project!.liveNote!)).toBeInTheDocument();
});

test("an unknown slug does not render a page", async () => {
  await expect(ProjectPage(argsFor("no-such-project"))).rejects.toThrow();
});
