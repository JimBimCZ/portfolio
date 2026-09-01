import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { site } from "./site";

describe("site metadata", () => {
  // metadataBase resolves every relative URL in the page's metadata, so a
  // placeholder here silently sends every share card to another domain.
  test("the canonical URL is a real absolute origin", () => {
    const url = new URL(site.url);
    expect(url.protocol).toBe("https:");
    expect(url.hostname).not.toMatch(/example\.(com|org|net)$/);
    expect(site.url.endsWith("/")).toBe(false);
  });

  test("the declared social card exists and is described", () => {
    expect(existsSync(join(process.cwd(), "public", site.ogImage))).toBe(true);
    expect(site.ogImageAlt.length).toBeGreaterThan(0);
  });
});
