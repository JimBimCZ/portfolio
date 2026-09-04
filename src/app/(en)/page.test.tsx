import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { HomePage } from "@/components/pages/home";
import { getCopy } from "@/content/copy";

vi.stubGlobal("matchMedia", (query: string) => ({
  matches: false,
  media: query,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

const copy = getCopy("en");

// The page is rendered standalone in these tests, without `layout.tsx`'s
// <main>, so queries run directly against `screen` rather than scoped
// `within(getByRole("main"))`.

test("leads with the carousel of deployed applications", () => {
  render(<HomePage copy={copy} locale="en" />);
  expect(
    screen.getByRole("region", { name: "Deployed applications" }),
  ).toBeInTheDocument();
});

test("states availability in the hero's spec block, without navigating", () => {
  render(<HomePage copy={copy} locale="en" />);
  expect(screen.getByText(/open to new work/i)).toBeInTheDocument();
});

// Skills first: it reads on from the carousel directly above it, which is the
// evidence every row of the matrix cites. The employment history answers a
// different question and follows.
test("puts the skills above the track record, reading on from the carousel", () => {
  render(<HomePage copy={copy} locale="en" />);
  const html = document.body.innerHTML;
  expect(html.indexOf("Skills")).toBeLessThan(html.indexOf("Track record"));
});

test("sends each section to the page that carries it in full", () => {
  render(<HomePage copy={copy} locale="en" />);
  expect(
    screen.getByRole("link", { name: copy.pages.home.allSkills }),
  ).toHaveAttribute("href", "/skills");
  expect(
    screen.getByRole("link", { name: copy.pages.home.fullHistory }),
  ).toHaveAttribute("href", "/experience");
});

test("offers a direct way to make contact", () => {
  render(<HomePage copy={copy} locale="en" />);
  expect(
    screen.getByRole("link", { name: /busek\.vit@gmail\.com/ }),
  ).toBeInTheDocument();
});
