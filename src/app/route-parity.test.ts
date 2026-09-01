import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

/**
 * `counterpart()` (src/content/copy/index.ts) prefixes any English pathname
 * with `/cs` blindly — it has no way to know whether a Czech counterpart
 * actually exists. An English-only route therefore still renders a language
 * switch pointing at a Czech URL that 404s. Demonstrated in the 2026-09-01
 * review with an English-only `/uses` page: build and lint stayed green.
 *
 * This derives both route trees from the filesystem and asserts they mirror
 * each other, so adding a page to one tree without its counterpart fails
 * the suite instead of shipping a dead switch.
 */

const EN_ROOT = join(process.cwd(), "src", "app", "(en)");
const CS_ROOT = join(process.cwd(), "src", "app", "(cs)", "cs");

/** Route segments (relative to the given root) that have a `page.tsx`. "" is the root route. */
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

describe("route parity between the English and Czech trees", () => {
  test("every route with a page exists in both trees", () => {
    const en = collectRoutes(EN_ROOT).sort();
    const cs = collectRoutes(CS_ROOT).sort();

    expect(cs).toEqual(en);
  });
});
