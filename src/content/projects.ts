/**
 * Real work, newest first. Add an entry and its detail page is generated.
 *
 * `shipped` is an ISO year-month and drives both the ordering and the visible
 * date. There are no version numbers because neither repository tags releases.
 *
 * Prose (summary, role, highlights, metric labels, poster alt text, live note)
 * lives in the copy dictionary (`src/content/copy/en.ts`), keyed by slug. This
 * file holds only the data that is identical in every locale. `src/content/localise.ts`
 * merges the two back into the shape components consume.
 */
export type ProjectData = {
  slug: string;
  title: string;
  /** ISO year-month, e.g. "2026-08". */
  shipped: string;
  stack: string[];
  repo?: string;
  /** The deployment a visitor can open. Required when `status` is "live". */
  liveUrl?: string;
  status: "live" | "in-development" | "archived";
  /** Two to four values, in the order their labels appear in the copy
   *  dictionary's `metricLabels` for this slug. Every value must be checkable
   *  against the repo or the app. */
  metrics: string[];
  /** Poster frame, 1440x900. Ships in the static HTML and is the LCP candidate. */
  poster?: string;
  /** Silent looping WebM tour, played only while this card is active. */
  tour?: string;
  /** Surfaced on the card so a visitor can get past the sign-in wall. */
  demo?: { email: string; password: string };
  signInRequired?: boolean;
};

export const projects = [
  {
    slug: "trader" as const,
    title: "Trader",
    shipped: "2026-08",
    stack: [
      "Next.js",
      "FastAPI",
      "SQLite",
      "Postgres",
      "SSE",
      "OpenRouter",
      "Docker",
      "Vercel",
    ],
    repo: "https://github.com/JimBimCZ/trader",
    liveUrl: "https://trader-jimbimczs-projects.vercel.app",
    status: "live",
    metrics: ["2/sec", "846", "Lévy"],
    poster: "/work/trader.webp",
    tour: "/work/trader.webm",
  },
  {
    slug: "games-db" as const,
    title: "Games DB",
    shipped: "2026-08",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Postgres",
      "Drizzle",
      "Auth.js",
      "Vercel",
      "Docker",
    ],
    repo: "https://github.com/JimBimCZ/games-db",
    liveUrl: "https://games-db-phi.vercel.app",
    status: "live",
    metrics: ["245,025", "14,621", "pg_trgm"],
    poster: "/work/games-db.webp",
    tour: "/work/games-db.webm",
  },
  {
    slug: "my-movies" as const,
    title: "My Movies",
    shipped: "2026-08",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Postgres",
      "Drizzle",
      "Auth.js",
      "Vercel",
      "Docker",
    ],
    repo: "https://github.com/JimBimCZ/my_movies",
    liveUrl: "https://my-movies-plum.vercel.app",
    status: "live",
    metrics: ["9", "Tag-based", "Linkable"],
    poster: "/work/my-movies.webp",
    tour: "/work/my-movies.webm",
  },
  {
    slug: "legal" as const,
    title: "Legal Document Creator",
    shipped: "2026-08",
    stack: ["Next.js", "FastAPI", "SQLite", "OpenRouter", "Docker"],
    repo: "https://github.com/JimBimCZ/legal",
    liveUrl: "https://legal-seven-zeta.vercel.app",
    status: "live",
    signInRequired: true,
    metrics: ["11", "161"],
    poster: "/work/legal.webp",
  },
  {
    slug: "work-planner" as const,
    title: "Work Planner",
    shipped: "2026-08",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Postgres",
      "Drizzle",
      "Auth.js",
      "Vercel",
      "Docker",
    ],
    repo: "https://github.com/JimBimCZ/work-planner",
    liveUrl: "https://work-planner-seven.vercel.app",
    status: "in-development",
    signInRequired: true,
    metrics: ["Postgres", "291"],
    poster: "/work/work-planner.webp",
    tour: "/work/work-planner.webm",
  },
] satisfies ProjectData[];

// `satisfies` (rather than a `: ProjectData[]` annotation) keeps each entry's literal
// `slug` type, so this resolves to a union of the five actual slugs, not plain `string`.
// See the `tsc` runs in the Task 2 fix report for a demonstration that a bogus `evidence`
// slug in skills.ts is a compile error, not just a runtime test failure.
export type ProjectSlug = (typeof projects)[number]["slug"];

/** The home page carousel. The order is declared here rather than taken from the
 *  log, so the first slide stays a deliberate choice. */
export const CAROUSEL_ORDER = [
  "trader",
  "games-db",
  "my-movies",
  "legal",
  "work-planner",
] as const;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

/** "2026-08" -> "August 2026" */
export function formatShipped(shipped: string) {
  const [year, month] = shipped.split("-").map(Number);
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
