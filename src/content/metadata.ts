import { counterpart, type Locale } from "./copy";

/**
 * Narrower than `Metadata["alternates"]`, which makes every field optional —
 * this always produces all three, so callers (and this module's tests) don't
 * have to guard against `undefined`. A required-fields object is assignable
 * wherever the wider, all-optional `Metadata["alternates"]` is expected.
 */
type Alternates = {
  canonical: string;
  languages: {
    en: string;
    cs: string;
    "x-default": string;
  };
};

/**
 * Relates an English path to its Czech counterpart for search engines.
 * `path` is always the English path; `counterpart` (already used to link the
 * two trees for the language switch) does the English-to-Czech translation.
 * `locale` picks which tree's URL is `canonical` — there is no default, so a
 * Czech page cannot forget to pass it and self-canonicalise to English (the
 * mistake this signature exists to close off). `languages` lists both trees
 * regardless of locale, and `x-default` falls back to English for readers
 * whose language Google cannot match.
 */
export function alternatesFor(path: string, locale: Locale): Alternates {
  return {
    canonical: locale === "cs" ? counterpart(path) : path,
    languages: {
      en: path,
      cs: counterpart(path),
      "x-default": path,
    },
  };
}
