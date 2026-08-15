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
  /** Path under /public. Screenshots are 1440x900, captured from the running app. */
  image?: string;
  imageAlt?: string;
};

export const projects: Project[] = [
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
