import type { Copy } from "./types";

export const en = {
  ui: {
    nav: { work: "Work", about: "About", contact: "Contact" },
    privacy: "Privacy",
    languageSwitch: { label: "Language", en: "English", cs: "Čeština" },
    carousel: {
      region: "Deployed applications",
      tablist: "Choose an application",
      previous: "Previous app",
      next: "Next app",
      openLiveApp: "Open live app →",
      signInRequired: "Sign-in required",
    },
    status: {
      live: "Live",
      "in-development": "In development",
      archived: "Archived",
    },
  },
} satisfies Copy;
