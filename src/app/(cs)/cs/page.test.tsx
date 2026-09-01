import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { getCopy } from "@/content/copy";
import CzechHome from "./page";

vi.stubGlobal("matchMedia", (query: string) => ({
  matches: false,
  media: query,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

const copy = getCopy("cs");

test("leads with the Czech tagline", () => {
  render(<CzechHome />);

  expect(
    screen.getByRole("heading", { level: 1, name: copy.person.tagline }),
  ).toBeInTheDocument();
});

test("renders the same page body as the English home, in Czech", () => {
  render(<CzechHome />);

  expect(
    screen.getByRole("region", { name: copy.ui.carousel.region }),
  ).toBeInTheDocument();
  expect(screen.getByText(copy.pages.home.trackRecord)).toBeInTheDocument();
});

// A Czech page that links to /work drops the reader back into English.
test("keeps every internal link inside the Czech tree", () => {
  render(<CzechHome />);

  const internal = screen
    .getAllByRole("link")
    .map((link) => link.getAttribute("href") ?? "")
    .filter((href) => href.startsWith("/"));

  expect(internal.length).toBeGreaterThan(0);
  for (const href of internal) {
    expect(href.startsWith("/cs/")).toBe(true);
  }
});
