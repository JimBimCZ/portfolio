import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { getCopy } from "@/content/copy";
import { site } from "@/content/site";
import { SiteHeader } from "./site-header";

const copy = getCopy("en");

const pathname = vi.hoisted(() => ({ current: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.current,
}));

test("marks the section the visitor is in as the current page", () => {
  pathname.current = "/work/trader";
  render(<SiteHeader />);
  expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute(
    "aria-current",
  );
});

test("marks nothing as current on the home page", () => {
  pathname.current = "/";
  render(<SiteHeader />);
  for (const name of ["Work", "About", "Contact"]) {
    expect(screen.getByRole("link", { name })).not.toHaveAttribute("aria-current");
  }
});

test("shows the live-availability status", () => {
  render(<SiteHeader />);
  const status = screen.getByText(copy.person.status);
  expect(status.querySelector(".bg-live")).not.toBeNull();
});

test("offers a mailto link for direct contact", () => {
  render(<SiteHeader />);
  const link = screen.getByRole("link", { name: site.email });
  expect(link).toHaveAttribute("href", `mailto:${site.email}`);
});

test("hides availability and email below the sm breakpoint", () => {
  render(<SiteHeader />);
  const link = screen.getByRole("link", { name: site.email });
  const group = link.closest(".hidden");
  expect(group).not.toBeNull();
  expect(group).toHaveClass("sm:flex");
});
