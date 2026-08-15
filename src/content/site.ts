/**
 * Single source of truth for everything about the person behind the site.
 * Edit this first — pages read from it rather than hardcoding copy.
 */
export const site = {
  name: "Vít Bušek",
  role: "Frontend & AI engineer",
  location: "Prague, CZ",
  tagline: "I build AI features that behave like software, not demos.",
  intro:
    "Next.js on the front, FastAPI behind it, and model output constrained to a typed schema so the interface can trust what comes back.",
  email: "busek.vit@gmail.com",
  url: "https://example.com",
  status: "Open to new work",
  /** Rendered as the spec block on the home and about pages. Keys stay short. */
  manifest: [
    ["role", "Frontend & AI engineer"],
    ["focus", "LLM features with typed, testable output"],
    ["stack", "TypeScript, Next.js, React, FastAPI"],
    ["based", "Prague, CZ — CET"],
    ["status", "Open to new work"],
  ] satisfies [string, string][],
  links: [{ label: "GitHub", href: "https://github.com/JimBimCZ" }],
  nav: [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};
