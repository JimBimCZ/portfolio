import type { Copy } from "./types";

export const en = {
  locale: "en",
  ui: {
    nav: {
      work: "Work",
      skills: "Skills",
      experience: "Experience",
      about: "About",
      contact: "Contact",
    },
    navLabel: "Main",
    privacy: "Privacy",
    languageSwitch: { label: "Language", en: "English", cs: "Čeština" },
    carousel: {
      region: "Deployed applications",
      tablist: "Choose an application",
      previous: "Previous app",
      next: "Next app",
      openLiveApp: "Open live app →",
      openSource: "Source on GitHub →",
      signInRequired: "Sign-in required",
    },
    status: {
      live: "Live",
      "in-development": "In development",
      "self-hosted": "Self-hosted",
      archived: "Archived",
    },
  },
  person: {
    role: "Full-stack & AI engineer",
    location: "Brno, CZ",
    locationWithTimezone: "Brno, CZ — CET",
    tagline: "I build robust software, and AI tooling is why it ships in days.",
    intro:
      "Typed, tested, reviewed code — built through an AI-assisted workflow that turns the iteration cycle software usually measures in weeks into hours or days.",
    status: "Open to new work",
    ogImageAlt:
      "The Trader terminal: a watchlist of streaming prices, an open AAPL position and the assistant panel.",
    /** Rendered as the spec block on the home and about pages. Keys stay short. */
    manifest: [
      ["role", "Full-stack & AI engineer"],
      ["depth", "Senior on the frontend, backend to production"],
      ["focus", "LLM features with typed, testable output"],
      ["stack", "TypeScript, Next.js, React, FastAPI, Postgres"],
      ["based", "Brno, CZ — CET"],
      ["status", "Open to new work"],
    ],
    /** The about page reads these as paragraphs, in order. */
    bio: [
      "Full-stack engineer, senior on the frontend, by way of live sound and lighting engineering in the UK music industry. It is an unconventional route into the job, and it left me with two habits worth keeping: technical precision, and the communication that comes from working in a crew where everything has to be right before the doors open.",
      "The day work is React and TypeScript at a senior level — features built and maintained in codebases other people have to live with, state handled with Redux and React Context, and production issues traced through CloudWatch logs and SQL rather than guessed at.",
      "The applications in the work log are solo builds, end to end — Postgres schemas and migrations behind Drizzle, FastAPI services, OAuth sign-in and sessions, scheduled jobs, and the Docker images and CI that ship them. The frontend depth comes from the day job; the rest of the stack comes from building and running these.",
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
        "TypeScript, React 16–19, Next.js, Redux, React Context, Tailwind CSS, Material UI",
      ],
      [
        "backend",
        "Node.js / Express, FastAPI, REST and SSE, OAuth sessions, scheduled jobs",
      ],
      [
        "data",
        "Postgres, SQLite, Drizzle ORM, schema design and migrations, pg_trgm full-text search",
      ],
      [
        "agentic ai",
        "Agentic coding, MCP server design, multi-agent orchestration, agent cost optimisation, LLM evals, prompt engineering",
      ],
      ["testing", "Jest, React Testing Library, Playwright, AWS CloudWatch, SQL / dBeaver, Git"],
      ["infrastructure", "Docker, Vercel, CI/CD"],
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
      allSkills: "Every skill →",
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
    skills: {
      title: "What I can do, and what proves it",
      lede: "Every skill below names the shipped projects that back it. Follow a tag to the running app, or to the case study when there is nothing deployed to open.",
    },
    experience: {
      title: "Where I have worked",
      lede: "Newest first, including the years before software. The route through live sound and lighting is unconventional, and it is where the habits came from.",
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
      title: "Vit Busek — Full-stack & AI engineer",
      description:
        "Typed, tested, reviewed code — built through an AI-assisted workflow that turns the iteration cycle software usually measures in weeks into hours or days.",
    },
    work: {
      title: "Work",
      description: "Projects, newest first, with what shipped and what it changed.",
    },
    skills: {
      title: "Skills",
      description:
        "The full skill matrix, every entry backed by a shipped project you can open rather than a self-assessed rating.",
    },
    experience: {
      title: "Experience",
      description:
        "The full work history, newest first — frontend and full-stack engineering, by way of live sound and lighting in the UK music industry.",
    },
    about: {
      title: "About",
      description:
        "Full-stack engineer, senior on the frontend, by way of live sound and lighting engineering in the UK music industry. It is an unconventional route into the job, and it left me with two habits worth keeping: technical precision, and the communication that comes from working in a crew where everything has to be right before the doors open.",
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
  architecture: {
    heading: "Technical design",
    diagramLabel: "Architecture diagram",
    bands: {
      client: "Client",
      server: "Server",
      data: "Data",
      external: "External",
    },
  },
  projects: {
    "secure-llm": {
      summary:
        "A knowledge base you can ask questions of. Every answer points back at the document it came from, and if your own notes do not answer the question, the app says so instead of guessing.",
      role: "Solo build — retrieval, privacy, identity, infrastructure",
      highlights: [
        "Three retrieval arms — vector, identifier and BM25 prose — combined by reciprocal rank fusion. Each lexical arm exists because the embedder measurably refused a question the corpus answers: \"What are PL1 and PL2 set to?\" scored 0.054 against a 0.25 floor, about a document the app had indexed.",
        "Citations are streamed before prose. The model’s JSON puts them first, the array is validated the moment it closes, and the first word of an answer goes out only after a source has been checked — so a rejected answer is refused while the screen still says checking sources, rather than being taken away after it has been read.",
        "Names, e-mail addresses and phone numbers become placeholders before anything leaves the process, and are restored on the way back. The embedder runs in-process, so the anonymised answering call is the only thing that crosses a network boundary at all.",
        "Four answering providers behind one interface, proved rather than asserted: the same code answered through OpenRouter against an OpenAI model using the Anthropic SDK — another company, account and model namespace — with no change to the prompt, the guard, the anonymizer or the audit record.",
      ],
      metricLabels: [
        "tests, no test framework",
        "retrieval arms, fused by rank",
        "answering providers behind one seam",
      ],
      design: {
        notes: {
          embedders: "In-process. No text is sent anywhere to be embedded.",
          providers: "Four implementations: anthropic, openrouter, gateway, mock.",
          pgvector: "384 dimensions, cosine distance.",
          tsvector: "Generated columns: simple for identifiers, english for prose.",
          keycloak: "The realm ships in the compose file.",
        },
        pipelineTitle: "How a question becomes an answer",
        steps: {
          route:
            "The session decides whose documents are searched — the request body cannot name a user. The per-user and deployment-wide spend ceilings are checked here, before anything can cost money.",
          retrieve:
            "The question is embedded in the process, then three searches run: vector similarity, an exact identifier match if the question holds something shaped like a part number, and BM25 over prose. Each repeats the ownership and embedding-model filter in its own SQL rather than trusting another arm to have applied it.",
          fuse:
            "Fusion only orders — every list arrives already filtered, so an empty result stays empty. Nothing found ends the request here, with “Not found in your knowledge base.” and no model call at all.",
          anonymize:
            "One anonymizer per request replaces people, e-mail addresses and phone numbers in the question and in every retrieved chunk. The same instance does both, so a question about a person still matches a note about them.",
          envelope:
            "Question and sources travel inside tags the application writes, and the system prompt’s first rule is that everything inside them is data. Text shaped like one of those tags is escaped rather than stripped — the sentence that tried it is still note content.",
          call:
            "The one place where text leaves the process. It enforces a timeout and writes the audit row — model, timing, token counts, outcome — and never the content.",
          citations:
            "Every cited number must index the set that was actually sent. A citation is a position, not an id, so the model is never shown one it could invent. If none survive, one stricter retry follows, and then the answer is refused.",
          restore:
            "Placeholders become real names again as the stream reaches the reader. The mapping that can do that lives in the request and dies with it — never stored, never logged.",
        },
        decisions: [
          {
            choice: "Citations before prose, in the wire format.",
            because:
              "A delta never precedes its citations in the NDJSON stream, so a client that ignored every other rule still cannot render unsourced text. The latency win is small — time to first token is 84–94% of the call — and that is the point: streaming prose first would look far better and would be showing text no guard had approved.",
          },
          {
            choice: "Two seams, not one.",
            because:
              "Anthropic has no embeddings endpoint, so a single combined provider interface could not have been implemented by the file named after them. Answering and embedding are separate interfaces, and the embedder’s default runs inside the container — which is what keeps the text being indexed off the network entirely.",
          },
          {
            choice: "Three retrieval arms rather than a lower score floor.",
            because:
              "A floor tuned downward until the failures stop is a threshold tuned by feel, and the refusal path is the one thing that must not rest on that. The identifier arm searches each term as a phrase, and the prose arm is admitted on IDF coverage and two matched terms, so an arm either has evidence or does not run.",
          },
        ],
      },
      posterAlt:
        "The Ask screen answering a question about sizing a power supply: the reply works from a 142 W processor figure and a 320 W card up to an 850 W supply, and under it three cited sources, each linking to a different document in the knowledge base.",
    },
    trader: {
      summary:
        "A trading terminal with imaginary money: prices stream in twice a second, and an assistant that can read your portfolio and place the trades for you.",
      role: "Solo build — frontend, backend, infrastructure",
      highlights: [
        "The assistant executes trades through the same API the UI uses, and shows each fill inline as it happens. The live demo answers from its scripted client rather than the model, so leaving it up costs nothing.",
        "One codebase, two deployment shapes. Serverless has no background task, so prices become a closed-form function of the clock — Brownian motion by Lévy construction, 22 steps down a hashed tree rather than 172,800 summed half-second increments — and one factory picks between that and the simulator at startup. Routes, services and the frontend are untouched.",
        "Market data comes from a geometric Brownian motion simulator by default — per-ticker volatility, correlated sector moves, no API key. Real quotes are opt-in, and there is deliberately no silent fallback between them.",
        "846 tests across the stack: 591 on the backend, 228 on the frontend, plus 27 Playwright specs run against the built container.",
      ],
      metricLabels: ["price ticks streamed", "tests across the stack", "closed-form price clock"],
      design: {
        notes: {
          fastapi: "One serverless function, api/index.py.",
          market: "Deterministic prices, two ticks a second.",
          postgres: "Driven by asyncpg.",
          openrouter: "Container build only.",
        },
        decisions: [
          {
            choice: "One FastAPI app, two deployments.",
            because:
              "The container build simulates prices with numpy and answers through a real model; the Vercel function computes them in closed form and ships LLM_MOCK=true. Both talk to the same Postgres, and the routes are identical, so the frontend never learns which build it reached.",
          },
          {
            choice: "SSE, not WebSockets.",
            because:
              "Prices only ever flow one way. STREAM_MAX_SECONDS is 55, which keeps a stream inside Vercel's sixty-second ceiling for a function.",
          },
          {
            choice: "The frontend is a static export on the CDN.",
            because:
              "vercel.json rewrites only /api/* into Python, so no page render ever passes through the function.",
          },
        ],
      },
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
      design: {
        notes: {
          modules: "Catalogue, browse, detail, library, account.",
          steam: "Its own rate limiter and TTL cache.",
          drizzle: "Four checked-in migrations.",
          trgm: "On game.name.",
        },
        decisions: [
          {
            choice: "Search is Postgres, not a search service.",
            because:
              "One pg_trgm GIN index on game.name covers 245,025 rows. Nothing to keep in sync, and no second datastore to pay for.",
          },
          {
            choice: "Migrations are generated and checked in.",
            because:
              "db/migrations holds all four SQL files, and the pg_trgm extension is created by migration 0003 — not by a manual step someone has to remember against a new database.",
          },
          {
            choice: "The Steam client owns its own rate limiter and cache.",
            because:
              "A page render cannot fan out into an unbounded number of upstream calls, whatever the page asks for.",
          },
        ],
      },
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
      design: {
        notes: {
          tmdb: "Typed client, cache tags per endpoint.",
          auth: "Auth.js with the Drizzle adapter.",
          watchlist: "Server Actions.",
        },
        decisions: [
          {
            choice: "TMDB responses are cached by tag, through Next's own data cache.",
            because:
              "Windows run from a day for configuration down to five minutes for search, so a browse page costs nothing upstream.",
          },
          {
            choice: "Sessions live in the same Postgres as the watchlist.",
            because:
              "One database and one migration history, through the Auth.js Drizzle adapter.",
          },
        ],
      },
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
      design: {
        notes: {
          pdf: "The PDF is built in the browser.",
          fastapi: "Routes: auth, documents, chat, saved, demo.",
          templates: "Indexed by catalog.json.",
        },
        decisions: [
          {
            choice: "Templates are markdown files in the repository.",
            because:
              "catalog.json indexes them, so there is no CMS and no content rows in the database — a template change arrives as a diff someone can review.",
          },
          {
            choice: "The PDF is rendered in the browser.",
            because:
              "The server never generates a document, so no request holds a rendering process open.",
          },
        ],
      },
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
        "The root is a public demo board — the real app, seeded per visit and saving nothing, so there is something to poke at without an account. OAuth (Google and GitHub) gates the boards that persist.",
        "291 tests across the stack: 211 unit and component, 80 Playwright end-to-end.",
      ],
      metricLabels: ["Drizzle + Neon", "tests across the stack"],
      design: {
        notes: {
          actions: "lib/actions — the whole write surface.",
          proxy: "Sends unauthenticated /boards/* to sign-in.",
          s3: "Reached over presigned URLs.",
        },
        decisions: [
          {
            choice: "Writes go through Server Actions, not route handlers.",
            because:
              "app/api holds only auth, Pusher auth, attachment redirects and health; everything else lives in lib/actions next to its tests.",
          },
          {
            choice: "Cards carry fractional ranks.",
            because:
              "Dragging a card writes one row instead of renumbering the column it landed in.",
          },
          {
            choice: "Attachments go straight to S3 over presigned URLs.",
            because:
              "File bytes never pass through the app, which keeps uploads clear of the function's request limits.",
          },
        ],
      },
      posterAlt:
        "Work Planner's public demo board: three columns — Ready to work, In progress and In testing — holding cards tagged with labels, due dates and an attachment count.",
    },
  },
  skills: {
    "databases-and-data": {
      title: "Databases and data",
      skills: {
        postgres: { name: "Postgres", detail: "schema, indexing, migrations" },
        drizzle: { name: "Drizzle ORM", detail: "typed schema, generated migrations" },
        "full-text-search": {
          name: "Full-text search",
          detail: "pg_trgm trigrams, and generated tsvector columns indexed twice — simple for identifiers, english for prose",
        },
        "background-work": {
          name: "Background work",
          detail: "a monthly cron job, advisory-locked queues, backfill with retry and backoff, durable partial progress",
        },
      },
    },
    "ai-and-retrieval": {
      title: "AI and retrieval",
      skills: {
        rag: {
          name: "Retrieval-augmented generation",
          detail: "three arms — vector, identifier and BM25 prose — combined by reciprocal rank fusion; nothing retrieved refuses the question instead of guessing at it",
        },
        "vector-search": {
          name: "Vector search",
          detail: "pgvector with an HNSW cosine index over 384-dimension embeddings computed in-process, so indexed text never leaves the container",
        },
        "llm-integration": {
          name: "LLM integration",
          detail: "four answering providers behind one interface, with per-user and deployment-wide spend ceilings checked before a call can cost anything",
        },
        "prompt-security": {
          name: "Prompt injection defence",
          detail: "retrieved text travels inside tags the application writes, tag-shaped spans are escaped rather than stripped, and citations are validated before the first word of prose streams",
        },
        "pii-anonymisation": {
          name: "PII anonymisation",
          detail: "names, e-mail addresses and phone numbers become placeholders before anything crosses a network boundary; the mapping back lives in the request and dies with it",
        },
      },
    },
    "backend-and-integrations": {
      title: "Backend and integrations",
      skills: {
        fastapi: { name: "FastAPI", detail: "typed routes, service layer" },
        "third-party-apis": {
          name: "Third-party APIs",
          detail: "Steam, TMDB, OpenRouter, with tag-based cache revalidation and an on-demand purge endpoint",
        },
        auth: {
          name: "Auth",
          detail: "OAuth sign-in and sessions, and OIDC against a Keycloak realm with role claims read from the token",
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
          detail: "server-sent events for live price ticks, NDJSON for token-by-token answers",
        },
        "accessible-interaction": {
          name: "Accessible interaction",
          detail: "drag and drop that is keyboard-operable, with the ARIA roles the pattern actually calls for",
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
          detail: "unit, integration and Playwright end-to-end — and 170 tests on the Node runner alone, with no test framework installed",
        },
        docker: {
          name: "Docker",
          detail: "multi-stage builds, one origin, no CORS layer; a compose file that brings up the app, its database and an identity provider together",
        },
        "ci-cd": {
          name: "CI/CD",
          detail: "typecheck, lint and both suites on every pull request",
        },
      },
    },
  },
} satisfies Copy;
