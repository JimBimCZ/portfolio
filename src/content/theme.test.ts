import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

/** Pull `--name: #hex;` pairs out of the first block matching `selector`. */
function tokens(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`no block for ${selector}`);
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  const body = css.slice(open + 1, close);
  const out: Record<string, string> = {};
  for (const [, name, value] of body.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    out[name] = value;
  }
  return out;
}

function luminance(hex: string): number {
  const channel = (pair: string) => {
    const srgb = parseInt(pair, 16) / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  };
  const r = channel(hex.slice(1, 3));
  const g = channel(hex.slice(3, 5));
  const b = channel(hex.slice(5, 7));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe.each([
  ["dark", ":root {"],
  ["light", "@media (prefers-color-scheme: light)"],
])("%s theme", (_name, selector) => {
  const t = tokens(selector);

  test.each(["text", "muted", "dim", "accent", "live"])(
    "%s clears AA against the canvas",
    (token) => {
      expect(contrast(t[token], t.canvas)).toBeGreaterThanOrEqual(4.5);
    },
  );

  test("muted is more prominent than dim, so the hierarchy reads", () => {
    expect(contrast(t.muted, t.canvas)).toBeGreaterThan(contrast(t.dim, t.canvas));
  });

  test("text on a raised surface stays readable", () => {
    expect(contrast(t.text, t.raised)).toBeGreaterThanOrEqual(4.5);
  });

  test("live clears AA against the surface, since a status label may sit on a card", () => {
    expect(contrast(t.live, t.surface)).toBeGreaterThanOrEqual(4.5);
  });
});
