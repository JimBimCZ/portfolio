/**
 * Builds the social card from trader's poster.
 *
 * Deliberately not the carousel's first slide — that order is about what a
 * visitor should meet first on the site, while this crops to 1200x630 and is
 * judged on its own. Trader's dense chart survives that crop; work-planner's
 * board, which leads the carousel, is mostly empty below the columns.
 *
 * Run after a capture that changes `public/work/trader.webp`:
 *   node scripts/capture/og.mjs
 *
 * JPEG rather than WebP because the platforms that matter here (LinkedIn
 * above all) still render WebP cards unreliably, and 1200x630 because that
 * is the size every one of them crops to.
 */
import { stat } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = "public/work/trader.webp";
const TARGET = "public/og.jpg";

await sharp(SOURCE)
  .resize(1200, 630, { fit: "cover", position: "top" })
  .jpeg({ quality: 82 })
  .toFile(TARGET);

const { size } = await stat(TARGET);
console.log(`${TARGET} written from ${SOURCE} (${Math.round(size / 1024)}KB)`);
