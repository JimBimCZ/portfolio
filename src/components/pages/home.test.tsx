import { render, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { HomePage } from "@/components/pages/home";
import { getCopy, type Locale } from "@/content/copy";

vi.stubGlobal("matchMedia", (query: string) => ({
  matches: false,
  media: query,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

/**
 * Reads the cap out of the hero's `clamp(min,preferred,max)` type size — the
 * term that governs at desktop widths, where the fold problem shows up.
 */
function heroSizeCap(locale: Locale) {
  // Both locales are measured inside one test, so each render is torn down
  // straight away — Testing Library's cleanup only runs between tests, and a
  // second <h1> in the document would make the query ambiguous.
  const view = render(<HomePage copy={getCopy(locale)} locale={locale} />);
  try {
    const className = within(view.container).getByRole("heading", { level: 1 })
      .className;
    const clamp = className.match(/clamp\(([^)]*)\)/);
    if (!clamp) {
      throw new Error(`no clamp() in the ${locale} hero: ${className}`);
    }
    return Number.parseFloat(clamp[1].split(",")[2]);
  } finally {
    view.unmount();
  }
}

// The Czech tagline is half again as long as the English one, so at a shared
// type scale it wraps far deeper and pushes the hero's CTAs off screen. The
// sizes are tuned per locale; what must hold is the ordering.
test("scales the Czech hero below the English one", () => {
  expect(heroSizeCap("cs")).toBeLessThan(heroSizeCap("en"));
});

test("keeps the Czech hero larger than the site's ordinary headings", () => {
  expect(heroSizeCap("cs")).toBeGreaterThan(3.25);
});
