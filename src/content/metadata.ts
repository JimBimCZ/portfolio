import { counterpart } from "./copy";

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
 * `canonical` defaults to the English path passed in — a Czech route
 * overrides it with its own URL via `counterpart` — `languages` lists both
 * trees, and `x-default` falls back to English for readers whose language
 * Google cannot match. `path` is always the English path; `counterpart`
 * (already used to link the two trees for the language switch) does the
 * English-to-Czech translation.
 */
export function alternatesFor(path: string): Alternates {
  return {
    canonical: path,
    languages: {
      en: path,
      cs: counterpart(path),
      "x-default": path,
    },
  };
}
