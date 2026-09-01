import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { getCopy } from "@/content/copy";
import type { LocalisedProject } from "@/content/localise";
import { AppCard } from "./app-card";

vi.stubGlobal("matchMedia", (query: string) => ({
  matches: false,
  media: query,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

const copy = getCopy("en");

const project = {
  slug: "trader",
  title: "Trader",
  status: "live",
  liveUrl: "https://trader-jimbimczs-projects.vercel.app",
  poster: "/work/trader.webp",
  posterAlt: "The Trader terminal.",
  metrics: [{ value: "501", label: "tests across the stack" }],
} as LocalisedProject;

test("the whole card is one link to the live deployment", () => {
  render(<AppCard project={project} active copy={copy} />);
  const link = screen.getByRole("link", { name: /Trader/ });
  expect(link).toHaveAttribute("href", project.liveUrl);
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
});

test("shows the metrics that carry the persuasion", () => {
  render(<AppCard project={project} active copy={copy} />);
  expect(screen.getByText("501")).toBeInTheDocument();
  expect(screen.getByText("tests across the stack")).toBeInTheDocument();
});

test("says when a project is still in development", () => {
  render(<AppCard project={{ ...project, status: "in-development" }} active copy={copy} />);
  expect(screen.getByText("In development")).toBeInTheDocument();
});

test("does not label a finished project", () => {
  render(<AppCard project={project} active copy={copy} />);
  expect(screen.queryByText("In development")).toBeNull();
});

test("surfaces demo credentials for an app behind sign-in", () => {
  render(
    <AppCard
      project={{
        ...project,
        signInRequired: true,
        demo: { email: "demo@example.com", password: "hunter2" },
      }}
      active
      copy={copy}
    />,
  );
  expect(screen.getByText("demo@example.com")).toBeInTheDocument();
  expect(screen.getByText("hunter2")).toBeInTheDocument();
});

test("warns that sign-in is required even before an account exists", () => {
  render(<AppCard project={{ ...project, signInRequired: true }} active copy={copy} />);
  expect(screen.getByText(/sign-in required/i)).toBeInTheDocument();
});

test("an inactive card's link drops out of the tab order, since it sits off-screen", () => {
  render(<AppCard project={project} active={false} copy={copy} />);
  expect(screen.getByRole("link", { name: /Trader/ })).toHaveAttribute("tabIndex", "-1");
});

test("the active card's link stays in the normal tab order", () => {
  render(<AppCard project={project} active copy={copy} />);
  expect(screen.getByRole("link", { name: /Trader/ })).not.toHaveAttribute("tabIndex");
});

test("the active card's link is marked aria-current, so AT users can tell it apart from the other four", () => {
  render(<AppCard project={project} active copy={copy} />);
  expect(screen.getByRole("link", { name: /Trader/ })).toHaveAttribute("aria-current", "true");
});

test("an inactive card's link carries no aria-current", () => {
  render(<AppCard project={project} active={false} copy={copy} />);
  expect(screen.getByRole("link", { name: /Trader/ })).not.toHaveAttribute("aria-current");
});
