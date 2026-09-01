import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { site } from "@/content/site";
import { SiteFooter } from "./site-footer";

test("offers the email address as a mailto link", () => {
  render(<SiteFooter />);

  expect(screen.getByRole("link", { name: site.email })).toHaveAttribute(
    "href",
    `mailto:${site.email}`,
  );
});

// The privacy notice is reachable from every page or it may as well not exist.
test("links to the privacy notice", () => {
  render(<SiteFooter />);

  expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute(
    "href",
    "/privacy",
  );
});

test("opens external profiles in a new tab", () => {
  render(<SiteFooter />);

  for (const link of site.links) {
    const anchor = screen.getByRole("link", { name: link.label });
    expect(anchor).toHaveAttribute("href", link.href);
    expect(anchor).toHaveAttribute("target", "_blank");
  }
});
