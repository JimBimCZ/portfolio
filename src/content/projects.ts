/**
 * Real work, newest first. Add an entry and its detail page is generated.
 *
 * `shipped` is an ISO year-month and drives both the ordering and the visible
 * date. There are no version numbers because neither repository tags releases.
 */
export type Metric = { label: string; value: string };

export type Project = {
  slug: string;
  title: string;
  /** ISO year-month, e.g. "2026-08". */
  shipped: string;
  /** One line, present tense, what it does for whom. */
  summary: string;
  role: string;
  stack: string[];
  /** Two to four concrete facts. Anything checkable beats an adjective. */
  highlights: string[];
  repo?: string;
  live?: string;
  /** What a visitor should expect from `live`, when it differs from the repo. */
  liveNote?: string;
  /** Path under /public. Screenshots are 1440x900, captured from the running app. */
  image?: string;
  imageAlt?: string;
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
};

export const projects = [
  {
    slug: "trader" as const,
    title: "Trader",
    shipped: "2026-08",
    summary:
      "A trading terminal with imaginary money: prices stream in twice a second, and an assistant that can read your portfolio and place the trades for you.",
    role: "Solo build — frontend, backend, infrastructure",
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
    highlights: [
      "The assistant executes trades through the same API the UI uses, and shows each fill inline as it happens. The live demo answers from its scripted client rather than the model, so leaving it up costs nothing.",
      "One codebase, two deployment shapes. Serverless has no background task and no disk, so prices become a closed-form function of the clock — Brownian motion by Lévy construction, 22 steps down a hashed tree rather than 172,800 summed half-second increments — and Postgres sits behind the same interface as SQLite. Routes, services and the frontend are untouched.",
      "Market data comes from a geometric Brownian motion simulator by default — per-ticker volatility, correlated sector moves, no API key. Real quotes are opt-in, and there is deliberately no silent fallback between them.",
      "501 tests across the stack: 374 on the backend, 107 on the frontend, plus 20 Playwright specs run against the built container.",
    ],
    repo: "https://github.com/JimBimCZ/trader",
    live: "https://trader-jimbimczs-projects.vercel.app",
    liveNote:
      "The demo runs the serverless build with no database attached, so the portfolio starts at $10,000 and resets whenever the instance is recycled.",
    image: "/work/trader.webp",
    imageAlt:
      "The Trader terminal: a streaming watchlist of ten tickers on the left, an AAPL price chart, trade ticket, allocation treemap and positions table in the centre, and the assistant on the right confirming a five-share GOOGL buy it just executed.",
    liveUrl: "https://trader-jimbimczs-projects.vercel.app",
    status: "live",
    metrics: [
      { value: "2/sec", label: "price ticks streamed" },
      { value: "846", label: "tests across the stack" },
      { value: "Lévy", label: "closed-form price clock" },
    ],
    poster: "/work/trader.webp",
    posterAlt:
      "The Trader terminal at rest: a ten-ticker watchlist on the left, an AAPL price chart and empty trade ticket in the centre, and the assistant's prompt suggestions on the right.",
    tour: "/work/trader.webm",
  },
  {
    slug: "games-db" as const,
    title: "Games DB",
    shipped: "2026-08",
    summary:
      "A personal PC games catalogue that indexes Steam's entire storefront into Postgres, so browsing, filtering, and search never touch Steam's own rate-limited API.",
    role: "Solo build — frontend, backend, infrastructure",
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
    highlights: [
      "Its own index of Steam's catalogue — 245,025 appids, 14,621 hydrated with full detail — because Steam has no /discover or /trending endpoint to browse against.",
      "Search runs on a Postgres trigram index (pg_trgm), not on Steam.",
      "One scheduled job — a monthly GitHub Actions cron refreshes prices — plus three CLI jobs (catalogue sync, list sync, hydration) run by hand. Hydration, price refresh, and list sync each take a Postgres advisory lock so two copies can't run at once; catalogue sync does not need one.",
      "GitHub OAuth sign-in for a personal library; browsing and search work for anyone, signed in or not.",
    ],
    repo: "https://github.com/JimBimCZ/games-db",
    liveUrl: "https://games-db-phi.vercel.app",
    status: "live",
    metrics: [
      { value: "245,025", label: "appids indexed" },
      { value: "14,621", label: "hydrated with detail" },
      { value: "pg_trgm", label: "trigram search" },
    ],
    poster: "/work/games-db.webp",
    posterAlt:
      "Games DB's home page: a featured Counter-Strike 2 banner above a Top Sellers grid of game cover art, prices, and discount badges.",
    tour: "/work/games-db.webm",
  },
  {
    slug: "my-movies" as const,
    title: "My Movies",
    shipped: "2026-08",
    summary:
      "A personal streaming catalogue pulling from TMDB, presented as a Netflix-style browsing UI with linkable search and a watchlist behind sign-in.",
    role: "Solo build — frontend, backend, infrastructure",
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
    highlights: [
      "Nine browse rows on the home page — trending, now playing, upcoming, top rated, airing today, and four genre rows — each streamed in with Suspense.",
      "Search is URL-driven: the query lives in the URL, so results are linkable and the back button works.",
      "An on-demand /api/revalidate endpoint purges TMDB response caches by tag rather than waiting out a TTL.",
      "GitHub and Google OAuth sign-in for a personal watchlist; every browse, detail, and search route works without an account.",
    ],
    repo: "https://github.com/JimBimCZ/my_movies",
    liveUrl: "https://my-movies-plum.vercel.app",
    status: "live",
    metrics: [
      { value: "9", label: "browse rows" },
      { value: "Tag-based", label: "cache revalidation" },
      { value: "Linkable", label: "search lives in the URL" },
    ],
    poster: "/work/my-movies.webp",
    posterAlt:
      "My Movies' home page: a full-bleed hero for The Whisper Man with its synopsis and a More Info button, above a Trending This Week row of poster thumbnails.",
    tour: "/work/my-movies.webm",
  },
  {
    slug: "legal" as const,
    title: "Legal Document Creator",
    shipped: "2026-08",
    summary:
      "Draft a legal agreement by chatting. Pick one of 11 Common Paper templates, answer in plain language, and watch the document fill in live.",
    role: "Solo build — frontend, backend, infrastructure",
    stack: ["Next.js", "FastAPI", "SQLite", "OpenRouter", "Docker"],
    highlights: [
      "The model replies against a Pydantic schema generated from each template's own fields, so a turn can only come back as valid, typed values.",
      "A turn is saved only after the model call succeeds — a failed request leaves nothing behind and is safe to retry.",
      "161 tests across the stack: 86 on the backend, 75 on the frontend.",
      "One container, one origin. A multi-stage build compiles the Next.js export and FastAPI serves it, so there is no CORS layer to configure.",
    ],
    repo: "https://github.com/JimBimCZ/legal",
    image: "/work/legal.webp",
    imageAlt:
      "The app filling in a mutual NDA: chat transcript on the left, live document preview on the right showing all ten fields completed.",
    liveUrl: "https://legal-seven-zeta.vercel.app",
    status: "live",
    signInRequired: true,
    metrics: [
      { value: "11", label: "Common Paper templates" },
      { value: "161", label: "tests across the stack" },
    ],
    poster: "/work/legal.webp",
    posterAlt:
      "Legal Document Creator's sign-in screen: an email and password form under the app name, with no demo account available yet.",
    tour: "/work/legal.webm",
  },
  {
    slug: "work-planner" as const,
    title: "Work Planner",
    shipped: "2026-08",
    summary:
      "A collaborative kanban board, JIRA-board style: multiple boards per user, keyboard-operable drag and drop, due dates, and OAuth-only sign-in.",
    role: "Solo build — frontend, backend, infrastructure",
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
    highlights: [
      "Boards, columns and cards backed by a real Postgres schema — well past the health-route scaffold the README still describes.",
      "Keyboard-operable drag and drop between columns, built on dnd-kit.",
      "OAuth-only sign-in (Google and GitHub) gates every board; there is no guest or demo account.",
      "291 tests across the stack: 211 unit and component, 80 Playwright end-to-end.",
    ],
    repo: "https://github.com/JimBimCZ/work-planner",
    liveUrl: "https://work-planner-seven.vercel.app",
    status: "live",
    signInRequired: true,
    metrics: [
      { value: "Postgres", label: "Drizzle + Neon" },
      { value: "291", label: "tests across the stack" },
    ],
    poster: "/work/work-planner.webp",
    posterAlt:
      "Work Planner's sign-in screen: the app name above Continue with Google and Continue with GitHub buttons, with no guest or demo account available.",
    tour: "/work/work-planner.webm",
  },
  {
    slug: "kanban" as const,
    title: "Kanban MVP",
    shipped: "2026-08",
    summary:
      "A project board with an assistant that edits it for you — create, move, and rename cards by asking, or drag them yourself.",
    role: "Solo build — frontend, backend, infrastructure",
    stack: ["Next.js", "Tailwind", "FastAPI", "SQLite", "Docker"],
    highlights: [
      "The AI assistant creates, edits, moves, and renames cards from plain language, against the same API the UI uses.",
      "Drag and drop across five renameable columns, persisted per user in SQLite.",
      "Responsive board layout that holds up from phone to desktop.",
      "Unit and end-to-end suites, plus a connectivity check for the model provider.",
    ],
    repo: "https://github.com/JimBimCZ/kanban",
    image: "/work/kanban.webp",
    imageAlt: "The kanban board with cards distributed across its columns.",
    status: "in-development",
    metrics: [
      { value: "5", label: "renameable columns" },
      { value: "10", label: "tests across the stack" },
    ],
  },
] satisfies Project[];

// `satisfies` (rather than a `: Project[]` annotation) keeps each entry's literal `slug`
// type, so this resolves to a union of the six actual slugs, not plain `string`. See the
// `tsc` runs in the Task 2 fix report for a demonstration that a bogus `evidence` slug in
// skills.ts is a compile error, not just a runtime test failure.
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
