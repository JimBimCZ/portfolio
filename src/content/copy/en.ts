import type { Copy } from "./types";

export const en = {
  ui: {
    nav: { work: "Work", about: "About", contact: "Contact" },
    navLabel: "Main",
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
  person: {
    role: "Frontend & AI engineer",
    location: "Brno, CZ",
    tagline: "I build robust software, and AI tooling is why it ships in days.",
    intro:
      "Typed, tested, reviewed code — built through an AI-assisted workflow that turns the iteration cycle software usually measures in weeks into hours or days.",
    status: "Open to new work",
    ogImageAlt:
      "The Trader terminal: a watchlist of streaming prices, an open AAPL position and the assistant panel.",
    /** Rendered as the spec block on the home and about pages. Keys stay short. */
    manifest: [
      ["role", "Frontend & AI engineer"],
      ["focus", "LLM features with typed, testable output"],
      ["stack", "TypeScript, Next.js, React, FastAPI"],
      ["based", "Brno, CZ — CET"],
      ["status", "Open to new work"],
    ],
    /** The about page reads these as paragraphs, in order. */
    bio: [
      "Senior frontend developer, by way of live sound and lighting engineering in the UK music industry. It is an unconventional route into the job, and it left me with two habits worth keeping: technical precision, and the communication that comes from working in a crew where everything has to be right before the doors open.",
      "The day work is React and TypeScript at a senior level — features built and maintained in codebases other people have to live with, state handled with Redux and React Context, and production issues traced through CloudWatch logs and SQL rather than guessed at.",
      "The other half is agentic AI engineering: LLM-native workflows, custom MCP servers, and multi-agent systems tuned to stay reliable and cheap enough to actually run. I am at my best working closely with other people, shipping solutions that meet the client's need on the date agreed.",
    ],
    /** Newest first. The about page renders this as a log. */
    experience: [
      {
        title: "Frontend Developer",
        org: "Three Pillar Global",
        period: "10/2025 – 05/2026",
        note: "Senior backfill covering an extended leave. Built and maintained features in a React/TypeScript codebase with Redux and React Context, investigated production issues through AWS CloudWatch and dBeaver, and used agentic coding tools to speed up delivery, refactoring, and debugging inside an established codebase.",
      },
      {
        title: "Team Leader / Frontend Developer",
        org: "Notino",
        period: "03/2023 – 09/2025",
        note: "Led a frontend team with a dual mandate: people management and technical delivery. Worked closely with the product owner on on-time delivery, and drove frontend strategy across the cluster — clearing tech debt and putting the right people on the right tasks.",
      },
      {
        title: "Frontend Developer",
        org: "Kinalisoft",
        period: "09/2020 – 02/2023",
        note: "Sole frontend developer for the full FE of a machine monitoring platform built for Mycronic. Delivered MyCenterAnalysis, which won an award at the Productronica exhibition.",
      },
      {
        title: "Frontend Developer",
        org: "Axon Garside, Manchester UK",
        period: "01/2019 – 03/2020",
        note: "Worked alongside an in-house full-stack developer on polished frontend work, building single-page applications primarily with React, plus vanilla JavaScript, HTML5, and CSS3.",
      },
    ],
    /** Grouped for the about page. Keys stay short, same as the manifest. */
    toolkit: [
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
      ],
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
  },
  pages: {
    home: {
      viewWork: "View work",
      getInTouch: "Get in touch",
      whatEachOneIs: "What each one actually is",
      allProjects: "All projects →",
      trackRecord: "Track record",
      fullHistory: "Full history →",
      skills: "Skills, with receipts",
      contact: "Contact",
    },
    work: {
      title: "Here’s my latest work",
      lede: "Newest first. Each entry lists what shipped, when, and what it changed.",
      more: "More in progress",
      liveDemo: "Live demo",
      repo: "GitHub",
      shipped: "Shipped",
    },
    project: {
      back: "← Work",
      role: "Role",
      stack: "Stack",
      whatItBrings: "What it brings",
      visitSite: "Visit site",
      source: "Source",
    },
    about: {
      title: "About",
      experience: "Experience",
      toolkit: "Toolkit",
    },
    contact: {
      title: "Email is the fastest way to reach me.",
      body: "Tell me what you are building and what is in the way. I read everything and reply within a couple of days.",
      phone: "phone",
      based: "based",
    },
    privacy: {
      title: "Privacy",
      lede: "This is a portfolio, not a product. It collects nothing about you, and the short version fits in a box.",
      responsible: "Responsible",
      contact: "Contact",
      updated: "Last updated",
    },
    notFound: {
      code: "404",
      title: "That page does not exist.",
      back: "← Back home",
    },
  },
  meta: {
    titleTemplate: "%s — Vit Busek",
    home: {
      title: "Vit Busek — Frontend & AI engineer",
      description:
        "Typed, tested, reviewed code — built through an AI-assisted workflow that turns the iteration cycle software usually measures in weeks into hours or days.",
    },
    work: {
      title: "Work",
      description: "Projects, newest first, with what shipped and what it changed.",
    },
    about: {
      title: "About",
      description:
        "Senior frontend developer, by way of live sound and lighting engineering in the UK music industry. It is an unconventional route into the job, and it left me with two habits worth keeping: technical precision, and the communication that comes from working in a crew where everything has to be right before the doors open.",
    },
    contact: {
      title: "Contact",
      description: "Get in touch with Vit Busek.",
    },
    privacy: {
      title: "Privacy",
      description:
        "What this site records, which is almost nothing: no cookies, no analytics, no tracking scripts.",
    },
  },
  projects: {
    trader: {
      summary:
        "A trading terminal with imaginary money: prices stream in twice a second, and an assistant that can read your portfolio and place the trades for you.",
      role: "Solo build — frontend, backend, infrastructure",
      highlights: [
        "The assistant executes trades through the same API the UI uses, and shows each fill inline as it happens. The live demo answers from its scripted client rather than the model, so leaving it up costs nothing.",
        "One codebase, two deployment shapes. Serverless has no background task and no disk, so prices become a closed-form function of the clock — Brownian motion by Lévy construction, 22 steps down a hashed tree rather than 172,800 summed half-second increments — and Postgres sits behind the same interface as SQLite. Routes, services and the frontend are untouched.",
        "Market data comes from a geometric Brownian motion simulator by default — per-ticker volatility, correlated sector moves, no API key. Real quotes are opt-in, and there is deliberately no silent fallback between them.",
        "846 tests across the stack: 591 on the backend, 228 on the frontend, plus 27 Playwright specs run against the built container.",
      ],
      metricLabels: ["price ticks streamed", "tests across the stack", "closed-form price clock"],
      posterAlt:
        "The Trader terminal after a five-share AAPL buy: a ten-ticker watchlist on the left, an AAPL price chart above the open position and a session P&L chart in the centre, and the assistant's prompt suggestions on the right.",
      liveNote:
        "The demo runs the serverless build with no database attached, so the portfolio starts at $10,000 and resets whenever the instance is recycled.",
    },
    "games-db": {
      summary:
        "A personal PC games catalogue that indexes Steam's entire storefront into Postgres, so browsing, filtering, and search never touch Steam's own rate-limited API.",
      role: "Solo build — frontend, backend, infrastructure",
      highlights: [
        "Its own index of Steam's catalogue — 245,025 appids, 14,621 hydrated with full detail — because Steam has no /discover or /trending endpoint to browse against.",
        "Search runs on a Postgres trigram index (pg_trgm), not on Steam.",
        "One scheduled job — a monthly GitHub Actions cron refreshes prices — plus three CLI jobs (catalogue sync, list sync, hydration) run by hand. Hydration, price refresh, and list sync each take a Postgres advisory lock so two copies can't run at once; catalogue sync does not need one.",
        "GitHub OAuth sign-in for a personal library; browsing and search work for anyone, signed in or not.",
      ],
      metricLabels: ["appids indexed", "hydrated with detail", "trigram search"],
      posterAlt:
        "Games DB's home page: a featured game banner above a Top Sellers grid of game cover art, prices, and discount badges.",
    },
    "my-movies": {
      summary:
        "A personal streaming catalogue pulling from TMDB, presented as a Netflix-style browsing UI with linkable search and a watchlist behind sign-in.",
      role: "Solo build — frontend, backend, infrastructure",
      highlights: [
        "Nine browse rows on the home page — trending, now playing, upcoming, top rated, airing today, and four genre rows — each streamed in with Suspense.",
        "Search is URL-driven: the query lives in the URL, so results are linkable and the back button works.",
        "An on-demand /api/revalidate endpoint purges TMDB response caches by tag rather than waiting out a TTL.",
        "GitHub and Google OAuth sign-in for a personal watchlist; every browse, detail, and search route works without an account.",
      ],
      metricLabels: ["browse rows", "cache revalidation", "search lives in the URL"],
      posterAlt:
        "My Movies' home page: a full-bleed hero for a trending title with its synopsis and a More Info button, above a Trending This Week row of poster thumbnails.",
    },
    legal: {
      summary:
        "Draft a legal agreement by chatting. Pick one of 11 Common Paper templates, answer in plain language, and watch the document fill in live.",
      role: "Solo build — frontend, backend, infrastructure",
      highlights: [
        "The model replies against a Pydantic schema generated from each template's own fields, so a turn can only come back as valid, typed values.",
        "A turn is saved only after the model call succeeds — a failed request leaves nothing behind and is safe to retry.",
        "161 tests across the stack: 86 on the backend, 75 on the frontend.",
        "One container, one origin. A multi-stage build compiles the Next.js export and FastAPI serves it, so there is no CORS layer to configure.",
      ],
      metricLabels: ["Common Paper templates", "tests across the stack"],
      posterAlt:
        "A completed Mutual NDA in Legal Document Creator: every field filled and ready to download, with the chat panel showing the details that produced it.",
    },
    "work-planner": {
      summary:
        "A collaborative kanban board, JIRA-board style: multiple boards per user, keyboard-operable drag and drop, due dates, and OAuth-only sign-in.",
      role: "Solo build — frontend, backend, infrastructure",
      highlights: [
        "Boards, columns and cards backed by a real Postgres schema — well past the health-route scaffold the README still describes.",
        "Keyboard-operable drag and drop between columns, built on dnd-kit.",
        "OAuth-only sign-in (Google and GitHub) gates every board; there is no guest or demo account.",
        "291 tests across the stack: 211 unit and component, 80 Playwright end-to-end.",
      ],
      metricLabels: ["Drizzle + Neon", "tests across the stack"],
      posterAlt:
        "Work Planner's sign-in screen: the app name above Continue with Google and Continue with GitHub buttons, with no guest or demo account available.",
    },
  },
  skills: {
    "databases-and-data": {
      title: "Databases and data",
      skills: {
        postgres: { name: "Postgres", detail: "schema, indexing, migrations" },
        drizzle: { name: "Drizzle ORM", detail: "typed schema, generated migrations" },
        "full-text-search": { name: "Full-text search", detail: "pg_trgm trigram index" },
        "data-pipelines": {
          name: "Data pipelines",
          detail: "backfill, retry with backoff, batched upserts",
        },
      },
    },
    "backend-and-integrations": {
      title: "Backend and integrations",
      skills: {
        fastapi: { name: "FastAPI", detail: "typed routes, service layer" },
        "third-party-apis": {
          name: "Third-party APIs",
          detail: "Steam, TMDB, OpenRouter",
        },
        "scheduled-jobs": {
          name: "Scheduled jobs",
          detail: "a monthly cron job, advisory-locked queues, durable partial progress",
        },
        auth: { name: "Auth", detail: "OAuth sign-in and sessions" },
        caching: {
          name: "Caching",
          detail: "tag-based revalidation with an on-demand purge endpoint",
        },
      },
    },
    frontend: {
      title: "Frontend",
      skills: {
        "react-and-nextjs": {
          name: "React and Next.js",
          detail: "App Router, server components by default",
        },
        "streaming-ui": {
          name: "Streaming UI",
          detail: "server-sent events, live price ticks",
        },
        "drag-and-drop": {
          name: "Drag and drop",
          detail: "keyboard-operable, correct ARIA roles",
        },
        "design-systems": {
          name: "Design systems",
          detail: "Tailwind v4, semantic tokens, no dark: variants",
        },
      },
    },
    delivery: {
      title: "Delivery",
      skills: {
        testing: {
          name: "Testing",
          detail: "unit, integration and Playwright end-to-end",
        },
        docker: {
          name: "Docker",
          detail: "multi-stage builds, one origin, no CORS layer",
        },
        "ci-cd": {
          name: "CI/CD",
          detail: "typecheck, lint and both suites on every pull request",
        },
      },
    },
  },
} satisfies Copy;
