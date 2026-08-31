import { render, screen } from "@testing-library/react";
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

test("the video is silent, looping and unobtrusive", () => {
  const { container } = render(<AppMedia project={project} active />);
  const video = container.querySelector("video")!;
  expect(video).toHaveAttribute("loop");
  expect(video.muted).toBe(true);
  expect(video).toHaveAttribute("playsInline");
});
