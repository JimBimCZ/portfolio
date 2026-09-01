import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import CzechPrivacy, { metadata } from "./page";

const copy = getCopy("cs");

test("renders the notice in Czech", () => {
  render(<CzechPrivacy />);

  expect(
    screen.getByRole("heading", { level: 1, name: copy.pages.privacy.title }),
  ).toBeInTheDocument();
  for (const section of copy.person.privacy.sections) {
    expect(
      screen.getByRole("heading", { level: 2, name: section.heading }),
    ).toBeInTheDocument();
  }
});

// `formatShipped` can only give a nominative month, so the date is a value
// after a label rather than an object of the verb.
test("dates itself in grammatical Czech", () => {
  render(<CzechPrivacy />);

  expect(screen.getByText("Naposledy upraveno: září 2026.")).toBeInTheDocument();
});

test("titles the page in Czech", () => {
  expect(metadata.title).toBe(copy.meta.privacy.title);
  expect(metadata.description).toBe(copy.meta.privacy.description);
});
