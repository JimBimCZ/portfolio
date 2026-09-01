import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { ContactPage } from "@/components/pages/contact";
import { getCopy } from "@/content/copy";
import { site } from "@/content/site";

const copy = getCopy("en");

test("links the email address as a mailto", () => {
  render(<ContactPage copy={copy} />);

  expect(screen.getByRole("link", { name: site.email })).toHaveAttribute(
    "href",
    `mailto:${site.email}`,
  );
});

test("links the phone number as a dialable tel with no spaces", () => {
  render(<ContactPage copy={copy} />);

  expect(screen.getByRole("link", { name: site.phone })).toHaveAttribute(
    "href",
    "tel:+420608961227",
  );
});

test("shows where he is based", () => {
  render(<ContactPage copy={copy} />);

  expect(screen.getByText(`${copy.person.location} — CET`)).toBeInTheDocument();
});
