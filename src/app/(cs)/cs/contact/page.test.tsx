import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import { site } from "@/content/site";
import CzechContact, { metadata } from "./page";

const copy = getCopy("cs");

test("renders the Czech contact copy with the shared address", () => {
  render(<CzechContact />);

  expect(
    screen.getByRole("heading", { level: 1, name: copy.pages.contact.title }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: site.email })).toHaveAttribute(
    "href",
    `mailto:${site.email}`,
  );
  expect(screen.getByText(copy.person.locationWithTimezone)).toBeInTheDocument();
});

test("titles the page in Czech", () => {
  expect(metadata.title).toBe(copy.meta.contact.title);
  expect(metadata.description).toBe(copy.meta.contact.description);
});
