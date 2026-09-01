import { expect, test } from "@playwright/test";
import { getCopy } from "../src/content/copy";

test("a visitor switches to Czech and stays on the same page", async ({ page }) => {
  await page.goto("/work/trader");
  await page.getByRole("link", { name: "Čeština" }).click();
  await expect(page).toHaveURL("/cs/work/trader");
  await expect(page.locator("html")).toHaveAttribute("lang", "cs");
  await expect(
    page.getByRole("heading", { level: 1, name: "Trader" }),
  ).toBeVisible();
});

test("and switches back", async ({ page }) => {
  await page.goto("/cs/work/trader");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL("/work/trader");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("the Czech home page carries Czech copy and a working carousel", async ({ page }) => {
  await page.goto("/cs");
  await expect(page.getByText(getCopy("cs").person.tagline)).toBeVisible();
  const region = page.getByRole("region", {
    name: getCopy("cs").ui.carousel.region,
  });
  await expect(region).toBeVisible();
  await page.getByRole("button", { name: getCopy("cs").ui.carousel.next }).click();
  await expect(page.getByRole("tab", { selected: true })).not.toHaveText("Trader");
});

test("English URLs are untouched by the Czech tree", async ({ page }) => {
  for (const path of ["/", "/work", "/work/legal", "/about", "/contact", "/privacy"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  }
});

test("an unknown Czech project shows the Czech not-found page", async ({ page }) => {
  await page.goto("/cs/work/does-not-exist");
  await expect(page.locator("html")).toHaveAttribute("lang", "cs");
  // "404" alone is identical in both dictionaries, so it would still pass if
  // the page silently fell back to English copy. Assert the Czech title
  // itself, read from the same dictionary the page renders from.
  await expect(
    page.getByRole("heading", { name: getCopy("cs").pages.notFound.title }),
  ).toBeVisible();
});
