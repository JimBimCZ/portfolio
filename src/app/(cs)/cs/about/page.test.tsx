import { render, screen, within } from "@testing-library/react";
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

// Job titles and employer names stay English in every locale (the way Czech
// CVs keep them). Inside a lang="cs" document that is an English run and
// needs its own lang="en", the same reasoning the spec already applies to
// the switch's "Čeština".
test("marks the English job titles and employers inside the Czech CV", () => {
  render(<CzechAbout />);

  const firstJob = copy.person.experience[0];
  const entries = within(
    screen.getByRole("list", { name: /praxe/i }),
  ).getAllByRole("listitem");
  const firstEntry = within(entries[0]);
  expect(firstEntry.getByRole("heading", { level: 3 })).toHaveAttribute("lang", "en");
  expect(firstEntry.getByText(firstJob.org)).toHaveAttribute("lang", "en");
});
