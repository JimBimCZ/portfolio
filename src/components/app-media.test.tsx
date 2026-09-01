import { render, screen } from "@testing-library/react";
import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, expect, test, vi } from "vitest";
import type { Project } from "@/content/projects";
import { AppMedia } from "./app-media";

const project = {
  slug: "trader",
  title: "Trader",
  poster: "/work/trader.webp",
  posterAlt: "The Trader terminal with a streaming watchlist.",
  tour: "/work/trader.webm",
} as Project;

/** jsdom has no matchMedia; every test declares what the user asked for. */
function setReducedMotion(reduced: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduced && query.includes("prefers-reduced-motion"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

beforeEach(() => setReducedMotion(false));

test("always renders the poster, so the card is never empty", () => {
  render(<AppMedia project={project} active={false} />);
  expect(
    screen.getByRole("img", { name: "The Trader terminal with a streaming watchlist." }),
  ).toBeInTheDocument();
});

test("loads the poster eagerly even when the card is inactive", () => {
  // Inactive cards sit off-screen via a CSS transform rather than being
  // removed from the DOM, so native lazy loading never triggers for them —
  // they need to load regardless of position.
  render(<AppMedia project={project} active={false} />);
  expect(screen.getByRole("img")).toHaveAttribute("loading", "eager");
});

test("marks only the active poster as the LCP candidate", () => {
  // All posters load eagerly (above), but only the active one should be
  // ranked as the page's LCP image — via fetchPriority, not the deprecated
  // `priority` prop.
  const { rerender } = render(<AppMedia project={project} active={false} />);
  expect(screen.getByRole("img")).not.toHaveAttribute("fetchpriority");

  rerender(<AppMedia project={project} active />);
  expect(screen.getByRole("img")).toHaveAttribute("fetchpriority", "high");
});

test("plays the tour only on the active card", () => {
  const { container, rerender } = render(<AppMedia project={project} active={false} />);
  expect(container.querySelector("video")).toBeNull();

  rerender(<AppMedia project={project} active />);
  expect(container.querySelector("video")).not.toBeNull();
});

test("renders no video at all under reduced motion", () => {
  setReducedMotion(true);
  const { container } = render(<AppMedia project={project} active />);
  expect(container.querySelector("video")).toBeNull();
  expect(screen.getByRole("img")).toBeInTheDocument();
});

test("renders no video for a project without a tour", () => {
  const { container } = render(
    <AppMedia project={{ ...project, tour: undefined }} active />,
  );
  expect(container.querySelector("video")).toBeNull();
});

test("the initial static markup for an active card with a tour carries no video, so a reduced-motion visitor never sees one flash before hydration corrects it", () => {
  // The server can't know a visitor's OS preference, so the prerendered HTML
  // (what a reduced-motion visitor's browser paints first, and what
  // hydration must reconcile against) must default to "no video" rather than
  // rely on a post-paint effect to remove one.
  const staticHtml = renderToStaticMarkup(<AppMedia project={project} active />);
  expect(staticHtml).not.toContain("<video");

  // Hydrate that markup as a reduced-motion visitor's browser would, and
  // confirm the hydrated DOM stays free of a video too.
  setReducedMotion(true);
  const container = document.createElement("div");
  container.innerHTML = staticHtml;
  document.body.appendChild(container);

  act(() => {
    hydrateRoot(container, <AppMedia project={project} active />);
  });

  expect(container.querySelector("video")).toBeNull();

  document.body.removeChild(container);
});

test("the video is silent, looping and unobtrusive", () => {
  const { container } = render(<AppMedia project={project} active />);
  const video = container.querySelector("video")!;
  expect(video).toHaveAttribute("loop");
  expect(video.muted).toBe(true);
  expect(video).toHaveAttribute("playsInline");
});
