import { describe, expect, test } from "vitest";
import { getCopy } from "./copy";
import { LOCALES } from "./copy/types";
import { projects, type ProjectSlug } from "./projects";
import { BANDS, architecture } from "./architecture";
import {
  formatMetricValue,
  localiseArchitecture,
  localiseCarousel,
  localiseProject,
  localiseProjects,
  localiseSkills,
  type Metric,
} from "./localise";

const en = getCopy("en");
const cs = getCopy("cs");

describe("formatMetricValue", () => {
  test("groups a comma-separated integer with spaces outside English", () => {
    expect(formatMetricValue("245,025", "cs")).toBe("245 025");
    expect(formatMetricValue("14,621", "cs")).toBe("14 621");
  });

  test("leaves a plain integer without a separator untouched", () => {
    expect(formatMetricValue("846", "cs")).toBe("846");
  });

  test("leaves a non-numeric value untouched, comma or not", () => {
    expect(formatMetricValue("Postgres", "cs")).toBe("Postgres");
    expect(formatMetricValue("Drizzle + Neon", "cs")).toBe("Drizzle + Neon");
    expect(formatMetricValue("2/sec", "cs")).toBe("2/sec");
    expect(formatMetricValue("Tag-based", "cs")).toBe("Tag-based");
  });

  test("never changes English output, separator or not", () => {
    expect(formatMetricValue("245,025", "en")).toBe("245,025");
    expect(formatMetricValue("846", "en")).toBe("846");
    expect(formatMetricValue("Postgres", "en")).toBe("Postgres");
  });
});

describe("localiseProjects", () => {
  test("keeps the log's order and every project", () => {
    expect(localiseProjects(en).map((p) => p.slug)).toEqual(
      projects.map((p) => p.slug),
    );
  });

  test("pairs each metric value with the label from the dictionary", () => {
    for (const locale of LOCALES) {
      for (const project of localiseProjects(getCopy(locale))) {
        expect(project.metrics.length, `${locale} ${project.slug}`).toBeGreaterThanOrEqual(2);
        for (const metric of project.metrics) {
          expect(metric.value.length, `${locale} ${project.slug}`).toBeGreaterThan(0);
          expect(metric.label.length, `${locale} ${project.slug}`).toBeGreaterThan(0);
        }
      }
    }
  });

  // Length-checking the zip (below) catches a mismatched count, but says
  // nothing about pairing: values live in projects.ts, labels live in en.ts,
  // and nothing but this table ties a given value to its correct label. A
  // same-length transposition — two labels swapped within one project, or a
  // whole labels array swapped between two same-shaped projects — would
  // otherwise pass every other test in this file. Pin the full table, in
  // order, for every project, so either source file failing to match the
  // other fails loudly here instead of shipping a mislabelled number. This
  // duplicates the data on purpose — that duplication is what makes an
  // accidental edit visible. Values and labels below were read directly out
  // of projects.ts and copy/en.ts, not derived from either at test time.
  test("pins every value-to-label pair, in order, for every project", () => {
    const expected: Record<ProjectSlug, Metric[]> = {
      "secure-llm": [
        { value: "170", label: "tests, no test framework" },
        { value: "3", label: "retrieval arms, fused by rank" },
        { value: "4", label: "answering providers behind one seam" },
      ],
      trader: [
        { value: "2/sec", label: "price ticks streamed" },
        { value: "846", label: "tests across the stack" },
        { value: "Lévy", label: "closed-form price clock" },
      ],
      "games-db": [
        { value: "245,025", label: "appids indexed" },
        { value: "14,621", label: "hydrated with detail" },
        { value: "pg_trgm", label: "trigram search" },
      ],
      "my-movies": [
        { value: "9", label: "browse rows" },
        { value: "Tag-based", label: "cache revalidation" },
        { value: "Linkable", label: "search lives in the URL" },
      ],
      legal: [
        { value: "11", label: "Common Paper templates" },
        { value: "161", label: "tests across the stack" },
      ],
      "work-planner": [
        { value: "Postgres", label: "Drizzle + Neon" },
        { value: "291", label: "tests across the stack" },
      ],
    };

    const actual = Object.fromEntries(
      localiseProjects(en).map((project) => [project.slug, project.metrics]),
    );

    // toEqual on the whole table also folds in the count-per-project check,
    // so this and the length guard below can never disagree.
    expect(actual).toEqual(expected);
  });

  // Same idea as the English table above, but this one exists to pin the
  // *rendered* (post-formatting) value, not the raw one out of projects.ts —
  // that is the only way this file can catch a regression in
  // formatMetricValue itself, as opposed to a transposition between
  // projects.ts and the dictionaries. games-db is the project with values
  // that actually change shape in Czech ("245,025" -> "245 025"); the rest
  // are included to confirm plain integers and non-numeric values render
  // identically to their English counterparts.
  test("pins the Czech-rendered value for every project's metrics", () => {
    const expected: Record<ProjectSlug, Metric[]> = {
      "secure-llm": [
        { value: "170", label: "testů, bez testovacího frameworku" },
        { value: "3", label: "vyhledávací větve, spojené podle pořadí" },
        { value: "4", label: "poskytovatelé odpovědí za jedním rozhraním" },
      ],
      trader: [
        { value: "2/sec", label: "streamované ceny" },
        { value: "846", label: "testů napříč stackem" },
        { value: "Lévy", label: "ceny v uzavřeném tvaru" },
      ],
      "games-db": [
        { value: "245 025", label: "zaindexovaných appidů" },
        { value: "14 621", label: "s načteným detailem" },
        { value: "pg_trgm", label: "trigramové vyhledávání" },
      ],
      "my-movies": [
        { value: "9", label: "řad k procházení" },
        { value: "Tag-based", label: "invalidace cache" },
        { value: "Linkable", label: "vyhledávání žije v URL" },
      ],
      legal: [
        { value: "11", label: "šablon Common Paper" },
        { value: "161", label: "testů napříč stackem" },
      ],
      "work-planner": [
        { value: "Postgres", label: "Drizzle + Neon" },
        { value: "291", label: "testů napříč stackem" },
      ],
    };

    const actual = Object.fromEntries(
      localiseProjects(cs).map((project) => [project.slug, project.metrics]),
    );

    expect(actual).toEqual(expected);
  });

  test("throws when a project's labels and values are not the same length", () => {
    const broken = {
      ...en,
      projects: { ...en.projects, trader: { ...en.projects.trader, metricLabels: [] } },
    };
    expect(() => localiseProjects(broken)).toThrow(/trader/);
  });
});

