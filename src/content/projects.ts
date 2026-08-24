/**
 * Real work, newest first. Add an entry and its detail page is generated.
 *
 * `shipped` is an ISO year-month and drives both the ordering and the visible
 * date. There are no version numbers because neither repository tags releases.
 */
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
};

export const projects: Project[] = [
  {
    slug: "trader",
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
  },
  {
    slug: "legal-document-creator",
    title: "Legal Document Creator",
    shipped: "2026-08",
    summary:
      "Draft a legal agreement by chatting. Pick one of 11 Common Paper templates, answer in plain language, and watch the document fill in live.",
    role: "Solo build — frontend, backend, infrastructure",
    stack: ["Next.js", "FastAPI", "SQLite", "OpenRouter", "Docker"],
    highlights: [
      "The model replies against a Pydantic schema generated from each template's own fields, so a turn can only come back as valid, typed values.",
      "A turn is saved only after the model call succeeds — a failed request leaves nothing behind and is safe to retry.",
      "136 tests across the stack: 65 on the backend, 71 on the frontend.",
      "One container, one origin. A multi-stage build compiles the Next.js export and FastAPI serves it, so there is no CORS layer to configure.",
    ],
    repo: "https://github.com/JimBimCZ/legal",
    image: "/work/legal.webp",
    imageAlt:
      "The app filling in a mutual NDA: chat transcript on the left, live document preview on the right showing all ten fields completed.",
  },
  {
    slug: "kanban",
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
  },
];

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
