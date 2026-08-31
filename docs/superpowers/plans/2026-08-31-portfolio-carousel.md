# Portfolio Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio home page around a carousel of Vit's deployed applications, backed by an evidence-linked skills section, in a muted dark-first "Graphite" design.

**Architecture:** Content stays typed files in `src/content/`; pages read from them and no page hardcodes copy. The carousel is a single Client Component holding the active-slide index; every card is an `<a>` to the live deployment. Media is a poster image in the static HTML with an optional WebM tour that plays only on the active slide. The site stays fully static — no runtime data source.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4 (configured in CSS), TypeScript strict, Vitest + Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-31-portfolio-workspace-design.md`

## Global Constraints

- **Name is `Vit Busek`** — no diacritics, anywhere: copy, metadata, title template, alt text.
- **Never write a `dark:` variant.** Both themes define every token; `prefers-color-scheme` swaps the values. A raw hex in a component means a token is missing.
- **Dark is the default.** `:root` holds dark values; `@media (prefers-color-scheme: light)` swaps them.
- **Two typefaces only:** Schibsted Grotesk (structural) and JetBrains Mono (numbers, URLs, labels, evidence tags).
- **No iframes.** Considered and rejected in the spec.
- **No auto-advancing carousel.**
- **`prefers-reduced-motion: reduce` means no `<video>` is rendered at all**, not a faster transition.
- Every media container has a fixed `aspect-ratio` (16/10) so nothing shifts as media loads.
- Contrast must clear WCAG AA (4.5:1) in both themes, measured by test rather than asserted.
- The build must stay static and type-check clean: `npm run build && npm run lint && npm test`.
- **Per user instruction:** at the end of every task, commit, push the branch, and open a PR. Never push to `main`.

### Palette correction (supersedes the spec's table)

The spec required contrast to be measured rather than assumed. It was measured while writing this plan, and three values fail AA against their backgrounds:

| Token | Spec value | Measured | Corrected value | New ratio |
|---|---|---|---|---|
| `--dim` (dark) | `#666F7A` | 3.58:1 ✗ | `#7C8590` | 4.89:1 |
| `--dim` (light) | `#8A9199` | 2.65:1 ✗ | `#636A72` | 4.55:1 |
| `--muted` (light) | `#5F666E` | 4.83:1 | `#545B63` | 5.70:1 |

`--muted` (light) is changed too, so the muted/dim hierarchy survives the `--dim` correction. All other values in the spec's table are unchanged and pass.

### Naming decision

The spec calls the page background `--bg`. The implementation keeps the existing `--canvas` name for it, because `bg-canvas` reads correctly as a Tailwind utility where `bg-bg` does not, and because it avoids churn in components that already use it. Every other token name follows the spec.

---

## File Structure

**Created:**
- `src/content/skills.ts` — skill groups, each skill's evidence typed against project slugs
- `src/content/skills.test.ts` — evidence integrity
- `src/content/theme.test.ts` — parses `globals.css` and asserts AA contrast in both themes
- `src/components/app-carousel.tsx` — Client Component; active index, controls, keyboard
- `src/components/app-carousel.test.tsx`
- `src/components/app-card.tsx` — one card: window chrome, media, metrics, demo credentials
- `src/components/app-card.test.tsx`
- `src/components/app-media.tsx` — poster plus optional tour, reduced-motion aware
- `src/components/app-media.test.tsx`
- `src/components/skill-matrix.tsx` — the receipts table
- `src/components/skill-matrix.test.tsx`
- `src/components/experience-log.tsx` — track record
- `scripts/capture/capture.mjs` — shared Playwright capture harness
- `scripts/capture/tours.mjs` — per-app scripted tours
- `e2e/carousel.spec.ts`

**Modified:**
- `src/app/globals.css` — Graphite tokens, dark-first
- `src/app/layout.tsx` — fonts, metadata
- `src/content/site.ts` — name, nav, carousel order
- `src/content/projects.ts` — new fields
- `src/content/projects.test.ts` — new field integrity
- `src/app/page.tsx` — full rebuild
- `src/components/site-header.tsx` — availability and email
- `src/components/project-row.tsx`, `src/app/work/**`, `src/app/about`, `src/app/contact` — token/field updates
- `CLAUDE.md` — theme inversion, two faces, media contract
- `package.json` — capture script

---

## Task 1: Graphite tokens, fonts, and the name

