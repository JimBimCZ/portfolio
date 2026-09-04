/**
 * The one poster `npm run capture` cannot take.
 *
 * Every other app in the carousel is deployed, so `capture.mjs` drives a live
 * URL from `tours.mjs`. This one has no deployment to drive: it is an app, a
 * Postgres with pgvector and a Keycloak realm in one compose file, with both
 * models baked into the image. So the poster is captured from the stack
 * running locally, which is still a real capture of the real app — the media
 * contract's rule is that posters are not mockups, not that they come from
 * Vercel.
 *
 * Before running: clone https://github.com/JimBimCZ/secure-llm, `cp
 * .env.example .env`, `docker compose up`, and wait for the health check.
 * Then, from this repository, `npm run capture:secure-llm`.
 *
 * The question is chosen to make retrieval visible: it is answered out of
 * three different documents, so the still shows what the app actually does
 * rather than a single paragraph that could have come from anywhere. Override
 * it with PKB_QUESTION, and the output path with PKB_OUT, to try another.
 */
import { chromium } from "@playwright/test";
import { join } from "node:path";
import sharp from "sharp";

const APP = "http://localhost:3000";
const OUT = process.env.PKB_OUT ?? join(process.cwd(), "public", "work", "secure-llm.webp");
const VIEWPORT = { width: 1440, height: 900 };
const QUESTION = process.env.PKB_QUESTION ?? "How should I size a PSU for a 105 W CPU and a modern GPU?";

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
  // The app is light-only. `capture.mjs` asks for dark because the deployed
  // apps honour it; asking here would just be ignored.
  colorScheme: "light",
});

try {
  const page = await context.newPage();
  await page.goto(APP, { waitUntil: "networkidle", timeout: 60_000 });

  // Sign-in is a Server Action that redirects to Keycloak, so the click has
  // to be awaited against the IdP's own origin rather than a load event.
  await Promise.all([
    page.waitForURL(/:8080\//, { timeout: 30_000 }),
    page.locator("main form button[type=submit]").click(),
  ]);
  await page.fill("#username", "alice");
  await page.fill("#password", "alice");
  await Promise.all([
    page.waitForURL(/localhost:3000/, { timeout: 30_000 }),
    page.click("#kc-login"),
  ]);

  await page.goto(`${APP}/ask`, { waitUntil: "networkidle", timeout: 60_000 });
  await page.locator("main input[type=text]").fill(QUESTION);
  await page.locator("main form button[type=submit]").click();

  // Citations are validated before the first word of prose, so the sources
  // list appearing is the signal that a real answer — not a refusal — is on
  // its way. Waiting on it rather than on a fixed delay keeps the still
  // honest when the model is slow.
  await page.getByRole("heading", { name: "Sources" }).waitFor({ timeout: 60_000 });
  await page.waitForTimeout(2_000);

  const shot = await page.screenshot();
  await sharp(shot)
    .resize(VIEWPORT.width, VIEWPORT.height)
    .webp({ quality: 82 })
    .toFile(OUT);
  console.log(`ok   secure-llm -> ${OUT}`);
} catch (error) {
  console.log(`FAIL secure-llm  ${String(error).split("\n")[0]}`);
  console.log("     is the compose stack up on :3000 and :8080?");
  process.exitCode = 1;
} finally {
  await context.close();
  await browser.close();
}
