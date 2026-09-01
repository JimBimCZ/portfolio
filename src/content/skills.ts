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
      {
        name: "Postgres",
        detail: "schema, indexing, migrations",
        evidence: ["games-db", "work-planner"],
      },
      {
        name: "Drizzle ORM",
        detail: "typed schema, generated migrations",
        evidence: ["games-db", "work-planner", "my-movies"],
      },
      {
        name: "Full-text search",
        detail: "pg_trgm trigram index",
        evidence: ["games-db"],
      },
      {
        name: "Data pipelines",
        detail: "backfill, retry with backoff, batched upserts",
        evidence: ["games-db"],
      },
    ],
  },
  {
    title: "Backend and integrations",
    skills: [
      {
        name: "FastAPI",
        detail: "typed routes, service layer",
        evidence: ["trader", "legal"],
      },
      {
        name: "Third-party APIs",
        detail: "Steam, TMDB, OpenRouter",
        evidence: ["games-db", "my-movies", "trader", "legal"],
      },
      {
        name: "Scheduled jobs",
        detail: "a monthly cron job, advisory-locked queues, durable partial progress",
        evidence: ["games-db"],
      },
      {
        name: "Auth",
        detail: "OAuth sign-in and sessions",
        evidence: ["games-db", "work-planner"],
      },
      {
        name: "Caching",
        detail: "tag-based revalidation with an on-demand purge endpoint",
        evidence: ["my-movies"],
      },
    ],
  },
  {
    title: "Frontend",
    skills: [
      {
        name: "React and Next.js",
        detail: "App Router, server components by default",
        evidence: ["trader", "games-db", "my-movies", "legal", "work-planner"],
      },
      {
        name: "Streaming UI",
        detail: "server-sent events, live price ticks",
        evidence: ["trader"],
      },
      {
        name: "Drag and drop",
        detail: "keyboard-operable, correct ARIA roles",
        evidence: ["work-planner"],
      },
      {
        name: "Design systems",
        detail: "Tailwind v4, semantic tokens, no dark: variants",
        evidence: ["games-db", "work-planner"],
      },
    ],
  },
  {
    title: "Delivery",
    skills: [
      {
        name: "Testing",
        detail: "unit, integration and Playwright end-to-end",
        evidence: ["trader", "games-db", "work-planner"],
      },
      {
        name: "Docker",
        detail: "multi-stage builds, one origin, no CORS layer",
        evidence: ["trader", "legal"],
      },
      {
        name: "CI/CD",
        detail: "typecheck, lint and both suites on every pull request",
        evidence: ["trader", "work-planner"],
      },
    ],
  },
];
