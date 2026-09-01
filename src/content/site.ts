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
  url: "https://example.com",
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
};
