import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import Page, { metadata } from "./page";

const copy = getCopy("en");

test("titles the page and introduces the history", () => {
  render(<Page />);

  expect(
    screen.getByRole("heading", { level: 1, name: copy.pages.experience.title }),
  ).toBeInTheDocument();
  expect(screen.getByText(copy.pages.experience.lede)).toBeInTheDocument();
  expect(metadata.title).toBe(copy.meta.experience.title);
  expect(metadata.description).toBe(copy.meta.experience.description);
});

// Scoped per row rather than over the whole page: "Frontend Developer" is
// three of the four job titles, so a page-wide getByText finds several.
// This assertion used to live on /about, over a second hand-rolled copy of
// the same list. It follows the content to the page that owns it.
test("lists every role with its employer, dates and note, newest first", () => {
  const { container } = render(<Page />);

  const rows = container.querySelectorAll("dl > div");
  expect(rows).toHaveLength(copy.person.experience.length);

  copy.person.experience.forEach((job, index) => {
    const row = within(rows[index] as HTMLElement);
    expect(row.getByText(job.title)).toBeInTheDocument();
    expect(row.getByText(job.org)).toBeInTheDocument();
    expect(row.getByText(job.period)).toBeInTheDocument();
    expect(row.getByText(job.note)).toBeInTheDocument();
  });
});

// English needs no lang marking of its own — the counterpart assertion under
// /cs is the one that matters, and it is in the Czech test.
test("leaves job titles unmarked in the English tree", () => {
  const { container } = render(<Page />);

  const firstJob = copy.person.experience[0];
  const row = within(container.querySelector("dl > div") as HTMLElement);
  expect(row.getByText(firstJob.title)).not.toHaveAttribute("lang");
  expect(row.getByText(firstJob.org)).not.toHaveAttribute("lang");
});
