import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Home from "./page";

vi.stubGlobal("matchMedia", (query: string) => ({
  matches: false,
  media: query,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

// The page is rendered standalone in these tests, without `layout.tsx`'s
// <main>, so queries run directly against `screen` rather than scoped
// `within(getByRole("main"))` — see the task-6 brief's note on this.

test("leads with the carousel of deployed applications", () => {
  render(<Home />);
  expect(
    screen.getByRole("region", { name: "Deployed applications" }),
  ).toBeInTheDocument();
});

test("states availability in the hero's spec block, without navigating", () => {
  render(<Home />);
  expect(screen.getByText(/open to new work/i)).toBeInTheDocument();
});

test("puts the track record above the skills, as the stronger evidence", () => {
  render(<Home />);
  const html = document.body.innerHTML;
  expect(html.indexOf("Track record")).toBeLessThan(html.indexOf("Skills"));
});

test("offers a direct way to make contact", () => {
  render(<Home />);
  expect(
    screen.getByRole("link", { name: /busek\.vit@gmail\.com/ }),
  ).toBeInTheDocument();
});
