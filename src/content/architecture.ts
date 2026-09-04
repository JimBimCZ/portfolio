import type { ProjectSlug } from "./projects";

/**
 * How each project is wired, as data. Rendered by `ArchitectureDiagram` through
 * `localiseArchitecture`.
 *
 * Facts only, identical in every locale: band membership, component and
 * technology names, and the protocol on each edge. Prose — the section
 * heading, the band titles, the optional per-node notes and the design
 * decisions — lives in the copy dictionaries (`src/content/copy/en.ts`), the
 * notes keyed by the node ids below.
 *
 * Every entry was read out of the project's own repository, checked out
 * alongside this one, on 2026-09-03. Not out of its README: those are stale,
 * as `skills.ts` already notes.
 */

/** Top to bottom. A project renders only the bands it has nodes for. */
export const BANDS = ["client", "server", "data", "external"] as const;
export type Band = (typeof BANDS)[number];

export type ArchNode = {
  /** Stable key. The copy dictionaries hang optional notes off it. */
  id: string;
  band: Band;
  /**
   * A technology's own name ("Postgres") or the path the component lives at
   * ("server/steam"). Both are facts and read the same in every locale —
   * anything that would have to be worded is a `note` in the dictionaries.
   */
  name: string;
};

export type ArchEdge = {
  from: Band;
  to: Band;
  /** The mechanism, as a fact: "SSE", "Drizzle", "Server Actions". */
  protocol: string;
};

/**
 * One step on the path a request takes, in order.
 *
 * The bands answer "what is this wired to". They cannot answer "what happens
 * to a question", because the answer is a sequence and almost all of it
 * happens inside one band. Only a project whose story IS that sequence
 * declares a pipeline, which is why the field is optional: a four-step list
 * that read `Server Actions -> Drizzle -> Postgres` would be the band diagram
 * drawn a second time.
 */
export type PipelineStep = {
  /** Stable key. The copy dictionaries hang the step's prose off it. */
  id: string;
  /** The module the step lives in, as a real path — never English prose,
   *  under the same rule as `ArchNode["name"]`. */
  name: string;
  /** A step the request can stop at. The renderer draws it as a branch. */
  guard?: true;
};

export type Architecture = {
  nodes: readonly ArchNode[];
  edges: readonly ArchEdge[];
  pipeline?: readonly PipelineStep[];
};

/** `Record<ProjectSlug, …>` is what makes adding a project without a diagram a
 *  compile error, the same mechanism that already protects `cs.ts`. */