describe("localiseProject", () => {
  test("returns undefined for a slug that does not exist", () => {
    expect(localiseProject("does-not-exist", en)).toBeUndefined();
  });
});

describe("localiseCarousel", () => {
  test("is the six carousel apps, work-planner first", () => {
    expect(localiseCarousel(en).map((p) => p.slug)).toEqual([
      "work-planner",
      "trader",
      "secure-llm",
      "my-movies",
      "games-db",
      "legal",
    ]);
  });
});

describe("localiseSkills", () => {
  test("every skill keeps its evidence and gains a name in each locale", () => {
    for (const locale of LOCALES) {
      for (const group of localiseSkills(getCopy(locale))) {
        expect(group.title.length, locale).toBeGreaterThan(0);
        for (const skill of group.skills) {
          expect(skill.name.length, `${locale} ${group.title}`).toBeGreaterThan(0);
          expect(skill.detail.length, `${locale} ${skill.name}`).toBeGreaterThan(0);
          expect(skill.evidence.length, `${locale} ${skill.name}`).toBeGreaterThan(0);
        }
      }
    }
  });

  // The length checks above pass even if a name or detail is attached to the
  // wrong id: skillStructure.ts holds ids, en.ts holds prose, and nothing but
  // this table ties a given id to its correct name and detail. Two details
  // swapped between same-shaped skills, or a skill matched against the wrong
  // group, would otherwise slip through. Pin the full English table, in
  // order, so a mismatch between the two source files fails loudly here.
  // Read directly out of skills.ts and copy/en.ts, not derived from either.
  test("pins every skill id to its name and detail, in order, per group", () => {
    const expected = [
      {
        title: "Databases and data",
        skills: [
          { name: "Postgres", detail: "schema, indexing, migrations" },
          { name: "Drizzle ORM", detail: "typed schema, generated migrations" },
          {
            name: "Full-text search",
            detail:
              "pg_trgm trigrams, and generated tsvector columns indexed twice — simple for identifiers, english for prose",
          },
          {
            name: "Background work",
            detail:
              "a monthly cron job, advisory-locked queues, backfill with retry and backoff, durable partial progress",
          },
        ],
      },
      {
        title: "AI and retrieval",
        skills: [
          {
            name: "Retrieval-augmented generation",
            detail:
              "three arms — vector, identifier and BM25 prose — combined by reciprocal rank fusion; nothing retrieved refuses the question instead of guessing at it",
          },
          {
            name: "Vector search",
            detail:
              "pgvector with an HNSW cosine index over 384-dimension embeddings computed in-process, so indexed text never leaves the container",
          },
          {
            name: "LLM integration",
            detail:
              "four answering providers behind one interface, with per-user and deployment-wide spend ceilings checked before a call can cost anything",
          },
          {
            name: "Prompt injection defence",
            detail:
              "retrieved text travels inside tags the application writes, tag-shaped spans are escaped rather than stripped, and citations are validated before the first word of prose streams",
          },
          {
            name: "PII anonymisation",
            detail:
              "names, e-mail addresses and phone numbers become placeholders before anything crosses a network boundary; the mapping back lives in the request and dies with it",
          },
        ],
      },
      {
        title: "Backend and integrations",
        skills: [
          { name: "FastAPI", detail: "typed routes, service layer" },
          {
            name: "Third-party APIs",
            detail:
              "Steam, TMDB, OpenRouter, with tag-based cache revalidation and an on-demand purge endpoint",
          },
          {
            name: "Auth",
            detail:
              "OAuth sign-in and sessions, and OIDC against a Keycloak realm with role claims read from the token",
          },
        ],
      },
      {
        title: "Frontend",
        skills: [
          {
            name: "React and Next.js",
            detail: "App Router, server components by default",
          },
          {
            name: "Streaming UI",
            detail: "server-sent events for live price ticks, NDJSON for token-by-token answers",
          },
          {
            name: "Accessible interaction",
            detail:
              "drag and drop that is keyboard-operable, with the ARIA roles the pattern actually calls for",
          },
          {
            name: "Design systems",
            detail: "Tailwind v4, semantic tokens, no dark: variants",
          },
        ],
      },
      {
        title: "Delivery",
        skills: [
          {
            name: "Testing",
            detail:
              "unit, integration and Playwright end-to-end — and 170 tests on the Node runner alone, with no test framework installed",
          },
          {
            name: "Docker",
            detail:
              "multi-stage builds, one origin, no CORS layer; a compose file that brings up the app, its database and an identity provider together",
          },
          {
            name: "CI/CD",
            detail: "typecheck, lint and both suites on every pull request",
          },
        ],
      },
    ];

    const actual = localiseSkills(en).map((group) => ({
      title: group.title,
      skills: group.skills.map((skill) => ({ name: skill.name, detail: skill.detail })),
    }));

    expect(actual).toEqual(expected);
  });
});

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

