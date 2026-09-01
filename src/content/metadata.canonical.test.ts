import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { describe, expect, test } from "vitest";

/**
 * `alternatesFor` used to default `canonical` to the English path, so a
 * Czech page written the obvious way (`alternatesFor(path)`, or later,
 * `alternatesFor(path, "en")` by a copy-paste slip) would self-canonicalise
 * to English and be dropped from the index — see the fix for finding 3 in
 * the 2026-09-01 review. The signature now requires a locale, which makes
 * the omission a compile error, but nothing stops the wrong literal being
 * passed.
 *
 * The first version of this test imported six page modules by hand, so it
 * only guarded the pages that existed when it was written — a reviewer
 * proved the hole by adding a seventh page with the same copy-paste slip
 * and getting a clean suite. This walks the Czech route tree the same way
 * `src/app/route-parity.test.ts` does and imports whatever `page.tsx`
 * modules it finds, so a page added later is checked without anyone having
 * to remember to add a case for it here.
 */

const CS_ROOT = join(process.cwd(), "src", "app", "(cs)", "cs");

/** Route segments (relative to CS_ROOT) that have a `page.tsx`. "" is the root route. */
function collectRoutes(dir: string, base = ""): string[] {
  const routes: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      routes.push(...collectRoutes(full, base ? `${base}/${entry}` : entry));
    } else if (entry === "page.tsx") {
      routes.push(base);
    }
  }
  return routes;
}

/** Placeholder value for a dynamic route segment, keyed by its param name. */
const DYNAMIC_PARAMS: Record<string, string> = { slug: "trader" };

type PageModule = {
  metadata?: Metadata;
  generateMetadata?: (props: {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  }) => Metadata | Promise<Metadata>;
};

describe("Czech page canonicals", () => {
  for (const route of collectRoutes(CS_ROOT).sort()) {
    test(route || "home", async () => {
      const specifier = `@/app/(cs)/cs${route ? `/${route}` : ""}/page`;
      const mod: PageModule = await import(specifier);

      const params: Record<string, string> = {};
      for (const segment of route.split("/")) {
        const dynamic = /^\[(.+)\]$/.exec(segment);
        if (dynamic) params[dynamic[1]] = DYNAMIC_PARAMS[dynamic[1]];
      }

      const metadata = mod.generateMetadata
        ? await mod.generateMetadata({
            params: Promise.resolve(params),
            searchParams: Promise.resolve({}),
          })
        : mod.metadata;

      expect(metadata?.alternates?.canonical).toMatch(/^\/cs(\/|$)/);
    });
  }
});
