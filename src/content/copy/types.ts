export const LOCALES = ["en", "cs"] as const;
export type Locale = (typeof LOCALES)[number];

/** Chrome: strings that belong to the shell rather than to one page. */
export type UiCopy = {
  nav: { work: string; about: string; contact: string };
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

export type Copy = {
  ui: UiCopy;
};