**Branch:** `feat/graphite-tokens`

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/content/site.ts`
- Modify: `CLAUDE.md`
- Test: `src/content/theme.test.ts` (create)

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties `--canvas --surface --raised --line --line-soft --text --muted --dim --accent --accent-soft --live`, exposed to Tailwind as `bg-canvas bg-surface bg-raised border-line border-line-soft text-text text-muted text-dim text-accent bg-accent-soft text-live bg-live`. Font variables `--font-schibsted`, `--font-jetbrains`, mapped to `font-display`, `font-body`, `font-mono`. `site.name === "Vit Busek"`.

- [ ] **Step 1: Write the failing contrast test**

Create `src/content/theme.test.ts`:

```ts
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

  test.each(["text", "muted", "dim", "accent"])(
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
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npm test -- theme`
Expected: FAIL — `no block for @media (prefers-color-scheme: light)`, because `globals.css` currently declares a dark block, not a light one.

- [ ] **Step 3: Replace the token blocks in `src/app/globals.css`**

Replace everything from `:root {` through the closing brace of the `@media (prefers-color-scheme: dark)` block with:

```css
/* Graphite. Dark is the default; the light block swaps the values underneath the
   same tokens, so no component ever needs a `dark:` variant. */
:root {
  --canvas: #14171B;
  --surface: #1C2127;
  --raised: #232931;
  --line: #2E353E;
  --line-soft: #262C34;
  --text: #E6E9ED;
  --muted: #8E97A2;
  --dim: #7C8590;
  --accent: #7BA3CC;
  --accent-soft: rgb(123 163 204 / 0.13);
  --live: #6FBE93;
}

@media (prefers-color-scheme: light) {
  :root {
    --canvas: #E9EAEC;
    --surface: #FCFCFD;
    --raised: #F3F4F6;
    --line: #DEE1E5;
    --line-soft: #E9EAEE;
    --text: #1A1D21;
    --muted: #545B63;
    --dim: #636A72;
    --accent: #3D6B8C;
    --accent-soft: rgb(61 107 140 / 0.10);
    --live: #3E9E6B;
  }
}
```

Then extend the `@theme inline` block, replacing the three font lines and adding the new colours:

```css
@theme inline {
  --color-canvas: var(--canvas);
  --color-surface: var(--surface);
  --color-raised: var(--raised);
  --color-line: var(--line);
  --color-line-soft: var(--line-soft);
  --color-text: var(--text);
  --color-muted: var(--muted);
  --color-dim: var(--dim);
  --color-accent: var(--accent);
  --color-accent-soft: var(--accent-soft);
  --color-live: var(--live);

  --font-display: var(--font-schibsted), ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-schibsted), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, SFMono-Regular, monospace;
}
```

- [ ] **Step 4: Run the contrast test to verify it passes**

Run: `npm test -- theme`
Expected: PASS, 14 assertions.

- [ ] **Step 5: Swap the fonts in `src/app/layout.tsx`**

Replace the three font imports and constants with two:

```tsx
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";

const sans = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});
```

and update the `<html>` className to `` `${sans.variable} ${mono.variable} h-full antialiased` ``.

- [ ] **Step 6: Correct the name in `src/content/site.ts`**

Change `name: "Vít Busek"` to `name: "Vit Busek"`. Leave every other field for Task 2.

- [ ] **Step 7: Verify the build and the whole suite**

Run: `npm run build && npm run lint && npm test`
Expected: build succeeds, lint clean, all tests pass. The build is what type-checks — Vitest transpiles without checking types.

- [ ] **Step 8: Update `CLAUDE.md`**

In the "Styling conventions" section, replace the theme sentence with:

```markdown
- **Never write `dark:` variants.** Dark is the default: `:root` holds the dark values and `@media (prefers-color-scheme: light)` swaps them underneath the same semantic tokens (`canvas`, `surface`, `raised`, `line`, `line-soft`, `text`, `muted`, `dim`, `accent`, `accent-soft`, `live`). Use `bg-canvas text-muted border-line`; both themes follow for free. A raw hex or a `dark:` prefix in a component means a token is missing — add the token instead.
- Two type roles, two faces: `font-display`/`font-body` (Schibsted Grotesk) and `font-mono` (JetBrains Mono, for numbers, URLs, labels and evidence tags).
- Token contrast is enforced by `src/content/theme.test.ts`, which parses `globals.css` and fails the suite if any pair drops below AA. Change a colour and run `npm test -- theme` before anything else.
```

- [ ] **Step 9: Commit, push, open a PR**

```bash
git checkout -b feat/graphite-tokens
git add src/app/globals.css src/app/layout.tsx src/content/site.ts src/content/theme.test.ts CLAUDE.md
git commit -m "Invert the theme to Graphite dark-first and enforce contrast by test"
git push -u origin feat/graphite-tokens
gh pr create --base main --fill
```

The commit body should record that three spec values failed AA when measured (`--dim` in both themes, `--muted` in light) and were corrected, with the ratios.

---

## Task 2: Content model — project fields and the skills matrix

**Branch:** `feat/content-model`

**Files:**
- Modify: `src/content/projects.ts`
- Modify: `src/content/projects.test.ts`
- Modify: `src/content/site.ts`
- Create: `src/content/skills.ts`
- Create: `src/content/skills.test.ts`

**Interfaces:**
- Consumes: nothing from Task 1 at the type level.
- Produces:
  - `type ProjectSlug = (typeof projects)[number]["slug"]`
  - `Project` gains `liveUrl?: string`, `status: "live" | "in-development" | "archived"`, `metrics: Metric[]`, `poster?: string`, `posterAlt?: string`, `tour?: string`, `demo?: { email: string; password: string }`, `signInRequired?: boolean`
  - `type Metric = { label: string; value: string }`
  - `carouselProjects: Project[]` — ordered, exported from `projects.ts`
  - `skillGroups: SkillGroup[]` from `skills.ts`, with `type Skill = { name: string; detail: string; evidence: ProjectSlug[] }` and `type SkillGroup = { title: string; skills: Skill[] }`

- [ ] **Step 1: Write the failing content tests**

Append to `src/content/projects.test.ts`:

```ts
describe("carousel projects", () => {
  test("are ordered with trader first, so first paint is not Steam's storefront", () => {
    expect(carouselProjects.map((p) => p.slug)).toEqual([
      "trader",
      "games-db",
      "my-movies",
      "legal",
      "work-planner",
    ]);
  });

  test("every carousel project has a live URL to open", () => {
    for (const project of carouselProjects) {
      expect(project.liveUrl).toMatch(/^https:\/\//);
    }
  });

  test("every carousel project carries checkable metrics", () => {
    for (const project of carouselProjects) {
      expect(project.metrics.length).toBeGreaterThanOrEqual(2);
      expect(project.metrics.length).toBeLessThanOrEqual(4);
      for (const metric of project.metrics) {
        expect(metric.value.length).toBeGreaterThan(0);
        expect(metric.label.length).toBeGreaterThan(0);
      }
    }
  });

  test("a project behind sign-in says so, so the card can warn a visitor", () => {
    for (const project of carouselProjects) {
      if (!project.signInRequired) continue;
      expect(project.slug === "legal" || project.slug === "work-planner").toBe(true);
    }
  });
});

describe("the name", () => {
  test("carries no diacritics", () => {
    expect(site.name).toBe("Vit Busek");
    expect(site.name.normalize("NFD")).toBe(site.name);
  });
});
```

Add `carouselProjects` and `site` to the imports at the top of the file.

Create `src/content/skills.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { getProject } from "./projects";
import { skillGroups } from "./skills";

describe("skills", () => {
  test("every evidence slug resolves to a real project", () => {
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        for (const slug of skill.evidence) {
          expect(getProject(slug), `${skill.name} cites ${slug}`).toBeDefined();
        }
      }
    }
  });

  test("every skill cites at least one project, so nothing is claimed unbacked", () => {
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        expect(skill.evidence.length, skill.name).toBeGreaterThan(0);
      }
    }
  });

  test("no skill is listed twice across groups", () => {
    const names = skillGroups.flatMap((g) => g.skills.map((s) => s.name));
    expect(new Set(names).size).toBe(names.length);
  });

  test("every skill says what specifically, not just a technology name", () => {
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        expect(skill.detail.length, skill.name).toBeGreaterThan(0);
      }
    }
  });
});
```

- [ ] **Step 2: Run and watch them fail**

Run: `npm test -- content`
Expected: FAIL — `Cannot find module './skills'` and `carouselProjects is not exported`.

- [ ] **Step 3: Extend `src/content/projects.ts`**

Add to the `Project` type:

```ts
  /** The deployment a visitor can open. Required when `status` is "live". */
  liveUrl?: string;
  status: "live" | "in-development" | "archived";
  /** Two to four. Every value must be checkable against the repo or the app. */
  metrics: Metric[];
  /** Poster frame, 1440x900. Ships in the static HTML and is the LCP candidate. */
  poster?: string;
  posterAlt?: string;
  /** Silent looping WebM tour, played only while this card is active. */
  tour?: string;
  /** Surfaced on the card so a visitor can get past the sign-in wall. */
  demo?: { email: string; password: string };
  signInRequired?: boolean;
