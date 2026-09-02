import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { getCopy } from "@/content/copy";
import { LanguageSwitch } from "./language-switch";

const en = getCopy("en").ui.languageSwitch;
const cs = getCopy("cs").ui.languageSwitch;

const pathname = vi.hoisted(() => ({ current: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

test("offers the other language for the page you are on", () => {
  pathname.current = "/work/trader";
  render(<LanguageSwitch languageSwitch={en} />);
  expect(screen.getByRole("link", { name: "Čeština" })).toHaveAttribute(
    "href",
    "/cs/work/trader",
  );
});

test("links back to the same page in English from the Czech tree", () => {
  pathname.current = "/cs/work/trader";
  render(<LanguageSwitch languageSwitch={cs} />);
  expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
    "href",
    "/work/trader",
  );
});

test("marks the language you are reading, and does not link it away", () => {
  pathname.current = "/cs";
  render(<LanguageSwitch languageSwitch={cs} />);
  const current = screen.getByText("CS");
  expect(current).toHaveAttribute("aria-current", "true");
  expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("href", "/");
});

test("the home page of one tree maps to the home page of the other", () => {
  pathname.current = "/";
  render(<LanguageSwitch languageSwitch={en} />);
  expect(screen.getByRole("link", { name: "Čeština" })).toHaveAttribute("href", "/cs");
});

test("carries hrefLang and lang on the link to the other language", () => {
  pathname.current = "/work/trader";
  render(<LanguageSwitch languageSwitch={en} />);
  const link = screen.getByRole("link", { name: "Čeština" });
  expect(link).toHaveAttribute("hrefLang", "cs");
  expect(link).toHaveAttribute("lang", "cs");
});

test("names the switch landmark from the dictionary", () => {
  pathname.current = "/";
  render(<LanguageSwitch languageSwitch={en} />);
  expect(screen.getByRole("navigation", { name: en.label })).toBeInTheDocument();
});
