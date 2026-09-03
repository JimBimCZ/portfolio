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

test("puts the track record above the skills, as the stronger evidence", () => {
  render(<HomePage copy={copy} locale="en" />);
  const html = document.body.innerHTML;
  expect(html.indexOf("Track record")).toBeLessThan(html.indexOf("Skills"));
});

test("offers a direct way to make contact", () => {
  render(<HomePage copy={copy} locale="en" />);
  expect(
    screen.getByRole("link", { name: /busek\.vit@gmail\.com/ }),
  ).toBeInTheDocument();
});