```

and above it:

```ts
export type Metric = { label: string; value: string };
```

Add the three missing projects (`games-db`, `my-movies`, `work-planner`) as entries, set `status` and `metrics` on all six, and export the order:

```ts
export type ProjectSlug = (typeof projects)[number]["slug"];

/** The home page carousel. kanban is deliberately absent — five slides already
 *  risk repetition and it is the weakest of the set. */
const CAROUSEL_ORDER = [
  "trader",
  "games-db",
  "my-movies",
  "legal",
  "work-planner",
] as const;

export const carouselProjects = CAROUSEL_ORDER.map((slug) => {
  const project = getProject(slug);
  if (!project) throw new Error(`carousel references unknown project: ${slug}`);
  return project;
});
```

Metrics to use, all verified against the repositories:

| Project | Metrics |
|---|---|
| trader | `2/sec` price ticks streamed · `501` tests across the stack · `Lévy` closed-form price clock |
| games-db | `245,025` appids indexed · `14,621` hydrated with detail · `pg_trgm` trigram search |
| my-movies | `8` browse rows · `Tag-based` cache revalidation · `Linkable` search lives in the URL |
| legal | `11` Common Paper templates · `136` tests across the stack |
| work-planner | `Realtime` Pusher channels · `Postgres` Drizzle + Neon |

- [ ] **Step 4: Create `src/content/skills.ts`**

```ts
import type { ProjectSlug } from "./projects";

/**
 * Skills, each carrying the shipped projects that prove it. `evidence` is typed
 * against the project list, so citing a project that does not exist is a compile
 * error rather than a broken link a visitor finds first.
 *
 * Every mapping below was verified against the repository, not the README. The
 * READMEs are stale: work-planner's still describes a scaffold with no auth,
 * boards or cards, and my_movies' says schema.ts is empty.
 */
export type Skill = { name: string; detail: string; evidence: ProjectSlug[] };
export type SkillGroup = { title: string; skills: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Databases and data",
    skills: [
      { name: "Postgres", detail: "schema, indexing, migrations", evidence: ["games-db", "work-planner"] },
      { name: "Drizzle ORM", detail: "typed schema, generated migrations", evidence: ["games-db", "work-planner", "my-movies"] },
      { name: "Full-text search", detail: "pg_trgm trigram index", evidence: ["games-db"] },
      { name: "Data pipelines", detail: "backfill, retry with backoff, batched upserts", evidence: ["games-db"] },
    ],
  },
  {
    title: "Backend and integrations",
    skills: [
      { name: "FastAPI", detail: "typed routes, service layer", evidence: ["trader", "legal", "kanban"] },
      { name: "Third-party APIs", detail: "Steam, TMDB, OpenRouter", evidence: ["games-db", "my-movies", "trader", "legal"] },
      { name: "Scheduled jobs", detail: "monthly sweeps, advisory locks, durable partial progress", evidence: ["games-db"] },
      { name: "Auth", detail: "OAuth sign-in and sessions", evidence: ["games-db", "work-planner"] },
      { name: "Caching", detail: "tag-based revalidation with an on-demand purge endpoint", evidence: ["my-movies"] },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "React and Next.js", detail: "App Router, server components by default", evidence: ["trader", "games-db", "my-movies", "legal", "work-planner"] },
      { name: "Streaming UI", detail: "server-sent events, live price ticks", evidence: ["trader"] },
      { name: "Drag and drop", detail: "keyboard-operable, correct ARIA roles", evidence: ["work-planner", "kanban"] },
      { name: "Design systems", detail: "Tailwind v4, semantic tokens, no dark: variants", evidence: ["games-db", "work-planner"] },
    ],
  },
  {
    title: "Delivery",
    skills: [
      { name: "Testing", detail: "unit, integration and Playwright end-to-end", evidence: ["trader", "games-db", "legal", "my-movies"] },
      { name: "Docker", detail: "multi-stage builds, one origin, no CORS layer", evidence: ["trader", "legal"] },
      { name: "CI/CD", detail: "typecheck, lint and both suites on every pull request", evidence: ["games-db", "my-movies", "work-planner"] },
    ],
  },
];
```

**Before committing, verify each row.** For any mapping you cannot confirm from the repository, delete the row rather than shipping it — the section's entire value is that it checks out.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test -- content skills`
Expected: PASS.

- [ ] **Step 6: Run the full check**

Run: `npm run build && npm run lint && npm test`
Expected: all green.

- [ ] **Step 7: Commit, push, open a PR**

```bash
git checkout -b feat/content-model
git add src/content
git commit -m "Add the three unlisted apps and an evidence-linked skills matrix"
git push -u origin feat/content-model
gh pr create --base main --fill
```

---

## Task 3: Capture pipeline — posters and scripted tours

**Branch:** `feat/capture-pipeline`

