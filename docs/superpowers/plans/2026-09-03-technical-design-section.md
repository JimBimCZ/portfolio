# Technical Design Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every project detail page a "Technical design" section — an architecture diagram plus three design decisions — in both English and Czech.

**Architecture:** Facts (bands, node names, edge protocols) live in a new `src/content/architecture.ts` keyed by `ProjectSlug`; prose (heading, band titles, node notes, decisions) lives in the copy dictionaries. `localiseArchitecture` merges them, and a single Server Component renders the result as a CSS grid — bands are rows, gutter edges are columns. No new dependency, no image files, no build step.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4 (CSS-configured), Vitest + Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-03-technical-design-section-design.md`

## Global Constraints

- Branch is `feat/technical-design-section`, already created off `main`. Do not commit to `main`.
- After every task: `npm run build && npm run lint && npm test` must pass. The build is what type-checks — Vitest transpiles without checking types.
- **Never write a `dark:` variant and never write a raw hex colour.** Use only the existing tokens: `canvas`, `surface`, `raised`, `line`, `line-soft`, `text`, `muted`, `dim`, `accent`, `accent-soft`, `live`. No new tokens are needed by this plan.
- Use the `label` utility (defined in `globals.css`) for small-caps mono treatment rather than hand-rolling `text-xs uppercase tracking-*`.
- Components are Server Components unless they genuinely need browser APIs. Nothing in this plan needs them — do not add `"use client"`.
- Components never import `architecture.ts` directly. They receive data through `localiseArchitecture`, exactly as they already go through `localiseProject` / `localiseSkills`.
- `src/content/copy/copy.test.ts` already asserts that the Czech dictionary has **exactly the same leaf paths** as English, and that no leaf is empty. Arrays are walked as objects, so **English and Czech must have the same number of decisions and the same `notes` keys for every project**. A mismatch fails that existing test.
- No emojis. Comments explain *why*, not *what*, matching the density of the surrounding files.
- Prose facts must be true against the five sibling repositories at `/Users/vitbusek/Documents/projects/{trader,games-db,my_movies,legal,work-planner}`. Every string in this plan was verified there on 2026-09-03. Do not embellish them.

---

### Task 1: Architecture data

**Files:**
- Create: `src/content/architecture.ts`
- Create: `src/content/architecture.test.ts`

**Interfaces:**
- Consumes: `ProjectSlug` from `src/content/projects.ts`.
- Produces: `BANDS`, `type Band`, `type ArchNode`, `type ArchEdge`, `type Architecture`, `const architecture: Record<ProjectSlug, Architecture>` — all consumed by Tasks 2, 3 and 4.

- [ ] **Step 1: Write the failing test**

Create `src/content/architecture.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { BANDS, architecture, type Band } from "./architecture";
import { projects } from "./projects";

const entries = Object.entries(architecture);

