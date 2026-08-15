import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { SiteHeader } from "./site-header";

const pathname = vi.hoisted(() => ({ current: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.current,
}));

test("marks the section the visitor is in as the current page", () => {
  pathname.current = "/work/kanban";
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