**Files:**
- Create: `scripts/capture/capture.mjs`
- Create: `scripts/capture/tours.mjs`
- Modify: `package.json`
- Modify: `src/content/projects.ts` (wire `poster`, `posterAlt`, `tour`)
- Modify: `src/content/projects.test.ts`
- Assets: `public/work/*.webp`, `public/work/*.webm`

**Interfaces:**
- Consumes: `carouselProjects` from Task 2.
- Produces: `public/work/<slug>.webp` (1440x900 poster) and `public/work/<slug>.webm` for each carousel project; `npm run capture` and `npm run capture -- <slug>`.

- [ ] **Step 1: Write the failing asset test**

Append to `src/content/projects.test.ts`:

```ts
describe("carousel media", () => {
  test("every declared poster exists and is described for screen readers", () => {
    for (const project of carouselProjects) {
      expect(project.poster, `${project.slug} has no poster`).toBeDefined();
      expect(existsSync(join(process.cwd(), "public", project.poster!))).toBe(true);
      expect(project.posterAlt?.length ?? 0).toBeGreaterThan(0);
    }
  });

  test("every declared tour exists on disk", () => {
    for (const project of carouselProjects) {
      if (!project.tour) continue;
      expect(existsSync(join(process.cwd(), "public", project.tour))).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run and watch it fail**

Run: `npm test -- projects`
Expected: FAIL — `trader has no poster`.

- [ ] **Step 3: Write the capture harness**

Create `scripts/capture/capture.mjs`:

```js
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
```

- [ ] **Step 4: Write the per-app tours**

Create `scripts/capture/tours.mjs`. Each `run` is a short sequence showing the app doing its job; every selector is guarded so a UI change degrades to a shorter tour rather than a failed capture.

```js
/**
 * One scripted tour per app. Keep them under ~12 seconds: the card loops them.
 * A tour shows the app working — Trader's untouched home screen has an empty
 * positions table and an empty performance chart, which undersells it badly.
 */
const settle = (page, ms = 1200) => page.waitForTimeout(ms);

async function maybe(action) {
  try {
    await action();
  } catch {
    // A tour is a nice-to-have; never fail a capture because a selector moved.
  }
}

export const tours = {
  trader: {
    url: "https://trader-jimbimczs-projects.vercel.app",
    async run(page) {
      await maybe(async () => {
        await page.getByPlaceholder("UNITS").fill("5");
        await page.getByRole("button", { name: "Buy" }).click();
        await settle(page, 2500); // positions table and allocation fill in
      });
      await maybe(async () => {
        await page.getByPlaceholder(/Ask or instruct/i).fill("How is my portfolio doing?");
        await page.getByRole("button", { name: "Send" }).click();
        await settle(page, 3500);
      });
    },
  },
  "games-db": {
    url: "https://games-db-phi.vercel.app",
    async run(page) {
      await maybe(async () => {
        await page.getByRole("link", { name: "Top Sellers" }).first().click();
        await settle(page, 2000);
      });
      await maybe(async () => {
        await page.mouse.wheel(0, 900);
        await settle(page, 1500);
      });
    },
  },
  "my-movies": {
    url: "https://my-movies-jimbimczs-projects.vercel.app",
    async run(page) {
      await maybe(async () => {
        await page.mouse.wheel(0, 700);
        await settle(page, 1500);
      });
      await maybe(async () => {
        await page.getByRole("link", { name: "Search" }).click();
        await page.getByRole("searchbox").fill("dune");
        await settle(page, 2500);
      });
    },
  },
  // legal and work-planner sit behind sign-in. Their tours log in with the demo
  // account first; until those accounts exist, the tour is the sign-in screen.
  legal: {
    url: "https://legal-jimbimczs-projects.vercel.app",
    async run(page) {
      const email = process.env.LEGAL_DEMO_EMAIL;
      const password = process.env.LEGAL_DEMO_PASSWORD;
      if (!email || !password) return;
      await maybe(async () => {
        await page.getByLabel("Email").fill(email);
        await page.getByLabel("Password").fill(password);
        await page.getByRole("button", { name: "Sign in" }).click();
        await settle(page, 3000);
      });
    },
  },
  "work-planner": {
    url: "https://work-planner-jimbimczs-projects.vercel.app",
    async run(page) {
      const email = process.env.PLANNER_DEMO_EMAIL;
      const password = process.env.PLANNER_DEMO_PASSWORD;
      if (!email || !password) return;
      await maybe(async () => {
        await page.getByLabel("Email").fill(email);
        await page.getByLabel("Password").fill(password);
        await page.getByRole("button", { name: /sign in/i }).click();
        await settle(page, 3000);
      });
    },
  },
};
```

- [ ] **Step 5: Add the script to `package.json`**

Add to `"scripts"`: `"capture": "node scripts/capture/capture.mjs"`.

- [ ] **Step 6: Run the capture**

Run: `npm run capture`
Expected: `ok` for `trader`, `games-db`, `my-movies`; `legal` and `work-planner` produce a poster and a sign-in tour until the demo accounts exist. Confirm five `.webp` and five `.webm` files in `public/work/`.

- [ ] **Step 7: Wire the assets into `projects.ts`**

Set on each carousel project: `poster: "/work/<slug>.webp"`, `tour: "/work/<slug>.webm"`, and a specific `posterAlt` describing what is on screen — not "a screenshot of X". Delete the superseded `image`/`imageAlt` fields only after `project-row.tsx` is updated in Task 6; until then leave both.

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npm test -- projects`
Expected: PASS.

- [ ] **Step 9: Commit, push, open a PR**

```bash
git checkout -b feat/capture-pipeline
git add scripts public/work package.json src/content
git commit -m "Capture posters and scripted tours from the live deployments"
git push -u origin feat/capture-pipeline
gh pr create --base main --fill
```

The PR body should state which apps got a real tour and which are still the sign-in screen pending demo accounts.

---

## Task 4: The media component

**Branch:** `feat/app-media`

**Files:**
- Create: `src/components/app-media.tsx`
- Create: `src/components/app-media.test.tsx`