describe("architecture", () => {
  test("describes every project in the log", () => {
    expect(Object.keys(architecture).sort()).toEqual(
      projects.map((project) => project.slug).sort(),
    );
  });

  test("every node sits in a declared band", () => {
    for (const [slug, { nodes }] of entries) {
      for (const node of nodes) {
        expect(BANDS, `${slug}/${node.id}`).toContain(node.band);
      }
    }
  });

  test("no node id is used twice in a project, so a note is never ambiguous", () => {
    for (const [slug, { nodes }] of entries) {
      const ids = nodes.map((node) => node.id);
      expect(new Set(ids).size, slug).toBe(ids.length);
    }
  });

  // An edge to an empty band would have nothing to attach to, and the renderer
  // silently drops it — so the diagram would quietly lose a relationship
  // rather than fail. Catch it here instead.
  test("every edge connects two bands that actually have nodes", () => {
    for (const [slug, { nodes, edges }] of entries) {
      const populated = new Set<Band>(nodes.map((node) => node.band));
      for (const edge of edges) {
        expect(populated, `${slug}: ${edge.protocol} from`).toContain(edge.from);
        expect(populated, `${slug}: ${edge.protocol} to`).toContain(edge.to);
      }
    }
  });

  test("no edge connects a band to itself", () => {
    for (const [slug, { edges }] of entries) {
      for (const edge of edges) {
        expect(edge.from, `${slug}: ${edge.protocol}`).not.toBe(edge.to);
      }
    }
  });

  test("every diagram has at least two bands and one edge", () => {
    for (const [slug, { nodes, edges }] of entries) {
      expect(new Set(nodes.map((node) => node.band)).size, slug).toBeGreaterThan(1);
      expect(edges.length, slug).toBeGreaterThan(0);
    }
  });

  test("every node and edge is labelled", () => {
    for (const [slug, { nodes, edges }] of entries) {
      for (const node of nodes) {
        expect(node.name.trim().length, `${slug}/${node.id}`).toBeGreaterThan(0);
      }
      for (const edge of edges) {
        expect(edge.protocol.trim().length, `${slug}: ${edge.from}->${edge.to}`).toBeGreaterThan(0);
      }
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- architecture`
Expected: FAIL — `Failed to resolve import "./architecture"`.

- [ ] **Step 3: Write the implementation**

Create `src/content/architecture.ts`:

```ts
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
  /** A component or technology name. A fact — "Postgres" is not translated. */
  name: string;
};

export type ArchEdge = {
  from: Band;
  to: Band;
  /** The mechanism, as a fact: "SSE", "Drizzle", "Server Actions". */
  protocol: string;
};

export type Architecture = {
  nodes: readonly ArchNode[];
  edges: readonly ArchEdge[];
};

/** `Record<ProjectSlug, …>` is what makes adding a project without a diagram a
 *  compile error, the same mechanism that already protects `cs.ts`. */
export const architecture: Record<ProjectSlug, Architecture> = {
  // The deployed Vercel build — the one a visitor can open. The container build
  // differs enough to be worth saying so, which the first decision does, but not
  // enough to be worth a second diagram.
  trader: {
    nodes: [
      { id: "next", band: "client", name: "Next.js 15 (static export)" },
      { id: "zustand", band: "client", name: "Zustand" },
      { id: "charts", band: "client", name: "lightweight-charts" },
      { id: "fastapi", band: "server", name: "FastAPI" },
      { id: "market", band: "server", name: "Market source" },
      { id: "assistant", band: "server", name: "LLM assistant" },
      { id: "postgres", band: "data", name: "Postgres" },
      { id: "openrouter", band: "external", name: "OpenRouter" },
    ],
    edges: [
      { from: "client", to: "server", protocol: "GET /api/*" },
      { from: "server", to: "client", protocol: "SSE /api/market/stream" },
      { from: "server", to: "data", protocol: "asyncpg" },
      { from: "server", to: "external", protocol: "litellm" },
    ],
  },
  "games-db": {
    nodes: [
      { id: "next", band: "client", name: "Next.js 16 App Router" },
      { id: "rsc", band: "client", name: "React Server Components" },
      { id: "modules", band: "server", name: "server/ modules" },
      { id: "auth", band: "server", name: "Auth.js" },
      { id: "steam", band: "server", name: "Steam client" },
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
      { id: "chat", band: "server", name: "Document chat" },
      { id: "sqlite", band: "data", name: "SQLite" },
      { id: "templates", band: "data", name: "11 markdown templates" },
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
      { id: "ranks", band: "data", name: "Fractional card ranks" },
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- architecture`
Expected: PASS, 7 tests.

- [ ] **Step 5: Verify the whole suite still passes**

Run: `npm run build && npm run lint && npm test`
Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add src/content/architecture.ts src/content/architecture.test.ts
git commit -m "Add the architecture data behind the technical design section

Bands, nodes and edges for all five projects, read out of each project's
own repository. Facts only — prose follows in the copy dictionaries.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01U8CPWFXXpbxaTgHy8mSYAT"
```

---

### Task 2: Shared architecture copy

Adds the strings that are the same for every project: the section heading, the four band titles, and the diagram's accessible name.

**Files:**
- Modify: `src/content/copy/types.ts`
- Modify: `src/content/copy/en.ts`
- Modify: `src/content/copy/cs.ts`
- Modify: `src/content/copy/copy.test.ts`

**Interfaces:**
- Consumes: `Band` from `src/content/architecture.ts` (Task 1).
- Produces: `Copy["architecture"]` of type `ArchitectureCopy` — `{ heading, diagramLabel, bands: Record<Band, string> }`, consumed by Tasks 3, 4 and 5.

- [ ] **Step 1: Write the failing test**

Append to `src/content/copy/copy.test.ts`:

```ts
describe("architecture copy", () => {
  test("names every band in every locale", () => {
    for (const locale of LOCALES) {
      const { bands } = getCopy(locale).architecture;
      expect(Object.keys(bands).sort(), locale).toEqual(BANDS.slice().sort());
    }
  });

  test("the section heading and diagram label differ between locales", () => {
    expect(cs.architecture.heading).not.toBe(en.architecture.heading);
    expect(cs.architecture.diagramLabel).not.toBe(en.architecture.diagramLabel);
  });
});
```

Add `BANDS` to that file's imports:

```ts
import { BANDS } from "../architecture";
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- copy`
Expected: FAIL — `Cannot read properties of undefined (reading 'bands')`.

- [ ] **Step 3: Add the type**

In `src/content/copy/types.ts`, add the import at the top, next to the existing `ProjectSlug` import:

```ts
import type { Band } from "../architecture";
```

`import type` matters here and is not stylistic. `copy/types.ts` → `architecture.ts` → `projects.ts` → `copy/types.ts` (for `Locale`) is a module cycle. As a type-only import it is erased at compile time and never exists at runtime; as a value import it would be a real cycle. For the same reason, `architecture.ts` must not import any value from the copy dictionaries.

Then add the type, above the `Copy` type:

```ts
/** The strings the technical design section shares across every project. */
export type ArchitectureCopy = {
  /** The section's <h2>. */
  heading: string;
  /** Accessible name of the diagram's group landmark. */
  diagramLabel: string;
  /** Band titles, in the reader's language. */
  bands: Record<Band, string>;
};
```

And add the field to `Copy`, after `meta`:

```ts
  architecture: ArchitectureCopy;
```

- [ ] **Step 4: Add the English copy**

In `src/content/copy/en.ts`, after the `meta` block and before `projects`:

```ts
  architecture: {
    heading: "Technical design",
    diagramLabel: "Architecture diagram",
    bands: {
      client: "Client",
      server: "Server",
      data: "Data",
      external: "External",
    },
  },
```

- [ ] **Step 5: Add the Czech copy**

In `src/content/copy/cs.ts`, in the same position:

```ts
  architecture: {
    heading: "Technický návrh",
    diagramLabel: "Diagram architektury",
    bands: {
      client: "Klient",
      server: "Server",
      data: "Data",
      external: "Externí služby",
    },
  },
```

`data` is deliberately identical in both dictionaries — it is the Czech word too. The existing "is actually Czech" test only checks prose the reader judges the site by, so this does not trip it.

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test -- copy`
Expected: PASS, including the pre-existing "covers exactly the keys English covers" and "leaves nothing empty" tests.

- [ ] **Step 7: Verify the whole suite still passes**

Run: `npm run build && npm run lint && npm test`
Expected: all green.

- [ ] **Step 8: Commit**

```bash
git add src/content/copy/types.ts src/content/copy/en.ts src/content/copy/cs.ts src/content/copy/copy.test.ts
git commit -m "Add the shared copy for the technical design section

The heading, the diagram's accessible name and the four band titles, in
both dictionaries. Band membership stays a fact in architecture.ts.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01U8CPWFXXpbxaTgHy8mSYAT"
```

---

### Task 3: Per-project design copy and the selector

**Files:**
- Modify: `src/content/copy/types.ts`
- Modify: `src/content/copy/en.ts`
- Modify: `src/content/copy/cs.ts`
- Modify: `src/content/localise.ts`
- Modify: `src/content/localise.test.ts`
- Modify: `src/content/copy/copy.test.ts`

**Interfaces:**
- Consumes: `BANDS`, `Band`, `ArchEdge`, `ArchNode`, `architecture` (Task 1); `ArchitectureCopy` (Task 2).
- Produces:
  - `type DesignDecision = { choice: string; because: string }` and `ProjectCopy["design"]` — `{ decisions: readonly DesignDecision[]; notes?: Readonly<Record<string, string>> }`.
  - `type LocalisedNode = ArchNode & { note?: string }`
  - `type LocalisedBand = { band: Band; title: string; nodes: LocalisedNode[] }`
  - `type LocalisedArchitecture = { bands: LocalisedBand[]; edges: readonly ArchEdge[]; decisions: readonly DesignDecision[] }`
  - `function localiseArchitecture(slug: string, copy: Copy): LocalisedArchitecture`
  - All consumed by Tasks 4 and 5.

- [ ] **Step 1: Write the failing tests**

Append to `src/content/localise.test.ts`:

```ts
describe("localiseArchitecture", () => {
  test("returns bands top to bottom", () => {
    const { bands } = localiseArchitecture("games-db", en);
    expect(bands.map((band) => band.band)).toEqual(["client", "server", "data", "external"]);
    expect(bands[0].title).toBe("Client");
    expect(bands[0].nodes.map((node) => node.id)).toEqual(["next", "rsc"]);
  });

  // Every project currently fills all four bands, so this asserts the rule
  // rather than a case: what comes back is exactly the bands that have nodes,
  // never an empty one the renderer would draw as a blank box.
  test("returns exactly the bands that have nodes", () => {
    for (const { slug } of projects) {
      const { bands } = localiseArchitecture(slug, en);
      const expected = BANDS.filter((band) =>
        architecture[slug].nodes.some((node) => node.band === band),
      );
      expect(bands.map((band) => band.band), slug).toEqual(expected);
      for (const band of bands) {
        expect(band.nodes.length, `${slug}/${band.band}`).toBeGreaterThan(0);
      }
    }
  });

  test("titles each band in the reader's language", () => {
    const { bands } = localiseArchitecture("games-db", cs);
    expect(bands.map((band) => band.title)).toEqual([
      "Klient",
      "Server",
      "Data",
      "Externí služby",
    ]);
  });

  test("attaches each note to its node and leaves the rest without one", () => {
    const { bands } = localiseArchitecture("trader", en);
    const server = bands.find((band) => band.band === "server")!;
    expect(server.nodes.find((node) => node.id === "fastapi")?.note).toBe(
      "One serverless function, api/index.py.",
    );
    expect(server.nodes.find((node) => node.id === "assistant")?.note).toBeUndefined();
  });

  test("carries the edges and decisions through untouched", () => {
    const result = localiseArchitecture("trader", en);
    expect(result.edges).toEqual(architecture.trader.edges);
    expect(result.decisions).toEqual(en.projects.trader.design.decisions);
  });

  // A renamed node id would otherwise silently drop its note, leaving the
  // diagram quietly less informative rather than failing.
  test("throws when a note names a node the diagram does not have", () => {
    const copy = {
      ...en,
      projects: {
        ...en.projects,
        trader: {
          ...en.projects.trader,
          design: { ...en.projects.trader.design, notes: { "no-such-node": "orphaned" } },
        },
      },
    };
    expect(() => localiseArchitecture("trader", copy)).toThrow(/no-such-node/);
  });

  test("throws on a project it has no diagram for", () => {
    expect(() => localiseArchitecture("not-a-project", en)).toThrow(/not-a-project/);
  });
});
```

Add one import to that file:

```ts
import { BANDS, architecture } from "./architecture";
```

and add `localiseArchitecture` to the existing `./localise` import list. The file
already imports `projects`. The file
already defines `const en = getCopy("en")` and `const cs = getCopy("cs")` at the
top and already imports `describe` — use those rather than adding duplicates.

Append to `src/content/copy/copy.test.ts`:

```ts
describe("design decisions", () => {
  test("every project gives one to three decisions in every locale", () => {
    for (const locale of LOCALES) {
      const { projects } = getCopy(locale);
      for (const [slug, project] of Object.entries(projects)) {
        expect(project.design.decisions.length, `${locale}.${slug}`).toBeGreaterThan(0);
        expect(project.design.decisions.length, `${locale}.${slug}`).toBeLessThanOrEqual(3);
      }
    }
  });

  // A decision that only names a choice is a stack list with extra steps. The
  // reason is the part worth reading.
  test("every decision states a reason, not just a choice", () => {
    for (const locale of LOCALES) {
      for (const [slug, project] of Object.entries(getCopy(locale).projects)) {
        for (const decision of project.design.decisions) {
          expect(decision.choice.trim().length, `${locale}.${slug}`).toBeGreaterThan(0);
          expect(decision.because.trim().length, `${locale}.${slug}`).toBeGreaterThan(20);
        }
      }
    }
  });
});
```

And extend the existing "is actually Czech, not English pasted twice" test by adding this line inside its `for` loop over slugs, after the `summary` assertion:

```ts
      expect(cs.projects[slug].design.decisions[0].because, slug).not.toBe(
        en.projects[slug].design.decisions[0].because,
      );
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- localise copy`
Expected: FAIL — `localiseArchitecture is not exported`, and `Cannot read properties of undefined (reading 'decisions')`.

- [ ] **Step 3: Add the types**

In `src/content/copy/types.ts`, above `ProjectCopy`:

```ts
/** One architectural choice and the reason for it. */
export type DesignDecision = { choice: string; because: string };
```

And inside `ProjectCopy`, after `metricLabels`:

```ts
  /** The technical design section's prose. At most three decisions, and notes
   *  keyed by the node ids in `src/content/architecture.ts`. */
  design: {
    decisions: readonly DesignDecision[];
    notes?: Readonly<Record<string, string>>;
  };
```

- [ ] **Step 4: Add the English copy**

In `src/content/copy/en.ts`, add a `design` block to each project entry, after its `metricLabels`.

`trader`:

```ts
      design: {
        notes: {
          fastapi: "One serverless function, api/index.py.",
          market: "Deterministic prices, two ticks a second.",
          postgres: "Driven by asyncpg.",
          openrouter: "Container build only.",
        },
        decisions: [
          {
            choice: "One FastAPI app, two deployments.",
            because:
              "The container build simulates prices with numpy against SQLite and calls a real model; the Vercel function computes them in closed form, talks to Postgres and ships LLM_MOCK=true. The routes are identical, so the frontend never learns which one it reached.",
          },
          {
            choice: "SSE, not WebSockets.",
            because:
              "Prices only ever flow one way. STREAM_MAX_SECONDS is 55, which keeps a stream inside Vercel's sixty-second ceiling for a function.",
          },
          {
            choice: "The frontend is a static export on the CDN.",
            because:
              "vercel.json rewrites only /api/* into Python, so no page render ever passes through the function.",
          },
        ],
      },
```

`games-db`:

```ts
      design: {
        notes: {
          modules: "Catalogue, browse, detail, library, account.",
          steam: "Its own rate limiter and TTL cache.",
          drizzle: "Four checked-in migrations.",
          trgm: "On game.name.",
        },
        decisions: [
          {
            choice: "Search is Postgres, not a search service.",
            because:
              "One pg_trgm GIN index on game.name covers 245,025 rows. Nothing to keep in sync, and no second datastore to pay for.",
          },
          {
            choice: "Migrations are generated and checked in.",
            because:
              "db/migrations holds all four SQL files, and the pg_trgm extension is created by migration 0003 — not by a manual step someone has to remember against a new database.",
          },
          {
            choice: "The Steam client owns its own rate limiter and cache.",
            because:
              "A page render cannot fan out into an unbounded number of upstream calls, whatever the page asks for.",
          },
        ],
      },
```

`my-movies`:

```ts
      design: {
        notes: {
          tmdb: "Typed client, cache tags per endpoint.",
          auth: "Auth.js with the Drizzle adapter.",
          watchlist: "Server Actions.",
        },
        decisions: [
          {
            choice: "TMDB responses are cached by tag, through Next's own data cache.",
            because:
              "Windows run from a day for configuration down to five minutes for search, so a browse page costs nothing upstream.",
          },
          {
            choice: "/api/revalidate purges a tag on demand.",
            because:
              "A correction does not have to wait out its window before a reader sees it.",
          },
          {
            choice: "Sessions live in the same Postgres as the watchlist.",
            because:
              "One database and one migration history, through the Auth.js Drizzle adapter.",
          },
        ],
      },
```

`legal`:

```ts
      design: {
        notes: {
          pdf: "The PDF is built in the browser.",
          fastapi: "Routes: auth, documents, chat, saved, demo.",
          templates: "Indexed by catalog.json.",
        },
        decisions: [
          {
            choice: "Templates are markdown files in the repository.",
            because:
              "catalog.json indexes them, so there is no CMS and no content rows in the database — a template change arrives as a diff someone can review.",
          },
          {
            choice: "The frontend and the API ship as one container.",
            because:
              "Dockerfile.vercel builds both and every path is rewritten to that one service, so there is no cross-origin hop and no CORS layer to configure.",
          },
          {
            choice: "The PDF is rendered in the browser.",
            because:
              "The server never generates a document, so no request holds a rendering process open.",
          },
        ],
      },
```

`work-planner`:

```ts
      design: {
        notes: {
          actions: "lib/actions — the whole write surface.",
          proxy: "Sends unauthenticated /boards/* to sign-in.",
          s3: "Reached over presigned URLs.",
        },
        decisions: [
          {
            choice: "Writes go through Server Actions, not route handlers.",
            because:
              "app/api holds only auth, Pusher auth, attachment redirects and health; everything else lives in lib/actions next to its tests.",
          },
          {
            choice: "Cards carry fractional ranks.",
            because:
              "Dragging a card writes one row instead of renumbering the column it landed in.",
          },
          {
            choice: "Attachments go straight to S3 over presigned URLs.",
            because:
              "File bytes never pass through the app, which keeps uploads clear of the function's request limits.",
          },
        ],
      },
```

- [ ] **Step 5: Add the Czech copy**

In `src/content/copy/cs.ts`, add a `design` block to each project entry, in the same position and with **the same `notes` keys and the same number of decisions** — the existing leaf-path parity test enforces both.

`trader`:

```ts
      design: {
        notes: {
          fastapi: "Jedna serverless funkce, api/index.py.",
          market: "Deterministické ceny, dva ticky za sekundu.",
          postgres: "Přes asyncpg.",
          openrouter: "Jen v kontejnerovém buildu.",
        },
        decisions: [
          {
            choice: "Jedna aplikace ve FastAPI, dvě nasazení.",
            because:
              "Kontejnerový build simuluje ceny přes numpy nad SQLite a volá skutečný model; funkce na Vercelu je počítá uzavřeným vzorcem, mluví s Postgresem a běží s LLM_MOCK=true. Routy jsou stejné, takže frontend nepozná, ke které se dostal.",
          },
          {
            choice: "SSE, ne WebSockety.",
            because:
              "Ceny tečou jen jedním směrem. STREAM_MAX_SECONDS je 55, takže se stream vejde do šedesátisekundového limitu funkce na Vercelu.",
          },
          {
            choice: "Frontend je statický export na CDN.",
            because:
              "vercel.json přesměrovává do Pythonu jen /api/*, takže vykreslení stránky nikdy neprochází funkcí.",
          },
        ],
      },
```

`games-db`:

```ts
      design: {
        notes: {
          modules: "Katalog, procházení, detail, knihovna, účet.",
          steam: "Vlastní omezovač frekvence a TTL cache.",
          drizzle: "Čtyři zaverzované migrace.",
          trgm: "Nad game.name.",
        },
        decisions: [
          {
            choice: "Vyhledávání běží na Postgresu, ne na vyhledávací službě.",
            because:
              "Jeden GIN index pg_trgm nad game.name pokrývá 245 025 řádků. Není co synchronizovat a není třeba platit druhé úložiště.",
          },
          {
            choice: "Migrace se generují a verzují.",
            because:
              "V db/migrations leží všechny čtyři SQL soubory a rozšíření pg_trgm zakládá migrace 0003 — ne ruční krok, který si někdo musí u nové databáze pamatovat.",
          },
          {
            choice: "Klient Steamu si nese vlastní omezovač frekvence a cache.",
            because:
              "Vykreslení stránky se nemůže rozpadnout do neomezeného počtu volání nahoru, ať si stránka řekne o cokoli.",
          },
        ],
      },
```

`my-movies`:

```ts
      design: {
        notes: {
          tmdb: "Typovaný klient, cache tagy podle endpointu.",
          auth: "Auth.js s adaptérem pro Drizzle.",
          watchlist: "Server Actions.",
        },
        decisions: [
          {
            choice: "Odpovědi z TMDB se cachují podle tagů v datové cache Nextu.",
            because:
              "Okna sahají od jednoho dne pro konfiguraci po pět minut pro vyhledávání, takže stránka s procházením nestojí nahoře nic.",
          },
          {
            choice: "/api/revalidate na vyžádání zneplatní tag.",
            because:
              "Oprava nemusí čekat, až vyprší okno, aby ji čtenář uviděl.",
          },
          {
            choice: "Sezení leží ve stejném Postgresu jako watchlist.",
            because:
              "Jedna databáze a jedna historie migrací, přes adaptér Auth.js pro Drizzle.",
          },
        ],
      },
```

`legal`:

```ts
      design: {
        notes: {
          pdf: "PDF se sestavuje v prohlížeči.",
          fastapi: "Routy: auth, documents, chat, saved, demo.",
          templates: "Indexované přes catalog.json.",
        },
        decisions: [
          {
            choice: "Šablony jsou markdownové soubory v repozitáři.",
            because:
              "Indexuje je catalog.json, takže není potřeba CMS ani řádky s obsahem v databázi — změna šablony přijde jako diff, který jde zrevidovat.",
          },
          {
            choice: "Frontend a API se nasazují jako jeden kontejner.",
            because:
              "Dockerfile.vercel staví oboje a všechny cesty míří na tuhle jednu službu, takže nevzniká přechod mezi originy ani vrstva CORS, kterou by bylo třeba nastavovat.",
          },
          {
            choice: "PDF se vykresluje v prohlížeči.",
            because:
              "Server žádný dokument negeneruje, takže žádný požadavek nedrží otevřený vykreslovací proces.",
          },
        ],
      },
```

`work-planner`:

```ts
      design: {
        notes: {
          actions: "lib/actions — celá zapisovací plocha.",
          proxy: "Nepřihlášené požadavky na /boards/* posílá na přihlášení.",
          s3: "Dostupné přes předpodepsané URL.",
        },
        decisions: [
          {
            choice: "Zápisy jdou přes Server Actions, ne přes route handlery.",
            because:
              "V app/api zůstalo jen přihlášení, autorizace Pusheru, přesměrování příloh a health; všechno ostatní leží v lib/actions vedle svých testů.",
          },
          {
            choice: "Karty nesou zlomkové pořadí.",
            because:
              "Přetažení karty zapíše jeden řádek místo přečíslování celého sloupce, do kterého karta spadla.",
          },
          {
            choice: "Přílohy jdou rovnou do S3 přes předpodepsané URL.",
            because:
              "Bajty souboru nikdy neprocházejí aplikací, takže se nahrávání nezadrhne o limity požadavku ve funkci.",
          },
        ],
      },
```

- [ ] **Step 6: Write the selector**

In `src/content/localise.ts`, extend the existing imports:

```ts
import { BANDS, architecture, type ArchEdge, type ArchNode, type Band } from "./architecture";
import type { Copy, DesignDecision, Locale } from "./copy/types";
```

(Merge `DesignDecision` into the existing `./copy/types` import rather than adding a second statement.)

Then append:

```ts
export type LocalisedNode = ArchNode & { note?: string };
export type LocalisedBand = { band: Band; title: string; nodes: LocalisedNode[] };
export type LocalisedArchitecture = {
  bands: LocalisedBand[];
  edges: readonly ArchEdge[];
  decisions: readonly DesignDecision[];
};

/**
 * Pairs a project's wiring with the reader's language: band titles and node
 * notes come from the dictionary, everything structural from architecture.ts.
 *
 * Bands come back in `BANDS` order with the empty ones dropped, so the
 * renderer can index rows off the array position and does not have to know
 * which bands a given project happens to use.
 */
export function localiseArchitecture(slug: string, copy: Copy): LocalisedArchitecture {
  const data = architecture[slug as ProjectSlug];
  if (!data) throw new Error(`no architecture for project: ${slug}`);

  const { decisions, notes = {} } = copy.projects[slug as ProjectSlug].design;

  // A renamed node id would otherwise drop its note without a word, leaving
  // the diagram quietly less informative than it reads in the dictionary.
  const ids = new Set(data.nodes.map((node) => node.id));
  for (const id of Object.keys(notes)) {
    if (!ids.has(id)) throw new Error(`${slug}: note for unknown node ${id}`);
  }

  const bands = BANDS.map((band) => ({
    band,
    title: copy.architecture.bands[band],
    nodes: data.nodes
      .filter((node) => node.band === band)
      .map((node) => ({ ...node, note: notes[node.id] })),
  })).filter((band) => band.nodes.length > 0);

  return { bands, edges: data.edges, decisions };
}
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npm test -- localise copy`
Expected: PASS.

- [ ] **Step 8: Verify the whole suite still passes**

Run: `npm run build && npm run lint && npm test`
Expected: all green.

- [ ] **Step 9: Commit**

```bash
git add src/content/copy src/content/localise.ts src/content/localise.test.ts
git commit -m "Add per-project design copy and the architecture selector

Three decisions and a handful of node notes per project, in both
languages, plus localiseArchitecture to merge them with the diagram data.
A note keyed to a node that no longer exists throws rather than vanishing.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01U8CPWFXXpbxaTgHy8mSYAT"
```

---

### Task 4: The diagram component

**Files:**
- Create: `src/components/architecture-diagram.tsx`
- Create: `src/components/architecture-diagram.test.tsx`

**Interfaces:**
- Consumes: `LocalisedArchitecture` and `localiseArchitecture` (Task 3), `Copy["architecture"]` (Task 2).
- Produces: `function ArchitectureDiagram({ architecture, label }: { architecture: LocalisedArchitecture; label: string })` — consumed by Task 5.

**Layout, before you write it.** The whole thing is one CSS grid.

- Rows: band *i* (zero-indexed in the `bands` array) sits on grid row `i * 2 + 1`. The row between two bands, `i * 2 + 2`, is where an inline connector goes. An empty connector row collapses to nothing.
- Columns: one narrow column per gutter edge — that is what makes lanes, so two gutter edges cannot overlap — then one `minmax(0, 1fr)` column holding every band.
- An edge is **inline** when its destination row is exactly two below its origin row (adjacent, downward). Every other edge is a **gutter** edge and gets a lane.
- Grid placement is computed from data, so it goes in `style`, not in class names. Tailwind cannot generate a class for a row index it has never seen.

- [ ] **Step 1: Write the failing test**

Create `src/components/architecture-diagram.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import { localiseArchitecture } from "@/content/localise";
import { ArchitectureDiagram } from "./architecture-diagram";

function renderFor(slug: string, locale: "en" | "cs" = "en") {
  const copy = getCopy(locale);
  const architecture = localiseArchitecture(slug, copy);
  render(
    <ArchitectureDiagram architecture={architecture} label={copy.architecture.diagramLabel} />,
  );
  return architecture;
}

test("heads every band the project uses", () => {
  const { bands } = renderFor("games-db");
  for (const band of bands) {
    expect(screen.getByRole("heading", { level: 3, name: band.title })).toBeInTheDocument();
  }
});

test("names every node, with its note where it has one", () => {
  const { bands } = renderFor("trader");
  for (const band of bands) {
    for (const node of band.nodes) {
      expect(screen.getByText(node.name)).toBeInTheDocument();
      if (node.note) expect(screen.getByText(node.note)).toBeInTheDocument();
    }
  }
});

// The protocol is the part of an edge a screen reader can get at; the rule and
// the arrow tick are decorative. Losing it would leave the relationships
// invisible to anyone not looking at the picture.
test("labels every edge with its protocol, whichever way it runs", () => {
  const { edges } = renderFor("work-planner");
  expect(edges.length).toBe(5);
  for (const edge of edges) {
    expect(screen.getByText(edge.protocol)).toBeInTheDocument();
  }
});

test("gives the diagram an accessible name", () => {
  renderFor("legal");
  expect(screen.getByRole("group", { name: "Architecture diagram" })).toBeInTheDocument();
});

test("lists the decisions in order, each with its reason", () => {
  const { decisions } = renderFor("legal");
  const items = screen.getAllByRole("listitem");
  const text = items.map((item) => item.textContent ?? "");
  for (const decision of decisions) {
    expect(text.some((line) => line.includes(decision.choice))).toBe(true);
    expect(text.some((line) => line.includes(decision.because))).toBe(true);
  }
});

test("reads in Czech under the Czech dictionary", () => {
  renderFor("games-db", "cs");
  expect(screen.getByRole("heading", { level: 3, name: "Klient" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 3, name: "Externí služby" })).toBeInTheDocument();
  // Technology names are facts and stay put in both languages.
  expect(screen.getByText("Postgres (Neon)")).toBeInTheDocument();
});

test("places each band on its own grid row and each gutter edge in its own lane", () => {
  renderFor("work-planner");
  const diagram = screen.getByRole("group", { name: "Architecture diagram" });
  const bands = within(diagram).getAllByRole("heading", { level: 3 });
  const rows = bands.map((heading) => heading.closest("section")!.style.gridRow);
  expect(rows).toEqual(["1", "3", "5", "7"]);

  // Three of work-planner's five edges are non-adjacent or upward, so each
  // needs a lane of its own — overlapping them would draw one line over another.
  const lanes = within(diagram)
    .getAllByTestId("gutter-edge")
    .map((edge) => edge.style.gridColumn);
  expect(new Set(lanes).size).toBe(3);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- architecture-diagram`
Expected: FAIL — `Failed to resolve import "./architecture-diagram"`.

- [ ] **Step 3: Write the component**

Create `src/components/architecture-diagram.tsx`:

```tsx
import type { LocalisedArchitecture } from "@/content/localise";

/**
 * A project's wiring as one CSS grid: bands are rows, and each edge that
 * cannot be drawn between two adjacent rows gets a lane of its own in the
 * gutter on the left.
 *
 * It is markup rather than an image on purpose. A picture would need one file
 * per theme, would not follow a token change, and would say nothing to a
 * screen reader without alt text repeating the whole diagram in prose.
 */
export function ArchitectureDiagram({
  architecture,
  label,
}: {
  architecture: LocalisedArchitecture;
  label: string;
}) {
  const { bands, edges, decisions } = architecture;

  // Band i occupies grid row i*2+1; row i*2+2 is the gap where a connector
  // between band i and band i+1 is drawn.
  const rowOf = new Map(bands.map((band, index) => [band.band, index * 2 + 1]));

  const placed = edges.flatMap((edge) => {
    const from = rowOf.get(edge.from);
    const to = rowOf.get(edge.to);
    // Unreachable with the data in architecture.ts, whose test asserts every
    // edge names a populated band. Guarding keeps a bad edit from throwing
    // inside the grid maths instead of failing that test.
    return from === undefined || to === undefined ? [] : [{ edge, from, to }];
  });

  const inline = placed.filter(({ from, to }) => to - from === 2);
  const gutter = placed.filter(({ from, to }) => to - from !== 2);
  const content = gutter.length + 1;

  return (
    <>
      <div
        role="group"
        aria-label={label}
        className="mt-6 grid gap-x-2"
        style={{ gridTemplateColumns: `repeat(${gutter.length}, 1.25rem) minmax(0, 1fr)` }}
      >
        {gutter.map(({ edge, from, to }, lane) => (
          <GutterEdge
            key={`${edge.from}-${edge.to}-${edge.protocol}`}
            protocol={edge.protocol}
            column={lane + 1}
            from={from}
            to={to}
          />
        ))}

        {bands.map((band, index) => (
          <section
            key={band.band}
            style={{ gridRow: index * 2 + 1, gridColumn: content }}
            className="border border-line bg-surface p-4"
          >
            <h3 className="label text-muted">{band.title}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {band.nodes.map((node) => (
                <li
                  key={node.id}
                  className="max-w-full border border-line-soft bg-raised px-3 py-2"
                >
                  <p className="font-mono text-sm break-words">{node.name}</p>
                  {node.note && <p className="mt-1 text-xs text-dim">{node.note}</p>}
                </li>
              ))}
            </ul>
          </section>
        ))}

        {inline.map(({ edge, from }) => (
          <p
            key={`${edge.from}-${edge.to}-${edge.protocol}`}
            style={{ gridRow: from + 1, gridColumn: content }}
            className="flex items-center gap-3 py-1 pl-6"
          >
            <span aria-hidden className="h-8 w-px bg-line" />
            <span className="label text-dim">{edge.protocol}</span>
          </p>
        ))}
      </div>

      <ol className="mt-8 grid gap-4">
        {decisions.map((decision) => (
          <li key={decision.choice} className="flex gap-4 leading-relaxed">
            <span aria-hidden className="mt-3 h-px w-6 shrink-0 bg-accent" />
            <span>
              {decision.choice} <span className="text-muted">{decision.because}</span>
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}

/**
 * An edge the stack cannot draw between two adjacent rows: it runs upward
 * (Trader's price stream, Work Planner's Pusher channel) or skips a band
 * (an upload going straight from the browser to S3). One per lane, so two of
 * them never sit on top of each other.
 */
function GutterEdge({
  protocol,
  column,
  from,
  to,
}: {
  protocol: string;
  column: number;
  from: number;
  to: number;
}) {
  const upward = to < from;
  const start = Math.min(from, to);
  const end = Math.max(from, to);

  return (
    <span
      data-testid="gutter-edge"
      style={{ gridColumn: column, gridRow: `${start} / ${end + 1}` }}
      className="relative flex items-center justify-center"
    >
      <span aria-hidden className="absolute inset-y-3 left-1/2 w-px -translate-x-1/2 bg-line" />
      <span
        aria-hidden
        className={`absolute left-1/2 size-2 -translate-x-1/2 rotate-45 border-accent ${
          upward ? "top-3 border-l border-t" : "bottom-3 border-b border-r"
        }`}
      />
      <span className="label relative rotate-180 bg-canvas py-2 text-dim [writing-mode:vertical-rl]">
        {protocol}
      </span>
    </span>
  );
}
```

The arrow tick is a square with two adjacent borders rotated 45 degrees — the same construction as `SpecBlock`'s corner ticks, so it inherits the accent token in both themes. `bg-canvas` on the label is what stops the vertical rule showing through the text behind it.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- architecture-diagram`
Expected: PASS, 7 tests.

- [ ] **Step 5: Verify the whole suite still passes**

Run: `npm run build && npm run lint && npm test`
Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add src/components/architecture-diagram.tsx src/components/architecture-diagram.test.tsx
git commit -m "Render the architecture diagram

Bands are grid rows; an edge that runs upward or skips a band gets its
own lane in the left gutter, so Trader's price stream and Work Planner's
Pusher channel point back at the client rather than away from it.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01U8CPWFXXpbxaTgHy8mSYAT"
```

---

### Task 5: Wire the section into the project page

**Files:**
- Modify: `src/components/pages/project.tsx`
- Modify: `src/app/(en)/work/[slug]/page.test.tsx`
- Modify: `src/app/(cs)/cs/work/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `ArchitectureDiagram` (Task 4), `localiseArchitecture` (Task 3), `copy.architecture` (Task 2).
- Produces: nothing new. `ProjectPage`'s props are unchanged — it derives the architecture from the `project.slug` and `copy` it already receives.

- [ ] **Step 1: Write the failing tests**

Append to `src/app/(en)/work/[slug]/page.test.tsx`:

```tsx
test("shows the technical design of every project", async () => {
  for (const { slug } of projects) {
    const { unmount } = render(await ProjectPage(argsFor(slug)));
    const main = screen.getByRole("main");
    expect(
      within(main).getByRole("heading", { level: 2, name: "Technical design" }),
      slug,
    ).toBeInTheDocument();

    const architecture = localiseArchitecture(slug, getCopy("en"));
    for (const band of architecture.bands) {
      expect(within(main).getByRole("heading", { level: 3, name: band.title }), slug)
        .toBeInTheDocument();
    }
    for (const decision of architecture.decisions) {
      expect(within(main).getByText(decision.choice), slug).toBeInTheDocument();
    }
    unmount();
  }
});
```

Extend that file's imports to add `within` from `@testing-library/react`, `projects` from `@/content/projects`, and `localiseArchitecture` alongside the existing `localiseProject` import.

Append to `src/app/(cs)/cs/work/[slug]/page.test.tsx`. That file's page component
is imported as `CzechProject`, and it already has `argsFor` and a
`const copy = getCopy("cs")` at the top — use them. Add `within` to its
`@testing-library/react` import.

```tsx
test("renders the technical design in Czech", async () => {
  render(await CzechProject(argsFor("work-planner")));
  const main = screen.getByRole("main");

  expect(
    within(main).getByRole("heading", { level: 2, name: copy.architecture.heading }),
  ).toBeInTheDocument();
  expect(
    within(main).getByRole("heading", { level: 3, name: copy.architecture.bands.client }),
  ).toBeInTheDocument();
  expect(
    within(main).getByText(copy.projects["work-planner"].design.decisions[0].choice),
  ).toBeInTheDocument();
  // Technology names are facts, so they read the same in both trees.
  expect(within(main).getByText("Drizzle ORM")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- slug`
Expected: FAIL — `Unable to find an accessible element with the role "heading" and name "Technical design"`.

- [ ] **Step 3: Add the section**

In `src/components/pages/project.tsx`, extend the imports:

```ts
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { localiseArchitecture } from "@/content/localise";
```

Inside the component, before the `return`:

```tsx
  const architecture = localiseArchitecture(project.slug, copy);
```

Then insert this between the highlights `<ul>` and the `{(project.liveUrl || project.repo) && (` block:

```tsx
      <h2 className="label mt-14 text-muted">{copy.architecture.heading}</h2>
      <ArchitectureDiagram
        architecture={architecture}
        label={copy.architecture.diagramLabel}
      />
```

The `<h2>` lives here rather than inside the component so it matches the "what it brings" heading above it, and so the component's band headings sit at `<h3>` under it.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- slug`
Expected: PASS.

- [ ] **Step 5: Verify the whole suite still passes**

Run: `npm run build && npm run lint && npm test`
Expected: all green. The build prerenders all ten project pages, so a bad slug lookup surfaces here.

- [ ] **Step 6: Commit**

```bash
git add src/components/pages/project.tsx "src/app/(en)/work/[slug]/page.test.tsx" "src/app/(cs)/cs/work/[slug]/page.test.tsx"
git commit -m "Show the technical design on every project page

Between what the project brings and the links out of it, in both trees.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01U8CPWFXXpbxaTgHy8mSYAT"
```

---

### Task 6: End-to-end coverage

**Files:**
- Modify: `e2e/portfolio.spec.ts`
- Modify: `e2e/localisation.spec.ts`

**Interfaces:**
- Consumes: everything above. Produces nothing.

- [ ] **Step 1: Write the failing tests**

Append to `e2e/portfolio.spec.ts`:

```ts
test("a project page shows its architecture and the decisions behind it", async ({ page }) => {
  await page.goto("/work/trader");
  const main = page.getByRole("main");

  await expect(
    main.getByRole("heading", { level: 2, name: "Technical design" }),
  ).toBeVisible();
  await expect(main.getByRole("heading", { level: 3, name: "Client" })).toBeVisible();
  await expect(main.getByText("SSE /api/market/stream")).toBeVisible();
  await expect(main.getByText("One FastAPI app, two deployments.")).toBeVisible();
});

// Work Planner has the densest diagram — four bands, eleven nodes and three
// gutter lanes — so it is where a layout that does not fit shows up first.
test("the densest diagram fits a phone without scrolling sideways", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/work/work-planner");
  await expect(
    page.getByRole("heading", { level: 2, name: "Technical design" }),
  ).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
```

Append to `e2e/localisation.spec.ts`:

```ts
test("the technical design section is translated", async ({ page }) => {
  await page.goto("/cs/work/games-db");
  const main = page.getByRole("main");

  await expect(
    main.getByRole("heading", { level: 2, name: getCopy("cs").architecture.heading }),
  ).toBeVisible();
  await expect(
    main.getByRole("heading", { level: 3, name: getCopy("cs").architecture.bands.external }),
  ).toBeVisible();
  await expect(
    main.getByText(getCopy("cs").projects["games-db"].design.decisions[0].choice),
  ).toBeVisible();
  // Protocols are facts and stay in English in both trees.
  await expect(main.getByText("Drizzle")).toBeVisible();
});
```

- [ ] **Step 2: Confirm the tests would have caught a missing section**

Task 5 is already committed, so these pass immediately — running them first
proves nothing on its own. Instead, verify they are load-bearing: comment out
the two lines Task 5 added to `src/components/pages/project.tsx`, run the specs,
confirm they fail, then restore the lines.

Run: `npm run test:e2e -- --grep "architecture|technical design|densest"`
Expected: FAIL with the section removed; restore it before continuing.

- [ ] **Step 3: Run the tests to verify they pass**

Run: `npm run test:e2e -- --grep "architecture|technical design|densest|translated"`
Expected: PASS. If the overflow test fails, narrow the gutter columns in `ArchitectureDiagram` (the `1.25rem` in `gridTemplateColumns`) rather than letting the page scroll sideways.

- [ ] **Step 4: Run the full end-to-end suite**

Run: `npm run test:e2e`
Expected: all green.

- [ ] **Step 5: Verify everything**

Run: `npm run build && npm run lint && npm test`
Expected: all green.

- [ ] **Step 6: Commit and push**

```bash
git add e2e/portfolio.spec.ts e2e/localisation.spec.ts
git commit -m "Cover the technical design section end to end

Both trees, plus an overflow guard at 375px against the densest diagram.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01U8CPWFXXpbxaTgHy8mSYAT"
git push -u origin feat/technical-design-section
```

- [ ] **Step 7: Open the pull request**

```bash
gh pr create --title "Add a technical design section to every project page" --body "$(cat <<'BODY'
Every project page now carries a **Technical design** section: an architecture
diagram of the project plus three design decisions with their reasons, in both
languages.

Facts — bands, node names, edge protocols — live in a new
`src/content/architecture.ts` keyed by `ProjectSlug`, so adding a project
without a diagram is a compile error. Prose — heading, band titles, node notes,
decisions — lives in the copy dictionaries, so adding one without Czech is too.
Every node, edge and decision was read out of the project's own repository.

The diagrams are markup, not image files: five projects across two themes would
be ten assets to regenerate whenever a stack changed, none of them selectable
or legible to a screen reader.

Spec: `docs/superpowers/specs/2026-09-03-technical-design-section-design.md`
Plan: `docs/superpowers/plans/2026-09-03-technical-design-section.md`

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01U8CPWFXXpbxaTgHy8mSYAT
BODY
)"
```

---

## Notes for the executor

**Where the compile errors are deliberate.** Task 2 and Task 3 widen the `Copy`
type before the dictionaries have the new keys. `cs.ts`'s `satisfies Copy`
check failing in between is the mechanism working, not a mistake — finish the
task's steps in order and it goes green.

**Do not add tokens.** Every colour this plan uses already exists in
`globals.css`. If something looks wrong in light mode, the fix is a different
existing token, not a new one and never a hex value.

**Do not run `npm run dev` to check the result** — `test:e2e` builds and runs
`next start` for exactly this reason, and a stray dev server makes that suite
fail depending on what else is open.