describe("localiseArchitecture pipelines", () => {
  const withDesign = (slug: "secure-llm", design: Record<string, unknown>) => ({
    ...en,
    projects: {
      ...en.projects,
      [slug]: { ...en.projects[slug], design: { ...en.projects[slug].design, ...design } },
    },
  });

  test("pairs each step with its prose, in the order the request runs", () => {
    const { pipeline } = localiseArchitecture("secure-llm", en);

    expect(pipeline?.title).toBe("How a question becomes an answer");
    expect(pipeline?.steps.map((step) => step.id)).toEqual(
      architecture["secure-llm"].pipeline?.map((step) => step.id),
    );
    expect(pipeline?.steps[0].name).toBe("app/api/ask/route.ts");
    expect(pipeline?.steps[0].detail).toBe(en.projects["secure-llm"].design.steps?.route);
  });

  test("reads the steps in the reader's language", () => {
    const { pipeline } = localiseArchitecture("secure-llm", cs);

    expect(pipeline?.title).toBe("Jak se z otázky stane odpověď");
    // The module path is a fact and identical in both trees; only the prose
    // beside it changes.
    expect(pipeline?.steps[0].name).toBe("app/api/ask/route.ts");
    expect(pipeline?.steps[0].detail).toBe(cs.projects["secure-llm"].design.steps?.route);
  });

  test("marks exactly the steps the request can stop at", () => {
    const { pipeline } = localiseArchitecture("secure-llm", en);
    const guards = pipeline?.steps.filter((step) => step.guard).map((step) => step.id);

    // Retrieval finding nothing, and no citation surviving the guard. Both
    // end in the same refusal, and nothing else may claim to.
    expect(guards).toEqual(["fuse", "citations"]);
  });

  test("is absent for a project that declares no pipeline", () => {
    expect(localiseArchitecture("trader", en).pipeline).toBeUndefined();
  });

  // The three ways the data and the dictionary can drift apart. A step with
  // no prose is a bare module path on the page, which says nothing.
  test("throws when a step has no prose", () => {
    const steps = Object.fromEntries(
      Object.entries(en.projects["secure-llm"].design.steps!).filter(([id]) => id !== "route"),
    );
    const copy = withDesign("secure-llm", { steps });
    expect(() => localiseArchitecture("secure-llm", copy)).toThrow(/route/);
  });

  test("throws when prose names a step the pipeline does not have", () => {
    const copy = withDesign("secure-llm", {
      steps: { ...en.projects["secure-llm"].design.steps, "no-such-step": "orphaned" },
    });
    expect(() => localiseArchitecture("secure-llm", copy)).toThrow(/no-such-step/);
  });

  test("throws when a pipeline has no title", () => {
    const copy = withDesign("secure-llm", { pipelineTitle: undefined });
    expect(() => localiseArchitecture("secure-llm", copy)).toThrow(/pipelineTitle/);
  });
});