**Interfaces:**
- Consumes: `Project` from Task 2, assets from Task 3.
- Produces: `<AppMedia project={project} active={boolean} />`. Renders an `<img>` poster always; renders a `<video>` only when `active` is true, a `tour` exists, and reduced motion is not requested.

- [ ] **Step 1: Write the failing tests**

Create `src/components/app-media.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import type { Project } from "@/content/projects";
import { AppMedia } from "./app-media";

const project = {
  slug: "trader",
  title: "Trader",
  poster: "/work/trader.webp",
  posterAlt: "The Trader terminal with a streaming watchlist.",
  tour: "/work/trader.webm",
} as Project;

/** jsdom has no matchMedia; every test declares what the user asked for. */
function setReducedMotion(reduced: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduced && query.includes("prefers-reduced-motion"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

beforeEach(() => setReducedMotion(false));

test("always renders the poster, so the card is never empty", () => {
  render(<AppMedia project={project} active={false} />);
  expect(
    screen.getByRole("img", { name: "The Trader terminal with a streaming watchlist." }),
  ).toBeInTheDocument();
});

test("plays the tour only on the active card", () => {
  const { container, rerender } = render(<AppMedia project={project} active={false} />);
  expect(container.querySelector("video")).toBeNull();

  rerender(<AppMedia project={project} active />);
  expect(container.querySelector("video")).not.toBeNull();
});

test("renders no video at all under reduced motion", () => {
  setReducedMotion(true);
  const { container } = render(<AppMedia project={project} active />);
  expect(container.querySelector("video")).toBeNull();
  expect(screen.getByRole("img")).toBeInTheDocument();
});

test("renders no video for a project without a tour", () => {
  const { container } = render(
    <AppMedia project={{ ...project, tour: undefined }} active />,
  );
  expect(container.querySelector("video")).toBeNull();
});

test("the video is silent, looping and unobtrusive", () => {
  const { container } = render(<AppMedia project={project} active />);
  const video = container.querySelector("video")!;
  expect(video).toHaveAttribute("loop");
  expect(video.muted).toBe(true);
  expect(video).toHaveAttribute("playsInline");
});
```

- [ ] **Step 2: Run and watch it fail**

Run: `npm test -- app-media`
Expected: FAIL — `Cannot find module './app-media'`.

- [ ] **Step 3: Implement `src/components/app-media.tsx`**

```tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Project } from "@/content/projects";

/**
 * The poster ships in the static HTML and is the LCP candidate, so a card is
 * never empty and the tour never blocks first paint. The video sits on top of
 * the poster rather than replacing it: if it fails, the poster is already there
 * and there is no error state to design.
 *
 * Under reduced motion no video is rendered at all — not a shorter one.
 */
export function AppMedia({ project, active }: { project: Project; active: boolean }) {
  const reducedMotion = usePrefersReducedMotion();
  const showTour = active && Boolean(project.tour) && !reducedMotion;

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-canvas">
      <Image
        src={project.poster ?? ""}
        alt={project.posterAlt ?? ""}
        width={1440}
        height={900}
        priority={active}
        className="h-full w-full object-cover object-top"
      />
      {showTour && (
        <video
          key={project.tour}
          src={project.tour}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      )}
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
```

The video is `aria-hidden` because the poster's `alt` already describes the same content; announcing both would read the app twice.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- app-media`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit, push, open a PR**

```bash
git checkout -b feat/app-media
git add src/components/app-media.tsx src/components/app-media.test.tsx
git commit -m "Add the poster-first media component"
git push -u origin feat/app-media
gh pr create --base main --fill
```

---

## Task 5: The card and the carousel

**Branch:** `feat/app-carousel`

**Files:**
- Create: `src/components/app-card.tsx`
- Create: `src/components/app-card.test.tsx`
- Create: `src/components/app-carousel.tsx`
- Create: `src/components/app-carousel.test.tsx`

**Interfaces:**
- Consumes: `AppMedia` (Task 4), `carouselProjects` (Task 2).
- Produces: `<AppCard project={project} active={boolean} />` and `<AppCarousel projects={projects} />`.

- [ ] **Step 1: Write the failing card tests**

Create `src/components/app-card.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import type { Project } from "@/content/projects";
import { AppCard } from "./app-card";

vi.stubGlobal("matchMedia", (query: string) => ({
  matches: false, media: query,
  addEventListener: vi.fn(), removeEventListener: vi.fn(),
}));

const project = {
  slug: "trader", title: "Trader", status: "live",
  liveUrl: "https://trader-jimbimczs-projects.vercel.app",
  poster: "/work/trader.webp", posterAlt: "The Trader terminal.",
  metrics: [{ value: "501", label: "tests across the stack" }],
} as Project;

test("the whole card is one link to the live deployment", () => {
  render(<AppCard project={project} active />);
  const link = screen.getByRole("link", { name: /Trader/ });
  expect(link).toHaveAttribute("href", project.liveUrl);
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
});

test("shows the metrics that carry the persuasion", () => {
  render(<AppCard project={project} active />);
  expect(screen.getByText("501")).toBeInTheDocument();
  expect(screen.getByText("tests across the stack")).toBeInTheDocument();
});

test("says when a project is still in development", () => {
  render(<AppCard project={{ ...project, status: "in-development" }} active />);
  expect(screen.getByText("In development")).toBeInTheDocument();
});

test("does not label a finished project", () => {
  render(<AppCard project={project} active />);
  expect(screen.queryByText("In development")).toBeNull();
});

test("surfaces demo credentials for an app behind sign-in", () => {
  render(
    <AppCard
      project={{
        ...project,
        signInRequired: true,
        demo: { email: "demo@example.com", password: "hunter2" },
      }}
      active
    />,
  );
  expect(screen.getByText("demo@example.com")).toBeInTheDocument();
  expect(screen.getByText("hunter2")).toBeInTheDocument();
});

test("warns that sign-in is required even before an account exists", () => {
  render(<AppCard project={{ ...project, signInRequired: true }} active />);
  expect(screen.getByText(/sign-in required/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run and watch it fail**

Run: `npm test -- app-card`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/app-card.tsx`**

