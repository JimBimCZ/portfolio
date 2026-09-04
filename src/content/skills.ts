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
 * A row earns its place by citing work a reader can open. Where two rows cited
 * the same single project for the same machinery they were merged rather than
 * kept apart for the look of a longer list.
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
      { id: "postgres", evidence: ["secure-llm", "games-db", "work-planner"] },
      { id: "drizzle", evidence: ["secure-llm", "games-db", "work-planner", "my-movies"] },
      { id: "full-text-search", evidence: ["secure-llm", "games-db"] },
      // Was two rows, "scheduled-jobs" and "data-pipelines", both citing only
      // games-db and both describing the same batch machinery.
      { id: "background-work", evidence: ["games-db"] },
    ],
  },
  {
    id: "ai-and-retrieval",
    skills: [
      { id: "rag", evidence: ["secure-llm"] },
      { id: "vector-search", evidence: ["secure-llm"] },
      { id: "llm-integration", evidence: ["secure-llm", "trader"] },
      { id: "prompt-security", evidence: ["secure-llm"] },
      { id: "pii-anonymisation", evidence: ["secure-llm"] },
    ],
  },
  {
    id: "backend-and-integrations",
    skills: [
      { id: "fastapi", evidence: ["trader", "legal"] },
      { id: "third-party-apis", evidence: ["games-db", "my-movies", "trader", "legal"] },
      { id: "auth", evidence: ["secure-llm", "games-db", "work-planner"] },
    ],
  },
  {
    id: "frontend",
    skills: [
      {
        id: "react-and-nextjs",
        evidence: ["secure-llm", "trader", "games-db", "my-movies", "legal", "work-planner"],
      },
      { id: "streaming-ui", evidence: ["secure-llm", "trader"] },
      // Was "drag-and-drop", whose detail was already the accessibility claim.
      { id: "accessible-interaction", evidence: ["work-planner"] },
      { id: "design-systems", evidence: ["games-db", "work-planner"] },
    ],
  },
  {
    id: "delivery",
    skills: [
      { id: "testing", evidence: ["secure-llm", "trader", "games-db", "work-planner"] },
      { id: "docker", evidence: ["secure-llm", "trader", "legal"] },
      { id: "ci-cd", evidence: ["trader", "work-planner"] },
    ],
  },
] satisfies { id: string; skills: { id: SkillId; evidence: ProjectSlug[] }[] }[];
