import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import { localiseArchitecture, localiseProject } from "@/content/localise";
import { projects } from "@/content/projects";
import ProjectPage, { generateStaticParams } from "./page";

// The page is rendered standalone in these tests, without `layout.tsx`'s
// <main>, so queries run directly against `screen` rather than scoped
// `within(getByRole("main"))`.

function getProject(slug: string) {
  return localiseProject(slug, getCopy("en"));
}

type PageArgs = Parameters<typeof ProjectPage>[0];

function argsFor(slug: string) {
  return { params: Promise.resolve({ slug }) } as PageArgs;
}

test("generates a route for every project", async () => {
  const params = await generateStaticParams();
  expect(params).toContainEqual({ slug: "trader" });
  expect(params).toContainEqual({ slug: "legal" });
});

test("renders the project's title, role, and highlights", async () => {
  const project = getProject("legal");
  render(await ProjectPage(argsFor("legal")));

  expect(
    screen.getByRole("heading", { level: 1, name: project!.title }),
  ).toBeInTheDocument();
  expect(screen.getByText(project!.role)).toBeInTheDocument();
  for (const highlight of project!.highlights) {
    expect(screen.getByText(highlight)).toBeInTheDocument();
  }
});

test("loads the poster as the page's LCP candidate", async () => {
  const project = getProject("legal");
  render(await ProjectPage(argsFor("legal")));

  const poster = screen.getByRole("img", { name: project!.posterAlt });
  expect(poster).toHaveAttribute("loading", "eager");
  expect(poster).toHaveAttribute("fetchpriority", "high");
});

test("links to the repository when the project has one", async () => {
  render(await ProjectPage(argsFor("games-db")));

  expect(screen.getByRole("link", { name: "Source" })).toHaveAttribute(
    "href",
    "https://github.com/JimBimCZ/games-db",
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

test("shows the technical design of every project", async () => {
  for (const { slug } of projects) {
    const { unmount } = render(await ProjectPage(argsFor(slug)));
    expect(
      screen.getByRole("heading", { level: 2, name: "Technical design" }),
      slug,
    ).toBeInTheDocument();

    const architecture = localiseArchitecture(slug, getCopy("en"));
    for (const band of architecture.bands) {
      expect(screen.getByRole("heading", { level: 3, name: band.title }), slug)
        .toBeInTheDocument();
    }
    for (const decision of architecture.decisions) {
      expect(screen.getByText(decision.choice), slug).toBeInTheDocument();
    }
    unmount();
  }
});
