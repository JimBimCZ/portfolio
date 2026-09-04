import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import CzechExperience, { metadata } from "./page";

const copy = getCopy("cs");

test("renders the history in Czech", () => {
  render(<CzechExperience />);

  expect(
    screen.getByRole("heading", { level: 1, name: copy.pages.experience.title }),
  ).toBeInTheDocument();
  expect(screen.getByText(copy.pages.experience.lede)).toBeInTheDocument();
  for (const job of copy.person.experience) {
    expect(screen.getByText(job.note)).toBeInTheDocument();
  }
});

test("titles the page in Czech", () => {
  expect(metadata.title).toBe(copy.meta.experience.title);
  expect(metadata.description).toBe(copy.meta.experience.description);
});

// Job titles and employer names stay English in every locale (the way Czech
// CVs keep them). Inside a lang="cs" document that is an English run and
// needs its own lang="en" — the same reasoning the spec applies to the
// language switch's "Čeština". Moved here with the list itself, from /cs/about.
test("marks the English job titles and employers inside the Czech CV", () => {
  const { container } = render(<CzechExperience />);

  const firstJob = copy.person.experience[0];
  // Scoped to the first row: "Frontend Developer" is three of the four titles.
  const row = within(container.querySelector("dl > div") as HTMLElement);
  expect(row.getByText(firstJob.title)).toHaveAttribute("lang", "en");
  expect(row.getByText(firstJob.org)).toHaveAttribute("lang", "en");
  // `note` is translated per locale, so it must not be marked English.
  expect(row.getByText(firstJob.note)).not.toHaveAttribute("lang");
});
