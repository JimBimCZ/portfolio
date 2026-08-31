import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import type { Project } from "@/content/projects";
import { ProjectRow } from "./project-row";

const project: Project = {
  slug: "example",
  title: "Example Project",
  shipped: "2026-08",
  summary: "Does a specific thing for a specific person.",
  role: "Solo build",
  stack: ["Next.js", "FastAPI"],
  highlights: ["Made the slow part fast."],
  repo: "https://github.com/JimBimCZ/example",
  image: "/work/legal.webp",
  imageAlt: "A screenshot of the example project.",
  status: "live",
  metrics: [{ label: "tests", value: "1" }],
};

function renderRow(overrides: Partial<Project> = {}) {
  return render(
    <ul>
      <ProjectRow project={{ ...project, ...overrides }} />
    </ul>,
  );
}

test("links the title to the project detail page", () => {
  renderRow();
  expect(screen.getByRole("link", { name: "Example Project" })).toHaveAttribute(
    "href",
    "/work/example",
  );
});

test("links to the repository separately from the title", () => {
  renderRow();
  const repo = screen.getByRole("link", { name: "GitHub" });
  expect(repo).toHaveAttribute("href", "https://github.com/JimBimCZ/example");
  expect(repo).toHaveAttribute("target", "_blank");
});

test("omits the repository link when a project has no repo", () => {
  renderRow({ repo: undefined });
  expect(screen.queryByRole("link", { name: "GitHub" })).toBeNull();
});

test("renders the screenshot with its description", () => {
  renderRow();
  expect(
    screen.getByRole("img", { name: "A screenshot of the example project." }),
  ).toBeInTheDocument();
});

test("renders no image when a project has no screenshot", () => {
  renderRow({ image: undefined });
  expect(screen.queryByRole("img")).toBeNull();
});

test("shows the summary and the stack", () => {
  renderRow();
  expect(
    screen.getByText("Does a specific thing for a specific person."),
  ).toBeInTheDocument();
  expect(screen.getByText("Next.js / FastAPI")).toBeInTheDocument();
});

test("links to the live demo separately from the title", () => {
  renderRow({ live: "https://example.vercel.app" });
  const live = screen.getByRole("link", { name: "Live demo" });
  expect(live).toHaveAttribute("href", "https://example.vercel.app");
  expect(live).toHaveAttribute("target", "_blank");
});

test("omits the live demo link when a project has no live URL", () => {
  renderRow();
  expect(screen.queryByRole("link", { name: "Live demo" })).toBeNull();
});
