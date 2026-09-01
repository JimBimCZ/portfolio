import type { ProjectSlug } from "./projects";

/**
 * Skills, each carrying the shipped projects that prove it. `evidence` is typed
 * against the project list, so citing a project that does not exist is a compile
 * error rather than a broken link a visitor finds first.
 *
 * Every mapping below was verified against the repository, not the README. The
 * READMEs are stale: work-planner's still describes a scaffold with no auth,
 * boards or cards, and my_movies' says schema.ts is empty.
 *
 * Names and details are prose and live in the copy dictionary
 * (`src/content/copy/en.ts`), keyed by these ids. `src/content/localise.ts`
 * merges the two back into the shape `SkillMatrix` renders.
 */
export type SkillId = string;

export const skillStructure = [
  {
    id: "databases-and-data",
    skills: [
      { id: "postgres", evidence: ["games-db", "work-planner"] },
      { id: "drizzle", evidence: ["games-db", "work-planner", "my-movies"] },
      { id: "full-text-search", evidence: ["games-db"] },
      { id: "data-pipelines", evidence: ["games-db"] },
    ],
  },
  {
    id: "backend-and-integrations",
    skills: [
      { id: "fastapi", evidence: ["trader", "legal"] },
      { id: "third-party-apis", evidence: ["games-db", "my-movies", "trader", "legal"] },
      { id: "scheduled-jobs", evidence: ["games-db"] },
      { id: "auth", evidence: ["games-db", "work-planner"] },
      { id: "caching", evidence: ["my-movies"] },
    ],
  },
  {
    id: "frontend",
    skills: [
      {
        id: "react-and-nextjs",
        evidence: ["trader", "games-db", "my-movies", "legal", "work-planner"],
      },
      { id: "streaming-ui", evidence: ["trader"] },
      { id: "drag-and-drop", evidence: ["work-planner"] },
      { id: "design-systems", evidence: ["games-db", "work-planner"] },
    ],
  },
  {
    id: "delivery",
    skills: [
      { id: "testing", evidence: ["trader", "games-db", "work-planner"] },
      { id: "docker", evidence: ["trader", "legal"] },
      { id: "ci-cd", evidence: ["trader", "work-planner"] },
    ],
  },
] satisfies { id: string; skills: { id: SkillId; evidence: ProjectSlug[] }[] }[];
