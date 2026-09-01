import type { ProjectSlug } from "../projects";

export const LOCALES = ["en", "cs"] as const;
export type Locale = (typeof LOCALES)[number];

/** Chrome: strings that belong to the shell rather than to one page. */
export type UiCopy = {
  nav: { work: string; about: string; contact: string };
  /** Accessible name of the header's <nav> landmark. */
  navLabel: string;
  privacy: string;
  languageSwitch: { label: string; en: string; cs: string };
  carousel: {
    region: string;
    tablist: string;
    previous: string;
    next: string;
    openLiveApp: string;
    signInRequired: string;
  };
  status: Record<"live" | "in-development" | "archived", string>;
};

export type Pair = readonly [string, string];

export type JobCopy = {
  /** Employer and period are facts, not prose — they are identical in every locale. */
  org: string;
  period: string;
  title: string;
  note: string;
};

export type PersonCopy = {
  role: string;
  location: string;
  tagline: string;
  intro: string;
  status: string;
  ogImageAlt: string;
  manifest: readonly Pair[];
  bio: readonly string[];
  experience: readonly JobCopy[];
  toolkit: readonly Pair[];
  privacy: {
    updated: string;
    summary: readonly Pair[];
    sections: readonly { heading: string; body: string }[];
  };
};

/** Headings, button labels and other page-level chrome, per route. */
export type PagesCopy = {
  home: {
    viewWork: string;
    getInTouch: string;
    whatEachOneIs: string;
    allProjects: string;
    trackRecord: string;
    fullHistory: string;
    skills: string;
    contact: string;
  };
  work: { title: string; lede: string; more: string; liveDemo: string; repo: string; shipped: string };
  project: { back: string; role: string; stack: string; whatItBrings: string; visitSite: string; source: string };
  about: { title: string; experience: string; toolkit: string };
  contact: { title: string; body: string; phone: string; based: string };
  privacy: { title: string; lede: string; responsible: string; contact: string; updated: string };
  notFound: { code: string; title: string; back: string };
};

/** Per-route `<title>` and `<meta name="description">`, plus the shared og text. */
export type MetaCopy = {
  titleTemplate: string;
  home: { title: string; description: string };
  work: { title: string; description: string };
  about: { title: string; description: string };
  contact: { title: string; description: string };
  privacy: { title: string; description: string };
};

/** Prose that differs per project. Paired by index with the values in
 *  `projects.ts`'s `metrics` — `localiseProjects` throws on a mismatch. */
export type ProjectCopy = {
  summary: string;
  role: string;
  highlights: readonly string[];
  /** Parallel to the project's `metrics` values; `localiseProjects` throws on a mismatch. */
  metricLabels: readonly string[];
  posterAlt?: string;
  liveNote?: string;
};

export type SkillCopy = { name: string; detail: string };
export type SkillGroupCopy = { title: string; skills: Record<string, SkillCopy> };

export type Copy = {
  locale: Locale;
  ui: UiCopy;
  person: PersonCopy;
  pages: PagesCopy;
  meta: MetaCopy;
  projects: Record<ProjectSlug, ProjectCopy>;
  skills: Record<string, SkillGroupCopy>;
};
