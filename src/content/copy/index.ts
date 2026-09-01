import { cs } from "./cs";
import { en } from "./en";
import type { Copy, Locale } from "./types";

export { LOCALES } from "./types";
export type { Copy, Locale } from "./types";

const dictionaries: Record<Locale, Copy> = { en, cs };

export function getCopy(locale: Locale): Copy {
  return dictionaries[locale];
}
