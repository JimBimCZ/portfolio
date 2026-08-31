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

  try {
    // Warm the deployment before the recorded pass. The first load of a
    // sleeping Vercel function and an uncached CDN can take many seconds,
    // and that wait was landing straight in the recorded video. This
    // throwaway page shares the context's cache and cookies with the real
    // page that follows, but its own video is discarded (never renamed out
    // of TMP, so the closing rmSync sweeps it away).
    const warmup = await context.newPage();
    await warmup.goto(tour.url, { waitUntil: "networkidle", timeout: 60_000 });
    await warmup.close();

    const page = await context.newPage();
    await page.goto(tour.url, { waitUntil: "networkidle", timeout: 60_000 });
    await page.waitForTimeout(1500);

    // A tour can define `prepare` for an app whose resting state undersells
    // it (trader's untouched home screen has an empty positions table and
    // an empty performance chart). It runs before the poster is taken, so
    // the still shows the app populated instead. A failed prepare must
    // degrade to the plain resting-state poster, never fail the capture —
    // guarded the same way tour.run's own steps are.
    if (tour.prepare) {
      try {
        await tour.prepare(page);
      } catch (error) {
        console.log(
          `  prepare failed for ${slug}, poster falls back to resting state: ${String(error).split("\n")[0]}`,
        );
      }
    }

    // Poster after prepare (if any), before the rest of the tour moves
    // anything, so the still is a settled state rather than a half-finished
    // interaction.
    const shot = await page.screenshot();
    await sharp(shot).resize(VIEWPORT.width, VIEWPORT.height).webp({ quality: 82 })
      .toFile(join(OUT, `${slug}.webp`));

    if (tour.run) await tour.run(page);

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
