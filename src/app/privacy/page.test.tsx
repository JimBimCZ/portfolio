import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { site } from "@/content/site";
import PrivacyPage from "./page";

test("renders every summary row and every section", () => {
  render(<PrivacyPage />);

  for (const [key, value] of site.privacy.summary) {
    expect(screen.getByText(key)).toBeInTheDocument();
    expect(screen.getByText(value)).toBeInTheDocument();
  }
  for (const section of site.privacy.sections) {
    expect(
      screen.getByRole("heading", { level: 2, name: section.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(section.body)).toBeInTheDocument();
  }
});

// A notice that does not say who is responsible or how to reach them is not a
// notice — those two facts are what the GDPR's transparency duty is about.
test("names who is responsible and how to reach them", () => {
  render(<PrivacyPage />);

  expect(screen.getByText(`${site.name}, ${site.location}`)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: site.email })).toHaveAttribute(
    "href",
    `mailto:${site.email}`,
  );
});

test("dates itself so a stale notice is visible", () => {
  render(<PrivacyPage />);

  expect(screen.getByText(/Last updated \w+ \d{4}\./)).toBeInTheDocument();
});
