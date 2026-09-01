/**
 * Single source of truth for everything about the person behind the site.
 * Edit this first — pages read from it rather than hardcoding copy.
 */
export const site = {
  name: "Vit Busek",
  role: "Frontend & AI engineer",
  location: "Brno, CZ",
  tagline: "I build robust software, and AI tooling is why it ships in days.",
  intro:
    "Typed, tested, reviewed code — built through an AI-assisted workflow that turns the iteration cycle software usually measures in weeks into hours or days.",
  email: "busek.vit@gmail.com",
  phone: "+420 608 961 227",
  url: "https://www.vitbusek.dev",
  /** Social card, 1200x630. Built from the lead app's poster by `node scripts/capture/og.mjs`. */
  ogImage: "/og.jpg",
  ogImageAlt:
    "The Trader terminal: a watchlist of streaming prices, an open AAPL position and the assistant panel.",
  status: "Open to new work",
  /** Rendered as the spec block on the home and about pages. Keys stay short. */
  manifest: [
    ["role", "Frontend & AI engineer"],
    ["focus", "LLM features with typed, testable output"],
    ["stack", "TypeScript, Next.js, React, FastAPI"],
    ["based", "Brno, CZ — CET"],
    ["status", "Open to new work"],
  ] satisfies [string, string][],
  /** The about page reads these as paragraphs, in order. */
  bio: [
    "Senior frontend developer, by way of live sound and lighting engineering in the UK music industry. It is an unconventional route into the job, and it left me with two habits worth keeping: technical precision, and the communication that comes from working in a crew where everything has to be right before the doors open.",
    "The day work is React and TypeScript at a senior level — features built and maintained in codebases other people have to live with, state handled with Redux and React Context, and production issues traced through CloudWatch logs and SQL rather than guessed at.",
    "The other half is agentic AI engineering: LLM-native workflows, custom MCP servers, and multi-agent systems tuned to stay reliable and cheap enough to actually run. I am at my best working closely with other people, shipping solutions that meet the client's need on the date agreed.",
  ],
  /** Newest first. The about page renders this as a log. */
  experience: [
    {
      role: "Frontend Developer",
      org: "Three Pillar Global",
      period: "10/2025 – 05/2026",
      note: "Senior backfill covering an extended leave. Built and maintained features in a React/TypeScript codebase with Redux and React Context, investigated production issues through AWS CloudWatch and dBeaver, and used agentic coding tools to speed up delivery, refactoring, and debugging inside an established codebase.",
    },
    {
      role: "Team Leader / Frontend Developer",
      org: "Notino",
      period: "03/2023 – 09/2025",
      note: "Led a frontend team with a dual mandate: people management and technical delivery. Worked closely with the product owner on on-time delivery, and drove frontend strategy across the cluster — clearing tech debt and putting the right people on the right tasks.",
    },
    {
      role: "Frontend Developer",
      org: "Kinalisoft",
      period: "09/2020 – 02/2023",
      note: "Sole frontend developer for the full FE of a machine monitoring platform built for Mycronic. Delivered MyCenterAnalysis, which won an award at the Productronica exhibition.",
    },
    {
      role: "Frontend Developer",
      org: "Axon Garside, Manchester UK",
      period: "01/2019 – 03/2020",
      note: "Worked alongside an in-house full-stack developer on polished frontend work, building single-page applications primarily with React, plus vanilla JavaScript, HTML5, and CSS3.",
    },
  ],
  /** Grouped for the about page. Keys stay short, same as the manifest. */
  skills: [
    [
      "frontend",
      "TypeScript, React 16–19, Next.js, Redux, React Context, Tailwind CSS, Material UI, Node.js / Express",
    ],
    [
      "agentic ai",
      "Agentic coding, MCP server design, multi-agent orchestration, agent cost optimisation, LLM evals, prompt engineering",
    ],
    ["testing", "Jest, React Testing Library, AWS CloudWatch, SQL / dBeaver, Git"],
    ["languages", "Czech — native, English — fluent"],
  ] satisfies [string, string][],
  links: [{ label: "GitHub", href: "https://github.com/JimBimCZ" }],
  nav: [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  /**
   * The privacy notice. Content lives here like everything else, so the page
   * holds no copy of its own. `updated` is an ISO year-month, same as
   * `shipped` on a project. Change it whenever a row or section below changes.
   */
  privacy: {
    updated: "2026-09",
    summary: [
      ["cookies", "None set, none read"],
      ["analytics", "None, no tracking script of any kind"],
      ["fonts", "Self-hosted, so no request reaches Google"],
      ["forms", "None, contact is a mailto link"],
    ] satisfies [string, string][],
    sections: [
      {
        heading: "Why there is no cookie banner",
        body:
          "Consent is required for storing or reading information on your device. This site does neither: no cookies, no local storage, no third-party embeds, no analytics. There is nothing to ask you to accept. The two typefaces are downloaded when the site is built and served from this domain, so opening a page here tells Google nothing.",
      },
      {
        heading: "What the server records",
        body:
          "The site is hosted on Vercel, which logs each request the way any web server does: IP address, the page asked for, a timestamp and a browser string. Vercel holds those logs as my processor, under its own retention policy, and they exist to serve pages and keep the platform running. I do not export them, combine them with anything, or use them to work out who you are.",
      },
      {
        heading: "If you write to me",
        body:
          "Then I hold what you chose to send, in my mailbox, for as long as the conversation is useful — for a role or a project, usually the length of it and a reasonable while after. There is no mailing list to be added to.",
      },
      {
        heading: "Your rights",
        body:
          "You can ask what I hold about you, ask for it corrected or deleted, and object to my holding it at all. Write to the address above and I will answer. If my answer does not satisfy you, you can complain to the Czech data protection authority, the Úřad pro ochranu osobních údajů, at uoou.gov.cz.",
      },
    ],
  },
};
