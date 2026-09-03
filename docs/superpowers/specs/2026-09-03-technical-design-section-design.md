# Technical design section

Date: 2026-09-03
Status: approved design, not yet implemented

## Goal

Every project detail page gains a **Technical design** section: an architecture
diagram of that project plus up to three design decisions with their reasons.

The section exists to show judgement, not to inventory technologies. The stack
row already lists the technologies. The diagram shows how they are wired; the
decisions show why they were wired that way.

Every node, edge and decision is derived from the project's own repository,
which is checked out alongside this one. Nothing is invented. This is the same
rule the site already applies to metrics and posters.

## Non-goals

- No new routes. The section lives on `/work/[slug]` and `/cs/work/[slug]`.
- No new nav item, no shared architecture page, no home page teaser.
- No image files. The diagrams render as HTML (see "Why not images").
- No interactivity: no hover states carrying information, no expand/collapse,
  no links out of the diagram.
- No request walkthroughs or prose case studies. The decisions list is the
  only new prose beyond node notes.

## Placement

In `src/components/pages/project.tsx`, a new `<h2>` and section directly below
the "what it brings" highlights list and above the visit/source buttons.

Order on the page becomes: date, title, summary, poster, role/stack, highlights,
**technical design**, buttons, live note.

## Visual grammar

Every project uses the same bands, top to bottom:

```
  client     what runs in the browser
  server     what runs on the server
  data       where state lives
  external   third-party services
```

A project renders only the bands it has nodes for. Bands are horizontal rows;
nodes within a band wrap. The grammar is shared deliberately: five diagrams in
the same visual language are comparable, and comparability is the point.

### Edges

An edge connects two bands and carries a protocol label, which is a fact
(`SSE`, `Drizzle`, `Server Actions`, `presigned PUT`).

One rule decides how an edge renders:

- **A downward edge between adjacent bands** renders inline, as a vertical
  connector in the gap between the two bands, with its label beside it.
- **Every other edge** — upward, or spanning non-adjacent bands — renders as a
  labelled line in the left gutter, spanning the bands it connects, with an
  arrow tick at its destination end.

Gutter edges are laid out in lanes, one lane per edge, in declaration order,
so two of them cannot overlap. Work Planner has both kinds — a downward
`client → external` presigned-URL edge and an upward `external → client` Pusher
edge — and they must render as two distinct lanes.

This is what keeps the realtime stories honest. Trader's SSE stream and Work
Planner's Pusher channel both flow *back* to the client; drawing them as
downward arrows would misrepresent both systems.

### Why not images

A raster or hand-coloured SVG file would need one copy per theme, would not
adapt when a token changes, would not be selectable or searchable, would be
invisible to a screen reader without hand-written alt text, and would need a
regeneration step every time a stack changed. The posters in `public/work/`
earn their pixels because they are photographs of a running app. A diagram is
structured text and should stay structured text.

HTML also inherits the site's existing guarantees for free: `bg-surface`,
`border-line` and `text-accent` follow both themes with no `dark:` variant, and
`src/content/theme.test.ts` already enforces the contrast.

## Data model

New file `src/content/architecture.ts`. Facts only, locale-invariant.

```ts
import type { ProjectSlug } from "./projects";

export const BANDS = ["client", "server", "data", "external"] as const;
export type Band = (typeof BANDS)[number];

export type ArchNode = {
  /** Stable key. Copy dictionaries hang optional notes off it. */
  id: string;
  band: Band;
  /** A technology or component name. A fact, identical in every locale. */
  name: string;
};

export type ArchEdge = {
  from: Band;
  to: Band;
  /** Protocol or mechanism. A fact: "SSE", "Drizzle", "Server Actions". */
  protocol: string;
};

export type Architecture = { nodes: readonly ArchNode[]; edges: readonly ArchEdge[] };

export const architecture: Record<ProjectSlug, Architecture> = { ... };
```

`Record<ProjectSlug, Architecture>` is what makes adding a project without a
diagram a compile error, the same mechanism that already protects `cs.ts`.

### Invariants, enforced by unit test

1. Every `edge.from` and `edge.to` names a band that has at least one node.
2. Every `node.id` is unique within its project.
3. No edge connects a band to itself.
4. Every project has at least two bands and one edge.

## The five diagrams

Derived from the repositories on 2026-09-03. Node notes are shown here in
English; they live in the copy dictionaries (see "Copy model").

### trader

The deployed system — the Vercel serverless build a visitor can open. The
container build differs and is covered by a decision line rather than a second
diagram. Where the two diverge on the diagram itself, the label says so: that
build pins `LLM_MOCK=true` and does not install `litellm`, so its OpenRouter
edge is qualified rather than drawn as a call the deployment actually makes.

| Band | Nodes |
|---|---|
| client | Next.js 15 (static export), Zustand store, lightweight-charts |
| server | FastAPI *(one serverless function, `api/index.py`)*, market source *(deterministic, 2 ticks/sec)*, LLM assistant |
| data | Postgres *(asyncpg)* |
| external | OpenRouter *(container build only)* |