```tsx
import { AppMedia } from "./app-media";
import type { Project } from "@/content/projects";

/**
 * One slide. The whole card is a single anchor, so it is keyboard-operable and
 * middle-clickable for free — no div with a click handler.
 */
export function AppCard({ project, active }: { project: Project; active: boolean }) {
  const host = project.liveUrl?.replace(/^https:\/\//, "") ?? "";

  return (
    <a
      href={project.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-accent"
    >
      <div className="flex items-center gap-3 border-b border-line-soft bg-raised px-4 py-2.5">
        <span className="size-1.5 shrink-0 rounded-full bg-live" aria-hidden />
        <span className="text-sm font-medium">{project.title}</span>
        <span className="font-mono text-xs text-dim">{host}</span>
        {project.status === "in-development" && (
          <span className="label rounded border border-line px-1.5 py-0.5 text-dim">
            In development
          </span>
        )}
        <span className="ml-auto text-xs text-accent">Open live app →</span>
      </div>

      <AppMedia project={project} active={active} />

      <div className="flex flex-wrap items-end gap-x-8 gap-y-4 border-t border-line-soft px-4 py-3.5">
        {project.metrics.map((metric) => (
          <div key={metric.label}>
            <div className="font-mono text-base font-semibold">{metric.value}</div>
            <div className="text-xs text-dim">{metric.label}</div>
          </div>
        ))}
        {project.signInRequired && (
          <div className="ml-auto text-right text-xs text-dim">
            <div>Sign-in required</div>
            {project.demo && (
              <div className="font-mono text-muted">
                <span>{project.demo.email}</span> · <span>{project.demo.password}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </a>
  );
}
```

- [ ] **Step 4: Run the card tests**

Run: `npm test -- app-card`
Expected: PASS, 6 tests.

- [ ] **Step 5: Write the failing carousel tests**

Create `src/components/app-carousel.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { carouselProjects } from "@/content/projects";
import { AppCarousel } from "./app-carousel";

vi.stubGlobal("matchMedia", (query: string) => ({
  matches: false, media: query,
  addEventListener: vi.fn(), removeEventListener: vi.fn(),
}));

test("opens on the first project", () => {
  render(<AppCarousel projects={carouselProjects} />);
  expect(screen.getByRole("tab", { selected: true })).toHaveAccessibleName(
    carouselProjects[0].title,
  );
});

test("the next control advances the active slide", async () => {
  render(<AppCarousel projects={carouselProjects} />);
  await userEvent.click(screen.getByRole("button", { name: /next/i }));
  expect(screen.getByRole("tab", { selected: true })).toHaveAccessibleName(
    carouselProjects[1].title,
  );
});

test("the previous control wraps around from the first slide", async () => {
  render(<AppCarousel projects={carouselProjects} />);
  await userEvent.click(screen.getByRole("button", { name: /previous/i }));
  expect(screen.getByRole("tab", { selected: true })).toHaveAccessibleName(
    carouselProjects.at(-1)!.title,
  );
});

test("a tab selects its project directly", async () => {
  render(<AppCarousel projects={carouselProjects} />);
  await userEvent.click(screen.getByRole("tab", { name: carouselProjects[2].title }));
  expect(screen.getByRole("tab", { selected: true })).toHaveAccessibleName(
    carouselProjects[2].title,
  );
});

test("arrow keys move between slides once the tabs have focus", async () => {
  render(<AppCarousel projects={carouselProjects} />);
  await userEvent.click(screen.getByRole("tab", { name: carouselProjects[0].title }));
  await userEvent.keyboard("{ArrowRight}");
  expect(screen.getByRole("tab", { selected: true })).toHaveAccessibleName(
    carouselProjects[1].title,
  );
});

test("exactly one video plays, however far you scroll the carousel", async () => {
  const { container } = render(<AppCarousel projects={carouselProjects} />);
  await userEvent.click(screen.getByRole("button", { name: /next/i }));
  await userEvent.click(screen.getByRole("button", { name: /next/i }));
  expect(container.querySelectorAll("video").length).toBeLessThanOrEqual(1);
});

test("every project is reachable and links to its deployment", () => {
  render(<AppCarousel projects={carouselProjects} />);
  for (const project of carouselProjects) {
    expect(
      screen.getByRole("link", { name: new RegExp(project.title) }),
    ).toHaveAttribute("href", project.liveUrl);
  }
});
```

Add `@testing-library/user-event` to devDependencies if it is not already present.

- [ ] **Step 6: Run and watch it fail**

Run: `npm test -- app-carousel`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement `src/components/app-carousel.tsx`**

```tsx
"use client";

import { useState } from "react";
import { AppCard } from "./app-card";
import type { Project } from "@/content/projects";

/**
 * Deliberately does not auto-advance. Motion already comes from the active
 * card's tour looping, and a carousel that moves on its own takes control away
 * from the person this page is trying to impress.
 */
export function AppCarousel({ projects }: { projects: Project[] }) {
  const [index, setIndex] = useState(0);
  const move = (delta: number) =>
    setIndex((current) => (current + delta + projects.length) % projects.length);

  return (
    <section aria-label="Deployed applications">
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {projects.map((project, position) => (
              <div
                key={project.slug}
                className={`w-full shrink-0 px-2 transition-opacity duration-500 motion-reduce:transition-none ${
                  position === index ? "opacity-100" : "opacity-35"
                }`}
                aria-hidden={position !== index}
              >
                <AppCard project={project} active={position === index} />
              </div>
            ))}
          </div>
        </div>

        <CarouselButton label="Previous app" onClick={() => move(-1)} className="left-0">
          ‹
        </CarouselButton>
        <CarouselButton label="Next app" onClick={() => move(1)} className="right-0">
          ›
        </CarouselButton>
      </div>

      <div
        role="tablist"
        aria-label="Choose an application"
        className="mt-3 flex gap-1 overflow-x-auto rounded-lg border border-line-soft bg-raised p-1"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") move(1);
          if (event.key === "ArrowLeft") move(-1);
        }}
      >
        {projects.map((project, position) => (
          <button
            key={project.slug}
            role="tab"
            type="button"
            aria-selected={position === index}
            tabIndex={position === index ? 0 : -1}
            onClick={() => setIndex(position)}
            className={`flex min-w-28 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2 py-2 text-xs transition-colors ${
              position === index
                ? "bg-surface font-medium text-text"
                : "text-muted hover:text-text"
            }`}
          >
            <span className="size-1 rounded-full bg-live" aria-hidden />
            {project.title}
          </button>
        ))}
      </div>
    </section>
  );
}

function CarouselButton({
  label, onClick, className, children,
}: {
  label: string; onClick: () => void; className: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-raised/90 text-muted backdrop-blur transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 8: Run the carousel tests**

Run: `npm test -- app-carousel`
Expected: PASS, 7 tests.

- [ ] **Step 9: Full check, then commit, push, open a PR**

Run: `npm run build && npm run lint && npm test`

```bash
git checkout -b feat/app-carousel
git add src/components/app-card.tsx src/components/app-card.test.tsx src/components/app-carousel.tsx src/components/app-carousel.test.tsx package.json
git commit -m "Add the app carousel and its cards"
git push -u origin feat/app-carousel
gh pr create --base main --fill
```

---

## Task 6: Rebuild the home page

**Branch:** `feat/home-page`

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/site-header.tsx`
- Create: `src/components/skill-matrix.tsx`
- Create: `src/components/skill-matrix.test.tsx`
- Create: `src/components/experience-log.tsx`
- Modify: `src/app/page.test.tsx` (create if absent)

