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
