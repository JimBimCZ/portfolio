import { cs } from "./cs";
import { en } from "./en";
import type { Copy, Locale } from "./types";

export { LOCALES } from "./types";
export type { Copy, Locale } from "./types";

const dictionaries: Record<Locale, Copy> = { en, cs };

export function getCopy(locale: Locale): Copy {
  return dictionaries[locale];
}

/**
 * The URL prefix of a locale's tree: "" for English, which sits at the root,
 * and "/cs" for Czech. Every internal href is built from it, so a page never
 * links out of its own language.
 */
export function localePrefix(locale: Locale) {
  return locale === "en" ? "" : `/${locale}`;
}

/**
 * The same page in the other language tree: "/cs/work/trader" -> "/work/trader",
 * and "/work/trader" -> "/cs/work/trader". Exported for the language switch
 * (a Client Component) and for server-side metadata code alike, so neither
 * has to import from the other.
 */
export function counterpart(pathname: string) {
  if (pathname === "/cs" || pathname.startsWith("/cs/")) {
    return pathname.slice(3) || "/";
  }
  return pathname === "/" ? "/cs" : `/cs${pathname}`;
}
