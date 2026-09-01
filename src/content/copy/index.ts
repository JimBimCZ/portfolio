import { en } from "./en";
import type { Copy, Locale } from "./types";

export { LOCALES } from "./types";
export type { Copy, Locale } from "./types";

/** cs is added in task 5; until then both locales resolve to English. */
const dictionaries: Record<Locale, Copy> = { en, cs: en };

export function getCopy(locale: Locale): Copy {
  return dictionaries[locale];
}
