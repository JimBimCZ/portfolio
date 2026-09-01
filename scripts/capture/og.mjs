/**
 * Builds the social card from the lead app's poster.
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
