# Portfolio rebuild: the carousel

Design spec. Written 2026-08-31.

## The job this page has

A potential employer or client lands here, usually from a link, often on a phone,
and gives the page seconds before deciding whether to keep reading. The page has to
answer four questions in that window:

1. Is this person good?
2. Can they do the thing I need?
3. Are they available?
4. How do I reach them?

Everything below serves those four questions. Where a design choice is fun but does
not move one of them, it is cut.

The page is also the primary work sample. A frontend engineer's portfolio that is slow,
shifts under the reader, or breaks on a keyboard has answered question 1 in the wrong
direction, whatever it claims in prose.

## Name

**Vit Busek**, without diacritics, everywhere — page copy, metadata, the title template
and the CV filename convention. The current `site.ts` has "Vít Busek", which is neither
form consistently.

## The central idea

Six applications exist; five are deployed. The home page is a **carousel of them**, each
card showing the app actually running as a short silent loop, and each card opening the
real deployment in a new tab.

Embedding the apps in iframes was considered and rejected. It made the page's first paint
depend on someone else's cold start, it forced a second-class experience on phones, and it
kept a visitor inside a 900px-tall box when the real app is a better demonstration of
itself at full size. A capture that loads instantly and a click that opens the real thing
is both faster and more honest.

## Visual direction: Graphite

Dark by default. Muted throughout — the brief was explicitly "not screaming".

### Colour

Tokens carry both themes; components never write a `dark:` variant. `:root` holds the dark
values, and `@media (prefers-color-scheme: light)` swaps them. This inverts the current
file, which is light-first.

| Token | Dark (default) | Light |
|---|---|---|
| `--bg` | `#14171B` | `#E9EAEC` |
| `--surface` | `#1C2127` | `#FCFCFD` |
| `--raised` | `#232931` | `#F3F4F6` |
| `--line` | `#2E353E` | `#DEE1E5` |
| `--line-soft` | `#262C34` | `#E9EAEE` |
| `--text` | `#E6E9ED` | `#1A1D21` |
| `--muted` | `#8E97A2` | `#5F666E` |
| `--dim` | `#666F7A` | `#8A9199` |
| `--accent` | `#7BA3CC` | `#3D6B8C` |
| `--accent-soft` | `rgb(123 163 204 / 0.13)` | `rgb(61 107 140 / 0.10)` |
| `--live` | `#6FBE93` | `#3E9E6B` |

Colour is meaning, not decoration:

- `--accent` marks the active slide, interactive controls, and focus.
- `--live` marks a deployment that is actually up. It appears nowhere else.

Reachability and maturity are separate facts. The dot answers "does this respond?"; the
`status` field answers "is this finished?" and is carried in words. `work-planner` shows a
live dot alongside the words "in development".

Every text/background pair must clear WCAG AA in both themes. `--dim` on `--bg` is the
tightest pair and must be measured, not assumed.

### Type

Two families, down from three.

- **Schibsted Grotesk** — everything structural.
- **JetBrains Mono** — numbers, URLs, field labels, evidence tags. Data only.

The `label` utility survives as the small-caps mono treatment.

## Page structure

1. **Header** — name, role, availability, email, nav. Availability and contact are
   reachable from every screen without navigating.
2. **Carousel** — the hero. Five apps, one active, each opening live in a new tab.
3. **What each one is** — one checkable sentence per app, with its real numbers.
4. **Track record** — the employment history. Six years of paid senior work including a
   team lead role is the most credible evidence here for this audience, so it sits high.
5. **Skills, with receipts** — every skill names the shipped projects that prove it.
6. **Contact** — email, phone, GitHub, location.

There is no "decisions" section. It was specced and cut: it served the engineer who reads
deeply, but it pushed the things that persuade everyone else further down the page.

Deep detail — stack, highlights, per-project narrative — lives on `/work` and
`/work/[slug]`, reachable from the nav and from every carousel card.

## The carousel

### Behaviour

- Five slides, one active. Order: `trader`, `games-db`, `my-movies`, `legal`,
  `work-planner`.
- **No auto-advance.** Motion already comes from the active capture looping; a carousel
  that moves on its own takes control away from someone reading, and is a well-known way
  to annoy the exact person this page is trying to impress.
- Controls: previous/next buttons, a labelled tab per app, arrow keys when the carousel
  has focus, and swipe on touch.
- Clicking the active card opens that deployment in a **new tab** (`target="_blank"`,
  `rel="noopener noreferrer"`).
- The card is a link, not a div with a handler, so it is keyboard-operable and
  middle-clickable for free.

`trader` leads because every pixel in it is the author's own design, it is visually dense
in a way that reads as competence immediately, and it shows AI, streaming and full-stack in
one frame. `games-db` cannot lead: it renders Steam's storefront, so first paint would be a
stranger's product artwork and a price tag. Second position lets its own headline —
245,025 appids indexed, 14,621 hydrated — do the persuading instead.

`kanban` is not in the carousel; it appears on `/work` only. Five slides already risk
repetition and it is the weakest of the set.

### Media

Each app has a **scripted video tour**: Playwright drives the live deployment through a
short sequence, recorded silently at 1440x900 and looped. A tour shows the app doing its
job rather than sitting idle — the untouched Trader home screen has an empty positions
table and an empty performance chart, which undersells it badly.

Per-app scripts live in `scripts/capture/`, are committed, and are re-runnable when an app
changes. Each produces a WebM plus a poster frame (WebP, 1440x900).

Markup is `<video autoplay muted loop playsinline preload="none" poster="…">`. Not GIF:
at this size a GIF runs to several megabytes and bands visibly, where the same loop as
WebM is roughly a tenth of that and stays sharp.

