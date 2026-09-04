import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import CzechAbout, { metadata } from "./page";

const copy = getCopy("cs");

test("renders the Czech bio", () => {
  render(<CzechAbout />);

  expect(
    screen.getByRole("heading", { level: 1, name: copy.pages.about.title }),
  ).toBeInTheDocument();
  for (const paragraph of copy.person.bio) {
    expect(screen.getByText(paragraph)).toBeInTheDocument();
  }
});

test("titles the page in Czech", () => {
  expect(metadata.title).toBe(copy.meta.about.title);
  expect(metadata.description).toBe(copy.meta.about.description);
});

// The employment history moved to /cs/experience, which is where the
// lang="en" marking of job titles and employers is now asserted.
test("no longer carries its own copy of the employment history", () => {
  render(<CzechAbout />);

  for (const job of copy.person.experience) {
    expect(screen.queryByText(job.note)).not.toBeInTheDocument();
  }
});