Edges: client → server `GET /api/*`; server → client `SSE /api/market/stream`
(gutter, upward); server → data `asyncpg`; server → external `litellm (container build)`.

Decisions:
1. **One FastAPI app, two deployments.** The container build simulates prices
   with numpy and calls a real LLM; the Vercel function computes them in closed
   form and ships `LLM_MOCK=true`. Both talk to the same Postgres, and the
   routes are the same either way, so the frontend does not know which one it
   is talking to.
2. **SSE, not WebSockets.** Prices flow one direction only. `STREAM_MAX_SECONDS`
   is 55, which keeps a stream inside Vercel's 60-second function ceiling.
3. **The frontend is a static export on the CDN.** `vercel.json` rewrites only
   `/api/*` into Python, so no page render ever goes through the function.

### games-db

| Band | Nodes |
|---|---|
| client | Next.js 16 App Router, React Server Components |
| server | `server/` modules *(catalogue, browse, detail, library, account)*, Auth.js *(Drizzle adapter)*, Steam client *(rate limiter, TTL cache)* |
| data | Postgres (Neon), Drizzle ORM *(4 checked-in migrations)*, `pg_trgm` GIN index *(on `game.name`)* |
| external | Steam Web API |

Edges: client → server `Server Components`; server → data `Drizzle`;
server → external `HTTPS, rate limited`.

Decisions:
1. **Search is Postgres, not a search service.** One `pg_trgm` GIN index on
   `game.name` covers 245,025 rows. No second datastore to keep in sync.
2. **Migrations are generated and checked in.** `db/migrations/` holds the four
   SQL files; the `pg_trgm` extension is created by migration `0003`, not by a
   manual step against the database.
3. **The Steam client owns its own rate limiter and TTL cache**, so a page
   render cannot fan out into an unbounded number of upstream calls.

### my-movies

| Band | Nodes |
|---|---|
| client | Next.js 16 App Router |
| server | `server/tmdb`, `server/auth` *(Auth.js + Drizzle adapter)*, `server/watchlist` *(Server Actions)*, `/api/revalidate` |
| data | Postgres (Neon), Drizzle ORM |
| external | TMDB API |

Edges: client → server `Server Components`; server → data `Drizzle`;
server → external `fetch, cached by tag`.

Decisions:
1. **TMDB responses are cached through Next's data cache, keyed by tag** —
   `tmdb:title:*`, `tmdb:list:*` — with per-endpoint revalidate windows from a
   day for configuration down to five minutes for search.
2. **`/api/revalidate` purges a tag on demand**, so a correction does not wait
   for the window to expire.
3. **Sessions live in the same Postgres as the watchlist**, through the Auth.js
   Drizzle adapter. One database, one migration history.

### legal

| Band | Nodes |
|---|---|
| client | Next.js 16, `@react-pdf/renderer` *(PDF built in the browser)* |
| server | FastAPI *(routes: auth, documents, chat, saved, demo)*, GitHub OAuth, document chat |
| data | SQLite, 11 markdown templates *(indexed by `catalog.json`)* |
| external | OpenRouter |

Edges: client → server `REST /api/*`; server → data `SQLite`;
server → external `chat completion`.

Decisions:
1. **Templates are markdown files in the repository, indexed by
   `catalog.json`** — no CMS and no content rows in the database. A template
   change is a reviewable diff.
2. **Frontend and API ship as one Vercel container service.**
   `Dockerfile.vercel` builds both and `vercel.json` rewrites every path to it,
   so there is no cross-origin hop between the two halves.
3. **The PDF is rendered in the browser.** The server never generates a
   document, so no request holds a rendering process open.

### work-planner

| Band | Nodes |
|---|---|
| client | Next.js 16 App Router, dnd-kit board, pusher-js subscriber |
| server | Server Actions *(`lib/actions` — the whole write surface)*, Auth.js, `proxy.ts` |
| data | Postgres (Neon), Drizzle ORM, fractional card ranks |
| external | Pusher, S3 *(presigned URLs)* |

Edges: client → server `Server Actions`; server → data `Drizzle`;
server → external `trigger`; external → client `Pusher channel` (gutter,
upward); client → external `presigned PUT/GET` (gutter, non-adjacent).

Decisions:
1. **Writes go through Server Actions, not route handlers.** `app/api/` holds
   only auth, Pusher auth, attachment redirects and health — everything else is
   in `lib/actions`, colocated with its tests.
2. **Cards carry fractional ranks**, so a drag writes one row instead of
   renumbering the column.
3. **Attachments go straight to S3 over presigned URLs.** File bytes never
   pass through the app, which keeps uploads clear of the function's limits.

## Copy model

Additions to `src/content/copy/types.ts`, mirrored in `en.ts` and `cs.ts`:

```ts
export type ArchitectureCopy = {
  /** Section heading, e.g. "Technical design". */
  heading: string;
  /** Band titles, shared by every project. */
  bands: Record<Band, string>;
  /** Accessible description prefix for the diagram region. */
  diagramLabel: string;
};

export type DesignDecision = { choice: string; because: string };
```

`ProjectCopy` gains:

```ts
  /** At most three. Node ids map to short optional notes. */
  design: {
    decisions: readonly DesignDecision[];
    notes?: Readonly<Record<string, string>>;
  };
```

`Copy` gains a top-level `architecture: ArchitectureCopy`.

`Band` is declared in `architecture.ts`, and `copy/types.ts` needs it for
`Record<Band, string>`. That closes a module cycle — `copy/types.ts` →
`architecture.ts` → `projects.ts` → `copy/types.ts` (for `Locale`). It must be
imported as `import type { Band }` so the cycle is erased at compile time and
never exists at runtime. `architecture.ts` must not import any value from the
copy dictionaries.

Split of facts and prose follows the existing rule exactly:

- **Facts, in `architecture.ts`:** band ids, node ids, node names, edge
  protocols. Technology names are identical in Czech.
- **Prose, in the dictionaries:** the section heading, band titles, node notes,
  and the decisions.

Because `ProjectCopy` is keyed by `ProjectSlug`, `cs.ts`'s `satisfies Copy`
check fails until Czech decisions exist for a new project.

Node notes are optional, at most one per node, and are for cases where the
bare name would mislead — `FastAPI` alone does not say "one serverless
function". In practice that is three or four per diagram. The decisions list,
not the diagram, carries the argument; a note that starts explaining a choice
belongs in the decisions instead.

## Selector

In `src/content/localise.ts`, alongside the existing selectors:

```ts
export type LocalisedNode = ArchNode & { note?: string };
export type LocalisedBand = { band: Band; title: string; nodes: LocalisedNode[] };
export type LocalisedArchitecture = {
  bands: LocalisedBand[];
  edges: readonly ArchEdge[];
  decisions: readonly DesignDecision[];
};

export function localiseArchitecture(slug: ProjectSlug, copy: Copy): LocalisedArchitecture;
```

It groups nodes into bands in `BANDS` order, drops empty bands, attaches notes
by node id, and throws if a note names an id that does not exist — the same
defensive shape as the existing metric/label mismatch check.

Components never import `architecture.ts` directly, exactly as they never
import `projects.ts` for display.

## Component

New `src/components/architecture-diagram.tsx`. A Server Component; no browser
APIs, so it stays off the client bundle.

Structure:

```
section  aria-labelledby
  h3 (visually the section heading, from copy)
  div (the stack)
    left gutter          gutter edges, absolutely positioned
    for each band:
      section
        h4  band title, `label` utility, text-muted
        ul  one li per node: name in font-mono, optional note in text-dim
      inline connector to the next band, with its protocol label
  ol  the decisions: choice in text, because in text-muted
```

Styling uses tokens only — `bg-surface`, `border-line`, `border-line-soft`,
`text-muted`, `text-dim`, `text-accent`. No hex, no `dark:`. Node boxes are
`border border-line bg-surface`; connectors are `border-line` with an accent
tick at the arrow end, matching the corner ticks in `SpecBlock`. Protocol
labels use the `label` utility.

Purely decorative rules and ticks are `aria-hidden`; the protocol text is not,
so the relationships survive in a screen reader.

Responsive: bands are full-width rows at every viewport and nodes wrap inside
them, so nothing needs to scroll horizontally. The left gutter collapses to a
narrower fixed width below `sm`.

## Testing

**Unit — `src/content/architecture.test.ts`**
- The four invariants listed under "Data model".
- `localiseArchitecture` returns bands in `BANDS` order with empty bands
  dropped.
- A note keyed to an unknown node id throws.
- Every project has between one and three decisions, each with a non-empty
  `choice` and `because`, in both locales.

**Component — `src/components/architecture-diagram.test.tsx`**
- Renders a band heading for each populated band and a list item per node.
- Renders every edge's protocol label.
- Renders the decisions in order.
- Renders Czech band titles under the `cs` copy and English under `en`.

**Page — extends `src/components/pages/project.test.tsx`**
- The technical design heading is present on the project page for every slug.
- Scope queries with `getByRole("main")`, per the existing convention.

**E2e — `e2e/`**
- The section is visible on `/work/trader` and on `/cs/work/trader`.
- At a 375px viewport, `document.documentElement.scrollWidth` does not exceed
  the viewport width on `/work/work-planner` — the densest diagram, and the one
  with both gutter edges.

## Build order

1. `architecture.ts` with all five projects, its types, `localiseArchitecture`,
   and the unit tests. No rendering yet.
2. `ArchitectureDiagram` with its component tests, driven by fixture copy.
3. English copy — heading, band titles, notes, decisions — wired into
   `project.tsx`; page tests extended.
4. Czech copy. `satisfies Copy` fails until it is complete, which is the point.
5. E2e specs.

Each step ends green on `npm run build && npm run lint && npm test`.

## Deferred, deliberately

- **A second diagram for Trader's container build.** One decision line covers
  the difference; two diagrams for one project would break the comparability
  the shared grammar buys.
- **Linking diagram nodes to the skill matrix.** The matrix already carries
  per-skill evidence by slug; a second cross-reference would duplicate it.
- **Any diagram on the home page or the work index.** Reconsider only if the
  section proves it earns attention on the detail pages.
