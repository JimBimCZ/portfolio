import { describe, expect, test } from "vitest";
import { getCopy } from "./copy";
import { LOCALES } from "./copy/types";
import { projects, type ProjectSlug } from "./projects";
import {
  localiseCarousel,
  localiseProject,
  localiseProjects,
  localiseSkills,
  type Metric,
} from "./localise";

const en = getCopy("en");

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
  test("is the five deployed apps, trader first", () => {
    expect(localiseCarousel(en).map((p) => p.slug)).toEqual([
      "trader",
      "games-db",
      "my-movies",
      "legal",
      "work-planner",
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
          { name: "Full-text search", detail: "pg_trgm trigram index" },
          {
            name: "Data pipelines",
            detail: "backfill, retry with backoff, batched upserts",
          },
        ],
      },
      {
        title: "Backend and integrations",
        skills: [
          { name: "FastAPI", detail: "typed routes, service layer" },
          { name: "Third-party APIs", detail: "Steam, TMDB, OpenRouter" },
          {
            name: "Scheduled jobs",
            detail: "a monthly cron job, advisory-locked queues, durable partial progress",
          },
          { name: "Auth", detail: "OAuth sign-in and sessions" },
          {
            name: "Caching",
            detail: "tag-based revalidation with an on-demand purge endpoint",
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
          { name: "Streaming UI", detail: "server-sent events, live price ticks" },
          { name: "Drag and drop", detail: "keyboard-operable, correct ARIA roles" },
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
            detail: "unit, integration and Playwright end-to-end",
          },
          {
            name: "Docker",
            detail: "multi-stage builds, one origin, no CORS layer",
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
