import { notFound } from "next/navigation";

/**
 * Catches every unmatched URL under `/cs` so it 404s *inside* the Czech route
 * group rather than falling through to `global-not-found.tsx`.
 *
 * Without this, `/cs/nonsense` matches no route at all, and Next answers at the
 * routing level with the global page — which bypasses layouts by construction
 * and is therefore English and shell-less. Making the URL match a route here
 * means `notFound()` is thrown inside `(cs)`, so `(cs)/cs/not-found.tsx`
 * renders in `(cs)/layout.tsx`: Czech copy, Czech header and footer,
 * `<html lang="cs">`.
 *
 * Static segments win over a catch-all, so this never shadows a real page.
 * English needs no counterpart: the global page is already English.
 */
export default function CzechCatchAll(): never {
  notFound();
}
