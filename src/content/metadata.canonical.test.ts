import { describe, expect, test } from "vitest";

/**
 * `alternatesFor` used to default `canonical` to the English path, so a
 * Czech page written the obvious way (`alternatesFor(path)`, or later,
 * `alternatesFor(path, "en")` by a copy-paste slip) would self-canonicalise
 * to English and be dropped from the index — see the fix for finding 3 in
 * the 2026-09-01 review. The signature now requires a locale, which makes
 * the omission a compile error, but nothing stops the wrong literal being
 * passed. This test imports every Czech page module's metadata directly and
 * checks the canonical it actually produces, so that mistake fails the
 * suite rather than shipping.
 */
describe("Czech page canonicals", () => {
  test("home", async () => {
    const { metadata } = await import("@/app/(cs)/cs/page");
    expect(metadata.alternates?.canonical).toMatch(/^\/cs(\/|$)/);
  });

  test("about", async () => {
    const { metadata } = await import("@/app/(cs)/cs/about/page");
    expect(metadata.alternates?.canonical).toMatch(/^\/cs(\/|$)/);
  });

  test("contact", async () => {
    const { metadata } = await import("@/app/(cs)/cs/contact/page");
    expect(metadata.alternates?.canonical).toMatch(/^\/cs(\/|$)/);
  });

  test("privacy", async () => {
    const { metadata } = await import("@/app/(cs)/cs/privacy/page");
    expect(metadata.alternates?.canonical).toMatch(/^\/cs(\/|$)/);
  });

  test("work", async () => {
    const { metadata } = await import("@/app/(cs)/cs/work/page");
    expect(metadata.alternates?.canonical).toMatch(/^\/cs(\/|$)/);
  });

  test("work/[slug]", async () => {
    const { generateMetadata } = await import("@/app/(cs)/cs/work/[slug]/page");
    type Args = Parameters<typeof generateMetadata>[0];
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "trader" }),
      searchParams: Promise.resolve({}),
    } as Args);
    expect(metadata.alternates?.canonical).toMatch(/^\/cs(\/|$)/);
  });
});