**Interfaces:**
- Consumes: `AppCarousel` (Task 5), `skillGroups` (Task 2), `site.experience` (existing).
- Produces: `<SkillMatrix groups={skillGroups} />`, `<ExperienceLog roles={site.experience} />`.

- [ ] **Step 1: Write the failing skill matrix tests**

Create `src/components/skill-matrix.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { getProject } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { SkillMatrix } from "./skill-matrix";

test("shows every group heading", () => {
  render(<SkillMatrix groups={skillGroups} />);
  for (const group of skillGroups) {
    expect(screen.getByText(group.title)).toBeInTheDocument();
  }
});

test("each evidence tag links to the app that proves the skill", () => {
  render(<SkillMatrix groups={skillGroups} />);
  const first = skillGroups[0].skills[0];
  const row = screen.getByRole("row", { name: new RegExp(first.name) });
  for (const slug of first.evidence) {
    const link = within(row).getByRole("link", { name: slug });
    expect(link).toHaveAttribute("href", getProject(slug)!.liveUrl ?? `/work/${slug}`);
  }
});

test("a skill whose evidence has no live deployment still links to its case study", () => {
  render(<SkillMatrix groups={skillGroups} />);
  const link = screen.getAllByRole("link", { name: "kanban" })[0];
  expect(link).toHaveAttribute("href", "/work/kanban");
});
```

- [ ] **Step 2: Run and watch it fail**

Run: `npm test -- skill-matrix`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/skill-matrix.tsx`**

Render each group as a heading plus a `<table>` of rows (`role="row"` comes free), skill name and detail in the first cell, evidence tags in the second. An evidence tag links to `project.liveUrl` when the project has one, and to `/work/<slug>` when it does not, so no tag is ever a dead end.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- skill-matrix`
Expected: PASS.

- [ ] **Step 5: Write `src/components/experience-log.tsx`**

A definition-style list over `site.experience`: period in mono `text-dim`, role as the strong line, org in `text-accent`, note in `text-muted`. No new content — it reads `site.ts`.

- [ ] **Step 6: Add availability and email to `src/components/site-header.tsx`**

Beside the existing nav, add the live dot with `site.status` and a `mailto:` link for `site.email`, hidden below `sm` so the header does not wrap on a phone. The nav itself is unchanged.

- [ ] **Step 7: Write the failing home page test**

Create `src/app/page.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Home from "./page";

vi.stubGlobal("matchMedia", (query: string) => ({
  matches: false, media: query,
  addEventListener: vi.fn(), removeEventListener: vi.fn(),
}));

test("leads with the carousel of deployed applications", () => {
  render(<Home />);
  expect(
    screen.getByRole("region", { name: "Deployed applications" }),
  ).toBeInTheDocument();
});

test("answers 'is this person available' without navigating", () => {
  render(<Home />);
  expect(within(screen.getByRole("main")).getByText(/open to new work/i)).toBeInTheDocument();
});

test("puts the track record above the skills, as the stronger evidence", () => {
  render(<Home />);
  const html = document.body.innerHTML;
  expect(html.indexOf("Track record")).toBeLessThan(html.indexOf("Skills"));
});

test("offers a direct way to make contact", () => {
  render(<Home />);
  expect(
    within(screen.getByRole("main")).getByRole("link", { name: /busek\.vit@gmail\.com/ }),
  ).toBeInTheDocument();
});
```

Wrap the page's content in `<main>` in the test render, or query without the `main` scope if `layout.tsx` supplies it — the page itself is rendered without the layout in unit tests, so use `screen` directly and drop the `within(...)` wrapper if it fails.

- [ ] **Step 8: Rebuild `src/app/page.tsx`**

Sections in this order, per the spec: hero (eyebrow, `h1`, lede), `<AppCarousel projects={carouselProjects} />`, "What each one actually is" (one sentence and a link per project, with "All projects →" to `/work`), `<ExperienceLog />` with "Full history →" to `/about`, `<SkillMatrix />`, contact. Every string comes from `site.ts` or `projects.ts`.

- [ ] **Step 9: Run everything**

Run: `npm run build && npm run lint && npm test`
Expected: all green.

- [ ] **Step 10: Commit, push, open a PR**

```bash
git checkout -b feat/home-page
git add src/app/page.tsx src/app/page.test.tsx src/components
git commit -m "Rebuild the home page around the carousel, track record and receipts"
git push -u origin feat/home-page
gh pr create --base main --fill
```

---

## Task 7: Bring the remaining routes onto the new system, and verify end to end

**Branch:** `feat/routes-and-e2e`

**Files:**
- Modify: `src/components/project-row.tsx`, `src/app/work/page.tsx`, `src/app/work/[slug]/page.tsx`, `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/not-found.tsx`, `src/components/site-footer.tsx`
- Modify: `src/content/projects.ts` (drop `image`/`imageAlt` once nothing reads them)
- Create: `e2e/carousel.spec.ts`
- Modify: `e2e/portfolio.spec.ts`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update the remaining routes to the new tokens and fields**