Playback rules:

- **Only the active slide plays.** Every other slide is its poster. Leaving a slide pauses
  and unloads its video.
- The poster ships in the static HTML and is the LCP candidate, so the card is never
  empty and video never blocks first paint.
- `prefers-reduced-motion: reduce` — no video is loaded at all, on any slide. The poster
  is the whole experience, and nothing is lost but the motion.
- The container is locked to 16:10 with `aspect-ratio`, so nothing shifts as media loads.

If a video fails, the poster is already underneath and stays. There is no error state to
design, because the failure state is the normal state minus motion.

### Sign-in apps

`legal` and `work-planner` both present only a sign-in form to a stranger. Two login
screens in a hero carousel would undercut the whole page.

Both get a **demo account**, and the card surfaces the credentials plainly next to the
"Open live app" link, so a visitor can go in and use the real thing. The tours for these
two are recorded from a signed-in session, showing the actual product.

This is the one place the page shows something a visitor cannot reach in one click, so it
must say so in words: the card states that sign-in is required and gives the credentials
to get past it. Credentials live in `projects.ts` beside the project, as ordinary content.

**Blocked until the accounts exist.** Until then the two cards carry the sign-in poster and
no credentials, which is honest but weak. This is the one open dependency in the plan.

## Mobile

The carousel is the same component, not a fallback: one card at a time, swipeable, tabs
becoming a scrollable strip with the active app scrolled into view. Tapping opens the real
deployment full-screen in a new tab, which is where a phone visitor wants it anyway.

Video still plays only for the active slide, so a phone loads exactly one.

## Content model

`src/content/` stays the single source of truth. No page hardcodes copy.

### `projects.ts`

Existing fields stay. New fields:

- `liveUrl?: string` — the deployment. Required when `status` is `live`.
- `status: "live" | "in-development" | "archived"`.
- `metrics: { label: string; value: string }[]` — two to four, every value checkable.
- `poster: string` and `posterAlt: string` — required for any carousel project.
- `tour?: string` — path to the WebM.
- `demo?: { email: string; password: string }` — surfaced on the card when present.

### `skills.ts` (new)

```ts
type Skill = {
  name: string;
  detail: string;          // what specifically, e.g. "pg_trgm, GIN index"
  evidence: ProjectSlug[]; // typed against the project list
};
type SkillGroup = { title: string; skills: Skill[] };
```

`ProjectSlug` is derived from `projects`, so evidence pointing at a project that does not
exist is a compile error, and a unit test asserts every slug resolves at runtime too.

**Every mapping must be verified against the repository before it ships.** The READMEs are
not evidence: `work-planner`'s still describes a scaffold with no auth, boards or cards
while its merge history has all three; `my_movies`' says `schema.ts` is deliberately empty
and only the health check touches Postgres, so listing Postgres under `my-movies` would be
an overclaim. A skills section whose entire value is that it is checkable cannot contain a
single row that does not check out.

## Routes

Unchanged, so nothing 404s: `/`, `/work`, `/work/[slug]`, `/about`, `/contact`,
`not-found`. The site stays fully static; `generateStaticParams` prerenders every project
page and there is no runtime data source.

## Quality floor

Verified rather than asserted:

- No layout shift; every media container has a fixed aspect ratio.
- Video never blocks first paint; posters are the LCP candidates.
- Every control is keyboard-reachable with a visible focus ring.
- `prefers-reduced-motion` is honoured — and here it means no video at all, not faster video.
- Contrast clears AA in both themes.
- The production build stays static and type-checks clean.

## Testing

**Unit / content integrity**
- Every `skills.ts` evidence slug resolves to a real project.
- Every `live` project has a `liveUrl`; every carousel project has a `poster` that exists
  on disk and a non-empty `posterAlt`; every declared `tour` file exists.
- No duplicate slugs; `shipped` parses; carousel order references real projects.
- No diacritics regression: the rendered name is "Vit Busek".

**Component**
- The active slide advances and wraps with the next/previous controls and arrow keys.
- Exactly one video element is playing; changing slides pauses and unloads the previous.
- Under `prefers-reduced-motion`, no video element is rendered at all.
- Each card links to its `liveUrl` with `target="_blank"` and `rel="noopener noreferrer"`.
- A project with `demo` renders its credentials; one without renders none.

**End-to-end (Playwright)**
- The carousel renders with `trader` active and its poster present.
- Next/previous and the tabs change the active slide.
- The active card's link points at the expected deployment and opens in a new tab.
- Keyboard-only traversal reaches the tabs, the controls and the contact link.
- A reduced-motion project asserts no `<video>` exists.
- A mobile-viewport project asserts one card is visible and the link is correct.
- Both themes render, driven by `prefers-color-scheme` emulation.

## Changes to CLAUDE.md

- The theme inverts: `:root` is dark, `prefers-color-scheme: light` swaps the values. The
  "never write `dark:` variants" rule is unchanged and matters more.
- Three type faces become two: Schibsted Grotesk and JetBrains Mono.
- A new section documents the media contract — poster in the static HTML, only the active
  slide plays, no video under reduced motion, capture scripts in `scripts/capture/` — since
  that is the thing most likely to be broken accidentally by a later change.

## Explicitly out of scope

- No iframes anywhere. Considered and rejected above.
- No CMS or runtime data source. Content stays typed files.
- No analytics, no contact form.
- No auto-advancing carousel.
- `next-store` is not featured. Both of its deployments errored; it is not shippable
  evidence.
