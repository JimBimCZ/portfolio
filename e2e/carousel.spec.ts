import { expect, test } from "@playwright/test";
import { getCopy } from "../src/content/copy";
import { localiseCarousel } from "../src/content/localise";

const carouselProjects = localiseCarousel(getCopy("en"));

// Whatever the second slide happens to be. The tests below are about the
// controls moving one slide, not about which project sits there.
const second = carouselProjects[1].title;

test("the carousel opens on trader with its poster showing", async ({ page }) => {
  await page.goto("/");
  const tabs = page.getByRole("tab");
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await expect(tabs.first()).toHaveAccessibleName("Trader");
  await expect(page.getByRole("img").first()).toBeVisible();
});

test("the next control changes the active application", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Next app" }).click();
  await expect(page.getByRole("tab", { name: second })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

// A project with no deployment links to its repository instead, so the
// assertion is that the card opens the real thing — whichever that is.
test("each card opens its real deployment or its source in a new tab", async ({ page }) => {
  await page.goto("/");
  for (const project of carouselProjects) {
    const link = page.getByRole("link", { name: new RegExp(project.title) }).first();
    await expect(link).toHaveAttribute("href", (project.liveUrl ?? project.repo)!);
    await expect(link).toHaveAttribute("target", "_blank");
  }
});

test("posters decode rather than rendering as broken images", async ({ page }) => {
  await page.goto("/");
  await expect
    .poll(() =>
      page.getByRole("img").evaluateAll((images) =>
        images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
      ),
    )
    .toBe(true);
});

test("no video is loaded when the visitor asks for reduced motion", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("video")).toHaveCount(0);
  await context.close();
});

test("the carousel is operable from the keyboard alone", async ({ page }) => {
  await page.goto("/");
  // Press Tab from the top of the page rather than focusing the tab
  // directly, so this exercises the roving tabindex (app-card.tsx sets
  // tabIndex={-1} on every inactive slide) rather than bypassing it.
  let reachedTablist = false;
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    if ((await focused.getAttribute("role")) === "tab") {
      reachedTablist = true;
      break;
    }
  }
  expect(reachedTablist).toBe(true);
  await expect(page.locator(":focus")).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: second })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("the page renders in both themes", async ({ page }) => {
  const backgrounds: Record<string, string> = {};
  for (const scheme of ["dark", "light"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    const tablist = page.getByRole("tablist");
    await expect(tablist).toBeVisible();
    backgrounds[scheme] = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
  }
  // A scheme-independent assertion (just "visible") would still pass if the
  // light theme rendered white text on a white background. Confirm the two
  // schemes actually paint differently.
  expect(backgrounds.dark).not.toBe(backgrounds.light);
});

test("a phone visitor sees one card and can open the app", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  // toBeVisible() doesn't account for an ancestor's overflow: hidden clip —
  // both the active and the next card report visible under that check even
  // though only one is actually on screen. Compare bounding boxes against
  // the clipping viewport (the carousel's "overflow-hidden" track) instead.
  const track = page.locator('[aria-roledescription="carousel"] .overflow-hidden').first();
  const trackBox = await track.boundingBox();
  expect(trackBox).not.toBeNull();

  const activeCard = page.getByRole("link", { name: /Trader/ }).first();
  await expect(activeCard).toBeVisible();
  const activeBox = await activeCard.boundingBox();
  expect(activeBox).not.toBeNull();
  // The active card sits fully inside the clipping track.
  expect(activeBox!.x).toBeGreaterThanOrEqual(trackBox!.x);
  expect(activeBox!.x + activeBox!.width).toBeLessThanOrEqual(trackBox!.x + trackBox!.width);

  const nextCard = page.getByRole("link", { name: /Games DB/ }).first();
  const nextBox = await nextCard.boundingBox();
  expect(nextBox).not.toBeNull();
  // The next slide starts at or beyond the track's right edge, so the
  // ancestor's overflow: hidden clips all of it — a phone visitor sees
  // exactly one card, not a sliver of the next one.
  expect(nextBox!.x).toBeGreaterThanOrEqual(trackBox!.x + trackBox!.width);

  await expect(activeCard).toHaveAttribute("target", "_blank");
});