export const architecture: Record<ProjectSlug, Architecture> = {
  // The compose stack, which is the only way this one runs: app, Postgres with
  // pgvector, and a Keycloak realm. Both models are baked into the image and
  // run in the process, so neither appears in `external` — that absence is the
  // privacy claim, and `embedders` carries the note that says so.
  //
  // The bands name modules and the pipeline names the files inside them, so
  // the two never print the same string twice on one page.
  "secure-llm": {
    nodes: [
      { id: "ask-form", band: "client", name: "app/ask/ask-form.tsx" },
      { id: "guard", band: "server", name: "server/auth/guard.ts" },
      { id: "rag", band: "server", name: "server/rag" },
      { id: "privacy", band: "server", name: "server/privacy" },
      { id: "providers", band: "server", name: "server/ai/providers" },
      { id: "embedders", band: "server", name: "server/ai/embedders/local.ts" },
      { id: "postgres", band: "data", name: "Postgres" },
      { id: "pgvector", band: "data", name: "pgvector, HNSW cosine" },
      { id: "tsvector", band: "data", name: "content_tsv / content_tsv_en" },
      { id: "drizzle", band: "data", name: "Drizzle ORM" },
      { id: "keycloak", band: "external", name: "Keycloak (OIDC)" },
      { id: "anthropic", band: "external", name: "Anthropic API" },
      { id: "openrouter", band: "external", name: "OpenRouter" },
    ],
    edges: [
      { from: "client", to: "server", protocol: "POST /api/ask" },
      { from: "server", to: "client", protocol: "application/x-ndjson" },
      { from: "server", to: "data", protocol: "Drizzle" },
      { from: "server", to: "external", protocol: "@anthropic-ai/sdk" },
      { from: "client", to: "external", protocol: "OIDC redirect" },
    ],
    pipeline: [
      { id: "route", name: "app/api/ask/route.ts" },
      { id: "retrieve", name: "server/rag/retrieve.ts" },
      { id: "fuse", name: "server/rag/fuse.ts", guard: true },
      { id: "anonymize", name: "server/privacy/anonymizer.ts" },
      { id: "envelope", name: "server/ai/prompts.ts" },
      { id: "call", name: "server/ai/call.ts" },
      { id: "citations", name: "server/rag/citations.ts", guard: true },
      { id: "restore", name: "server/privacy/restoreStream.ts" },
    ],
  },
  // The deployed Vercel build — the one a visitor can open. The container build
  // differs enough to be worth saying so, which the first decision does, but not
  // enough to be worth a second diagram.
  trader: {
    nodes: [
      { id: "next", band: "client", name: "Next.js 15 (static export)" },
      { id: "zustand", band: "client", name: "Zustand" },
      { id: "charts", band: "client", name: "lightweight-charts" },
      { id: "fastapi", band: "server", name: "FastAPI" },
      { id: "market", band: "server", name: "app/market" },
      { id: "assistant", band: "server", name: "app/llm" },
      { id: "postgres", band: "data", name: "Postgres" },
      { id: "openrouter", band: "external", name: "OpenRouter" },
    ],
    edges: [
      { from: "client", to: "server", protocol: "GET /api/*" },
      { from: "server", to: "client", protocol: "SSE /api/market/stream" },
      { from: "server", to: "data", protocol: "asyncpg" },
      { from: "server", to: "external", protocol: "litellm (container build)" },
    ],
  },
  "games-db": {
    nodes: [
      { id: "next", band: "client", name: "Next.js 16 App Router" },
      { id: "rsc", band: "client", name: "React Server Components" },
      { id: "modules", band: "server", name: "server/ modules" },
      { id: "auth", band: "server", name: "Auth.js" },
      { id: "steam", band: "server", name: "server/steam" },
      { id: "postgres", band: "data", name: "Postgres (Neon)" },
      { id: "drizzle", band: "data", name: "Drizzle ORM" },
      { id: "trgm", band: "data", name: "pg_trgm GIN index" },
      { id: "steam-api", band: "external", name: "Steam Web API" },
    ],
    edges: [
      { from: "client", to: "server", protocol: "Server Components" },
      { from: "server", to: "data", protocol: "Drizzle" },
      { from: "server", to: "external", protocol: "HTTPS, rate limited" },
    ],
  },
  "my-movies": {
    nodes: [
      { id: "next", band: "client", name: "Next.js 16 App Router" },
      { id: "tmdb", band: "server", name: "server/tmdb" },
      { id: "auth", band: "server", name: "server/auth" },
      { id: "watchlist", band: "server", name: "server/watchlist" },
      { id: "revalidate", band: "server", name: "/api/revalidate" },
      { id: "postgres", band: "data", name: "Postgres (Neon)" },
      { id: "drizzle", band: "data", name: "Drizzle ORM" },
      { id: "tmdb-api", band: "external", name: "TMDB API" },
    ],
    edges: [
      { from: "client", to: "server", protocol: "Server Components" },
      { from: "server", to: "data", protocol: "Drizzle" },
      { from: "server", to: "external", protocol: "fetch, cached by tag" },
    ],
  },
  legal: {
    nodes: [
      { id: "next", band: "client", name: "Next.js 16" },
      { id: "pdf", band: "client", name: "@react-pdf/renderer" },
      { id: "fastapi", band: "server", name: "FastAPI" },
      { id: "oauth", band: "server", name: "GitHub OAuth" },
      { id: "chat", band: "server", name: "app/document_chat.py" },
      { id: "sqlite", band: "data", name: "SQLite" },
      { id: "templates", band: "data", name: "templates/*.md" },
      { id: "openrouter", band: "external", name: "OpenRouter" },
    ],
    edges: [
      { from: "client", to: "server", protocol: "REST /api/*" },
      { from: "server", to: "data", protocol: "SQLite" },
      { from: "server", to: "external", protocol: "chat completion" },
    ],
  },
  "work-planner": {
    nodes: [
      { id: "next", band: "client", name: "Next.js 16 App Router" },
      { id: "dnd", band: "client", name: "dnd-kit board" },
      { id: "pusher-js", band: "client", name: "pusher-js subscriber" },
      { id: "actions", band: "server", name: "Server Actions" },
      { id: "auth", band: "server", name: "Auth.js" },
      { id: "proxy", band: "server", name: "proxy.ts" },
      { id: "postgres", band: "data", name: "Postgres (Neon)" },
      { id: "drizzle", band: "data", name: "Drizzle ORM" },
      { id: "ranks", band: "data", name: "cards.rank" },
      { id: "pusher", band: "external", name: "Pusher" },
      { id: "s3", band: "external", name: "S3" },
    ],
    edges: [
      { from: "client", to: "server", protocol: "Server Actions" },
      { from: "server", to: "data", protocol: "Drizzle" },
      { from: "server", to: "external", protocol: "trigger" },
      { from: "external", to: "client", protocol: "Pusher channel" },
      { from: "client", to: "external", protocol: "presigned PUT/GET" },
    ],
  },
};
