import type { Copy } from "./copy/types";

/**
 * Facts about the person behind the site that do not vary by locale — a
 * legal name, contact details, the canonical URL. Prose lives in
 * `copy.person` instead; see `src/content/copy/en.ts`.
 */
export const site = {
  name: "Vit Busek",
  email: "busek.vit@gmail.com",
  phone: "+420 608 961 227",
  url: "https://www.vitbusek.dev",
  /** Social card, 1200x630. Built from the lead app's poster by `node scripts/capture/og.mjs`. */
  ogImage: "/og.jpg",
  links: [{ label: "GitHub", href: "https://github.com/JimBimCZ" }],
  nav: [
    { key: "work", href: "/work" },
    { key: "about", href: "/about" },
    { key: "contact", href: "/contact" },
  ] satisfies { key: keyof Copy["ui"]["nav"]; href: string }[],
};
