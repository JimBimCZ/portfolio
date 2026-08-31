/**
 * Captures a poster frame and a silent tour video for each carousel app, from
 * the live deployment. Re-runnable: `npm run capture` does all of them,
 * `npm run capture -- trader` does one.
 *
 * Videos are WebM because Playwright records WebM natively and no ffmpeg is
 * needed. A GIF at this size runs to several megabytes and bands visibly.
 */
import { chromium } from "@playwright/test";
import { mkdirSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { tours } from "./tours.mjs";

const OUT = join(process.cwd(), "public", "work");
const TMP = join(process.cwd(), ".capture-tmp");
const VIEWPORT = { width: 1440, height: 900 };

const only = process.argv.slice(2);
const targets = Object.entries(tours).filter(([slug]) =>
  only.length === 0 ? true : only.includes(slug),
);

mkdirSync(OUT, { recursive: true });
rmSync(TMP, { recursive: true, force: true });

const browser = await chromium.launch();

for (const [slug, tour] of targets) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    colorScheme: "dark",
    recordVideo: { dir: TMP, size: VIEWPORT },
  });
  const page = await context.newPage();

  try {
    await page.goto(tour.url, { waitUntil: "networkidle", timeout: 60_000 });
    await page.waitForTimeout(2000);

    // Poster first, before the tour moves anything, so the still is a clean
    // resting state rather than a half-finished interaction.
    const shot = await page.screenshot();
    await sharp(shot).resize(VIEWPORT.width, VIEWPORT.height).webp({ quality: 82 })
      .toFile(join(OUT, `${slug}.webp`));

    await tour.run(page);

    const video = page.video();
    await context.close(); // flushes the video file
    if (video) renameSync(await video.path(), join(OUT, `${slug}.webm`));
    console.log(`ok   ${slug}`);
  } catch (error) {
    await context.close();
    console.log(`FAIL ${slug}  ${String(error).split("\n")[0]}`);
    process.exitCode = 1;
  }
}

await browser.close();
rmSync(TMP, { recursive: true, force: true });
