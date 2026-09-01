import { expect, test } from "@playwright/test";
import { carouselProjects } from "../src/content/projects";

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
  await expect(page.getByRole("tab", { name: "Games DB" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("each card opens its real deployment in a new tab", async ({ page }) => {
  await page.goto("/");
  for (const project of carouselProjects) {
    const link = page.getByRole("link", { name: new RegExp(project.title) }).first();
    await expect(link).toHaveAttribute("href", project.liveUrl!);
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
  await page.getByRole("tab", { name: "Trader" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Games DB" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("the page renders in both themes", async ({ page }) => {
  for (const scheme of ["dark", "light"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    await expect(page.getByRole("tablist")).toBeVisible();
  }
});

test("a phone visitor sees one card and can open the app", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Trader/ }).first()).toHaveAttribute(
    "target",
    "_blank",
  );
});
