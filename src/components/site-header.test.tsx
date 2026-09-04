import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { getCopy } from "@/content/copy";
import { site } from "@/content/site";
import { SiteHeader } from "./site-header";

const copy = getCopy("en");
const csCopy = getCopy("cs");

const pathname = vi.hoisted(() => ({ current: "/" }));

// The header takes the strings it renders, not the dictionary — every prop it
// takes is serialised into the flight payload of every page.
function propsFor(dictionary: typeof copy) {
  return {
    nav: dictionary.ui.nav,
    navLabel: dictionary.ui.navLabel,
    status: dictionary.person.status,
    languageSwitch: dictionary.ui.languageSwitch,
  };
}

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.current,
}));

test("marks the section the visitor is in as the current page", () => {
  pathname.current = "/work/trader";
  render(<SiteHeader {...propsFor(copy)} locale="en" />);
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
  render(<SiteHeader {...propsFor(copy)} locale="en" />);
  for (const name of ["Work", "Skills", "Experience", "About", "Contact"]) {
    expect(screen.getByRole("link", { name })).not.toHaveAttribute("aria-current");
  }
});

// Derived from site.nav rather than a hardcoded list, so adding a section
// without giving it a nav entry — or a label in one of the dictionaries —
// fails here rather than shipping a header that has quietly fallen behind.
test("links every section in site.nav, in both languages", () => {
  pathname.current = "/";
  for (const [dictionary, locale, prefix] of [
    [copy, "en", ""],
    [csCopy, "cs", "/cs"],
  ] as const) {
    const { unmount } = render(
      <SiteHeader {...propsFor(dictionary)} locale={locale} />,
    );
    for (const item of site.nav) {
      expect(
        screen.getByRole("link", { name: dictionary.ui.nav[item.key] }),
        `${locale} ${item.href}`,
      ).toHaveAttribute("href", `${prefix}${item.href}`);
    }
    unmount();
  }
});

test("marks the skills section as current while the visitor is on it", () => {
  pathname.current = "/cs/skills";
  render(<SiteHeader {...propsFor(csCopy)} locale="cs" />);

  expect(
    screen.getByRole("link", { name: csCopy.ui.nav.skills }),
  ).toHaveAttribute("aria-current", "page");
  expect(
    screen.getByRole("link", { name: csCopy.ui.nav.experience }),
  ).not.toHaveAttribute("aria-current");
});

test("shows the live-availability status", () => {
  render(<SiteHeader {...propsFor(copy)} locale="en" />);
  const status = screen.getByText(copy.person.status);
  expect(status.querySelector(".bg-live")).not.toBeNull();
});

test("offers a mailto link for direct contact", () => {
  render(<SiteHeader {...propsFor(copy)} locale="en" />);
  const link = screen.getByRole("link", { name: site.email });
  expect(link).toHaveAttribute("href", `mailto:${site.email}`);
});

// The reveal width is measured, not a named Tailwind breakpoint: below it the
// row does not have room for the longer Czech nav and language switch, so the
// cluster stays hidden until the width where that holds for both languages.
// It was 860 for a three-item nav; with five items the Czech nav wraps to two
// lines up to 1015px, so the reveal moved to 1024.
test("hides availability and email below the width the row actually fits", () => {
  render(<SiteHeader {...propsFor(copy)} locale="en" />);
  const link = screen.getByRole("link", { name: site.email });
  const group = link.closest(".hidden");
  expect(group).not.toBeNull();
  expect(group).toHaveClass("min-[1024px]:flex");
});

test("names the sections in the language of the page it sits on", () => {
  pathname.current = "/cs";
  render(<SiteHeader {...propsFor(csCopy)} locale="cs" />);
  expect(screen.getByRole("link", { name: csCopy.ui.nav.work })).toBeInTheDocument();
});

// The header is on every page, so one English href here leaks the whole site.
test("points the wordmark and the nav at the Czech tree", () => {
  pathname.current = "/cs/work";
  render(<SiteHeader {...propsFor(csCopy)} locale="cs" />);

  expect(screen.getByRole("link", { name: site.name })).toHaveAttribute(
    "href",
    "/cs",
  );
  expect(screen.getByRole("link", { name: csCopy.ui.nav.work })).toHaveAttribute(
    "href",
    "/cs/work",
  );
});

test("marks the current section from the prefixed path", () => {
  pathname.current = "/cs/work/trader";
  render(<SiteHeader {...propsFor(csCopy)} locale="cs" />);

  expect(screen.getByRole("link", { name: csCopy.ui.nav.work })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(
    screen.getByRole("link", { name: csCopy.ui.nav.about }),
  ).not.toHaveAttribute("aria-current");
});

test("names the nav landmark in the language of the page", () => {
  pathname.current = "/cs";
  render(<SiteHeader {...propsFor(csCopy)} locale="cs" />);

  expect(
    screen.getByRole("navigation", { name: csCopy.ui.navLabel }),
  ).toBeInTheDocument();
});

// The language switch is the whole feature's entry point — it has to be on
// the header, offering the counterpart of the page you are actually on.
test("renders the language switch, offering the Czech counterpart of the page", () => {
  pathname.current = "/work/trader";
  render(<SiteHeader {...propsFor(copy)} locale="en" />);

  expect(screen.getByRole("link", { name: "Čeština" })).toHaveAttribute(
    "href",
    "/cs/work/trader",
  );
});
