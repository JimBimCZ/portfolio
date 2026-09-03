import { expect, test } from "@playwright/test";
import { getCopy } from "../src/content/copy";
import { projects } from "../src/content/projects";

test("a visitor can get from the home page to a project's source", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "View work" }).click();
  await expect(page).toHaveURL("/work");

  await page.getByRole("link", { name: "Legal Document Creator" }).click();
  await expect(page).toHaveURL("/work/legal");
  await expect(
    page.getByRole("heading", { level: 1, name: "Legal Document Creator" }),
  ).toBeVisible();

  await expect(page.getByRole("link", { name: "Source" })).toHaveAttribute(
    "href",
    "https://github.com/JimBimCZ/legal",
  );
});

test("the work page lists every project with its screenshot", async ({ page }) => {
  await page.goto("/work");

  for (const project of projects) {
    await expect(page.getByRole("link", { name: project.title })).toBeVisible();
  }

  const screenshots = page.getByRole("img");
  await expect(screenshots).toHaveCount(projects.filter((p) => p.poster).length);
  for (const image of await screenshots.all()) {
    await expect(image).toBeVisible();
  }
});

test("screenshots actually load rather than rendering as broken images", async ({
  page,
}) => {
  await page.goto("/work");

  // naturalWidth is 0 until the file has actually decoded, so poll rather than
  // reading it once on a page that may still be fetching.
  await expect
    .poll(() =>
      page
        .getByRole("img")
        .evaluateAll((images) =>
          images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
        ),
    )
    .toBe(true);
});

test("the current section is marked in the navigation", async ({ page }) => {
  await page.goto("/work");
  // exact: true — the /work log now includes a "Work Planner" row, whose
  // link name otherwise matches this substring query too.
  await expect(
    page.getByRole("link", { name: "Work", exact: true }),
  ).toHaveAttribute("aria-current", "page");

  await page.getByRole("link", { name: "About" }).click();
  await expect(page.getByRole("link", { name: "About" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(
    page.getByRole("link", { name: "Work", exact: true }),
  ).not.toHaveAttribute("aria-current", "page");
});

test("an unknown project shows the not-found page", async ({ page }) => {
  const response = await page.goto("/work/not-a-real-project");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "That page does not exist." }),
  ).toBeVisible();
});

test("an unmatched URL shows the global not-found page", async ({ page }) => {
  const response = await page.goto("/no-such-page");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "That page does not exist." }),
  ).toBeVisible();
  // global-not-found bypasses the layouts, so unlike the route-level 404 above
  // this page carries no site header and titles itself without the template.
  // Only the English tree reaches it: `/cs/...` is caught by the catch-all in
  // the (cs) group instead — see the Czech case in localisation.spec.ts.
  await expect(page.getByRole("banner")).toHaveCount(0);
  await expect(page).toHaveTitle("404 — Vit Busek");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("the Czech home page is served in Czech", async ({ page }) => {
  await page.goto("/cs");

  await expect(page.locator("html")).toHaveAttribute("lang", "cs");
  await expect(
    page.getByRole("heading", { level: 1, name: getCopy("cs").person.tagline }),
  ).toBeVisible();
});

test("the privacy notice is reachable from every page's footer", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("contentinfo").getByRole("link", { name: "Privacy" }).click();
  await expect(page).toHaveURL("/privacy");
  await expect(
    page.getByRole("heading", { level: 1, name: "Privacy" }),
  ).toBeVisible();
});

test("the contact page exposes a usable mailto link", async ({ page }) => {
  await page.goto("/contact");

  // The address also appears in the footer, so scope to the page body.
  await expect(
    page.getByRole("main").getByRole("link", { name: "busek.vit@gmail.com" }),
  ).toHaveAttribute("href", "mailto:busek.vit@gmail.com");
});

test("a project page shows its architecture and the decisions behind it", async ({ page }) => {
  await page.goto("/work/trader");
  const main = page.getByRole("main");

  await expect(
    main.getByRole("heading", { level: 2, name: "Technical design" }),
  ).toBeVisible();
  await expect(main.getByRole("heading", { level: 3, name: "Client" })).toBeVisible();
  await expect(main.getByText("SSE /api/market/stream")).toBeVisible();
  // Playwright's getByText is substring-matching and strict: the decision text
  // appears in the <li>, the wrapping <span> and the inner one, so take the
  // first rather than tripping strict mode on three legitimate matches.
  await expect(main.getByText("One FastAPI app, two deployments.").first()).toBeVisible();
});

// Work Planner has the densest diagram — four bands, eleven nodes and three
// gutter lanes — so it is where a layout that does not fit shows up first.
test("the densest diagram fits a phone without scrolling sideways", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/work/work-planner");
  await expect(
    page.getByRole("heading", { level: 2, name: "Technical design" }),
  ).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