Replace `image`/`imageAlt` reads with `poster`/`posterAlt` in `project-row.tsx`. Add the `status` badge to `/work` rows. Confirm no file contains a `dark:` prefix or a raw hex:

Run: `grep -rn "dark:" src/ ; grep -rnE "#[0-9a-fA-F]{6}" src/ --include=*.tsx`
Expected: no output from either.

- [ ] **Step 2: Delete the superseded fields**

Remove `image` and `imageAlt` from the `Project` type and every entry, plus the old assertion in `projects.test.ts` that referenced them.

Run: `npm run build && npm test`
Expected: green. A type error here means a page still reads the old field.

- [ ] **Step 3: Write the failing end-to-end suite**

Create `e2e/carousel.spec.ts`:

```ts
import { expect, test } from "@playwright/test";
import { carouselProjects } from "../src/content/projects";

test("the carousel opens on trader with its poster showing", async ({ page }) => {
  await page.goto("/");
  const tabs = page.getByRole("tab");
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await expect(tabs.first()).toHaveAccessibleName("Trader");
  await expect(page.getByRole("img").first()).toBeVisible();
});

test("the next control changes the active application", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Next app" }).click();
  await expect(page.getByRole("tab", { name: "Games DB" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("each card opens its real deployment in a new tab", async ({ page }) => {
  await page.goto("/");
  for (const project of carouselProjects) {
    const link = page.getByRole("link", { name: new RegExp(project.title) }).first();
    await expect(link).toHaveAttribute("href", project.liveUrl!);
    await expect(link).toHaveAttribute("target", "_blank");
  }
});

test("posters decode rather than rendering as broken images", async ({ page }) => {
  await page.goto("/");
  await expect
    .poll(() =>
      page.getByRole("img").evaluateAll((images) =>
        images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
      ),
    )
    .toBe(true);
});

test("no video is loaded when the visitor asks for reduced motion", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("video")).toHaveCount(0);
  await context.close();
});

test("the carousel is operable from the keyboard alone", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Trader" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Games DB" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("the page renders in both themes", async ({ page }) => {
  for (const scheme of ["dark", "light"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    await expect(page.getByRole("tablist")).toBeVisible();
  }
});

test("a phone visitor sees one card and can open the app", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Trader/ }).first()).toHaveAttribute(
    "target",
    "_blank",
  );
});
```

- [ ] **Step 4: Update `e2e/portfolio.spec.ts`**

The existing "View work" link no longer exists on the home page; point that journey at the "All projects →" link instead. Update the screenshot-count assertion to use `poster` rather than `image`.

- [ ] **Step 5: Run the end-to-end suite**

Run: `npm run test:e2e`
Expected: all pass. Read the real exit code — `playwright test | tail` reports `tail`'s status, so a failing suite can announce itself as passing.

- [ ] **Step 6: Document the media contract in `CLAUDE.md`**

Add under Architecture:

```markdown
### Media contract

`public/work/<slug>.webp` is a 1440x900 poster and `<slug>.webm` a silent tour, both produced by `npm run capture` from the live deployment. The rules the components depend on:

- The poster ships in the static HTML and is the LCP candidate. It is never replaced, only covered — so a failed video has no error state.
- Only the active card renders a `<video>`. Switching cards unmounts the previous one.
- `prefers-reduced-motion: reduce` renders no video at all, on any card.
- Containers are locked to `aspect-ratio: 16/10`, so media loading cannot shift the layout.
- There are no iframes. Embedding the apps was specced and rejected — see the spec.
```

- [ ] **Step 7: Full verification**

Run: `npm run build && npm run lint && npm test && npm run test:e2e`
Expected: all four green. Compare the number of tests that ran against the number that exist.

- [ ] **Step 8: Commit, push, open a PR**

```bash
git checkout -b feat/routes-and-e2e
git add src e2e CLAUDE.md
git commit -m "Bring the remaining routes onto the new system and cover the carousel end to end"
git push -u origin feat/routes-and-e2e
gh pr create --base main --fill
```

---

## Follow-up: demo accounts (blocked on Vit)

Not a task — it cannot be done from this repository.

Once the demo accounts exist for `legal` and `work-planner`:

1. Add `demo: { email, password }` to both projects in `projects.ts`.
2. Export `LEGAL_DEMO_EMAIL`, `LEGAL_DEMO_PASSWORD`, `PLANNER_DEMO_EMAIL`, `PLANNER_DEMO_PASSWORD` and run `npm run capture -- legal work-planner` to replace the sign-in posters with real tours.
3. Confirm the card tests still pass — `AppCard` already renders the credentials when `demo` is present.

Credentials are deliberately plain content, not secrets: they exist to be given away. They must belong to throwaway accounts holding no real data.

---

## Self-Review

**Spec coverage:** Name (Task 1, 2) · Graphite palette and dark default (1) · two typefaces (1) · page order (6) · carousel behaviour and no auto-advance (5) · media rules (4, 3) · sign-in apps and demo accounts (5, follow-up) · mobile (5, 7) · content model (2) · skills with receipts (2, 6) · routes unchanged (7) · quality floor (1, 4, 7) · testing across all three layers (every task) · CLAUDE.md changes (1, 7). The spec's "decisions" removal needs no task — the section never existed in code.

**Placeholders:** none. Every code step carries real code; the two prose-only steps (Task 6 Step 3 and Step 5) describe components whose interfaces and tests are fully specified immediately above them.

**Type consistency:** `Project`, `Metric`, `ProjectSlug`, `Skill`, `SkillGroup`, `carouselProjects`, `skillGroups`, `AppMedia`, `AppCard`, `AppCarousel`, `SkillMatrix`, `ExperienceLog` are used with the same names and shapes in every task that references them. `poster`/`posterAlt` replace `image`/`imageAlt` in Task 7 only, after every consumer has moved.

**Known deviation from the spec:** the spec's `--bg` is implemented as `--canvas`, and three colour values are corrected for contrast. Both are recorded in Global Constraints above.
