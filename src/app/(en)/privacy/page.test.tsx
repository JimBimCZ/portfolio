import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { PrivacyPage } from "@/components/pages/privacy";
import { getCopy } from "@/content/copy";
import { site } from "@/content/site";

const copy = getCopy("en");

test("renders every summary row and every section", () => {
  render(<PrivacyPage copy={copy} locale="en" />);

  for (const [key, value] of copy.person.privacy.summary) {
    expect(screen.getByText(key)).toBeInTheDocument();
    expect(screen.getByText(value)).toBeInTheDocument();
  }
  for (const section of copy.person.privacy.sections) {
    expect(
      screen.getByRole("heading", { level: 2, name: section.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(section.body)).toBeInTheDocument();
  }
});

// A notice that does not say who is responsible or how to reach them is not a
// notice — those two facts are what the GDPR's transparency duty is about.
test("names who is responsible and how to reach them", () => {
  render(<PrivacyPage copy={copy} locale="en" />);

  expect(
    screen.getByText(`${site.name}, ${copy.person.location}`),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: site.email })).toHaveAttribute(
    "href",
    `mailto:${site.email}`,
  );
});

test("dates itself so a stale notice is visible", () => {
  render(<PrivacyPage copy={copy} locale="en" />);

  expect(screen.getByText(/Last updated \w+ \d{4}\./)).toBeInTheDocument();
});

// Regression: the "last updated" date is formatted with `formatShipped`,
// which takes a locale — it must use the page's locale, not always "en",
// or a Czech render would show an English month.
test("dates itself in the page's own locale", () => {
  const csCopy = getCopy("cs");
  render(<PrivacyPage copy={csCopy} locale="cs" />);

  expect(screen.getByText(/září 2026/)).toBeInTheDocument();
  expect(screen.queryByText(/September/)).not.toBeInTheDocument();
});
