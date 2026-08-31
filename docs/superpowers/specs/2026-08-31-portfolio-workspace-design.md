# Portfolio rebuild: the workspace

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

The page is also the primary work sample. A frontend engineer's portfolio that is
slow, shifts under the reader, or breaks on a keyboard has answered question 1 in the
wrong direction, whatever it claims in prose.

## The central idea

Six applications exist. Five of them are deployed and publicly reachable right now.
No portfolio claim is as strong as the running thing itself, so the page embeds them:
a window holds one live application, and a switcher changes which one.

This is deliberately not a screenshot gallery and not an OS simulation. The window is
the structure because a window is what holds a running program — that is the whole
borrowing. There is no desktop metaphor to learn, no draggable furniture, no fake
menu bar.

### Why the window earns its place

- It makes "these are real and running" self-evident rather than asserted.
- It gives every project a consistent frame, so six different visual identities do not
  turn the page into a collage.
- Its controls do real work: expand gives the app the whole viewport, collapse gets it
  out of the way.

## Visual direction: Graphite

Dark by default. Muted throughout — the brief was explicitly "not screaming".

### Colour

Tokens carry both themes; components never write a `dark:` variant. `:root` holds the
dark values, and `@media (prefers-color-scheme: light)` swaps them. This inverts the
current file, which is light-first.

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

- `--accent` marks the active app, interactive controls, and focus.
- `--live` marks a deployment that is actually up. It appears nowhere else.

Reachability and maturity are two different facts and must not be conflated. The dot
answers "does this respond?" — `--live` when it does, `--dim` when it does not. The
`status` field answers "is this finished?" and is carried in words, not colour. So
`work-planner` shows a live dot, because it genuinely responds, alongside the words
"in development".

Every text/background pair must clear WCAG AA (4.5:1 for body, 3:1 for large text) in
both themes. `--dim` on `--bg` is the tightest pair and must be checked, not assumed.

### Type

Two families, down from three.

- **Schibsted Grotesk** — everything structural. Display sizes at `-0.026em` tracking
  and weight 600; body at 400.
- **JetBrains Mono** — numbers, URLs, field labels, evidence tags. Data only.

The `label` utility survives as the small-caps mono treatment.

### Motion

Three places only: the crossfade when a live app replaces its screenshot, the switcher's
active-tab slide, and the expand transition. Everything honours `prefers-reduced-motion`,
where each becomes an instant state change rather than a shortened one.

## Page structure

Order is by what persuades, not by what is fun to build.

1. **Header** — name, role, availability, contact. Availability and email are reachable
   from every screen without navigation.
2. **Workspace** — the hero. Switcher plus one live application.
3. **What each one is** — one checkable sentence per app, with its real numbers.
4. **Experience** — the employment history. Six years of paid senior work, including a
   team lead role, is the most credible evidence on the page for this audience, so it
   sits high rather than in a footer.
5. **Skills, with receipts** — every skill names the shipped projects that prove it.
6. **Decisions** — three real engineering problems and how they were solved, each
   linking to the commit.
7. **Contact** — email, phone, GitHub.

The header carries the availability status and a direct email link, so questions 3 and 4
are answered without navigating. A CV download is deliberately not promised here: the
only CV in the repository is gitignored markdown. If a PDF is added later it becomes a
link in the header and the contact screen; the design leaves room for it and does not
depend on it.

`kanban` does not appear in the workspace; it lives on `/work` only. Five windows already
risk repetition, and it is the weakest of the set.

Switcher order: `trader`, `games-db`, `my-movies`, `legal`, `work-planner`.

`trader` leads because every pixel in it is the author's own design, it is visually dense
in a way that reads as competence immediately, and it shows AI, streaming and full-stack
in a single frame. `games-db` cannot lead: it renders Steam's storefront, so first paint
would be a stranger's product artwork and a price tag. Second position lets its real
headline — 245,025 appids indexed, 14,621 hydrated with full detail — do the persuading
instead.

## The embed

### Loading sequence

The window is never empty and never blocks first paint.

1. The screenshot ships in the static HTML and paints immediately. For the featured app
   it is the LCP element and loads eagerly; every other screenshot is lazy.
2. The iframe mounts beneath it at `opacity: 0`, `pointer-events: none`.
3. On the iframe's `load` event it crossfades to `opacity: 1` over 250ms and becomes
   interactive. Under `prefers-reduced-motion` the swap is instant.
4. The screenshot stays mounted underneath. It costs one decoded image and means a slow
   route inside the app still has a backdrop rather than white.

Screenshots are captured from the live deployment at 1440x900, matching the existing
captures in `public/work/`, and the container is locked to 16:10 with `aspect-ratio`. The
iframe renders at that same ratio, so the swap cannot shift layout. `games-db`,
`my-movies` and `work-planner` have no capture yet and need one.

### Failure

`load` fires for error pages too, so it is not sufficient evidence that an app is up. A
timeout runs alongside it: if `load` has not fired within 8 seconds, the iframe is
discarded, the screenshot stays, and the window surfaces "Open app" as a direct link.
The failed state is visually the same window — there is no broken-looking box, and no
error text shouting at a visitor who did nothing wrong.

### Cost control

Exactly one iframe exists at a time. Switching apps unmounts the previous one before
mounting the next, so memory and connections stay flat however long someone explores.

Only the featured app auto-loads, and only on viewports that get embeds. The featured app
is the first entry in the switcher order, `trader`. Every other window is click-to-load
behind a "Run this app" control.

`work-planner` is a special case: its board is behind sign-in, so the embed lands on a
sign-in screen. That is what the window shows, with a caption saying the board sits behind
it. It is not dressed up as more than it is.

### Sandboxing

Third-party origins are framed with an explicit allowlist:
`sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"`,
plus `referrerpolicy="no-referrer"` and a `title` naming the application. These are the
author's own deployments, not untrusted third parties, but the attribute is stated rather
than omitted.

## Mobile

Below 768px there are no iframes at all. A desktop application rendered into a 390px
viewport is unreadable, and pinch-zooming inside an iframe is a bad experience that would
answer question 1 in the wrong direction.

Mobile is designed, not degraded:

- The same window chrome holds the screenshot.
- The control reads "Open app" and opens the real deployment in a new tab, full-screen,
  where it is actually usable.
- The switcher becomes a horizontally scrollable segmented control with the active app
  scrolled into view.
- The numbers under each window carry the persuasion the live app carries on desktop.

The breakpoint is resolved after mount via `matchMedia`. The server renders the
screenshot state, which is also the mobile state, so there is no hydration mismatch and
no flash — desktop simply upgrades.

## Window controls

Two controls, both real buttons with accessible names.

- **Collapse** reduces the window to its title bar, so the page below is reachable.
- **Expand** takes the app to a full-viewport surface. Focus moves into the surface, it
  is `aria-modal` with a focus trap, Escape returns, and focus lands back on the control
  that opened it.

There is no close button. Nothing here can be closed, so offering it would be a lie.

## Content model

`src/content/` stays the single source of truth. No page hardcodes copy.

### `projects.ts`

Existing fields stay. New fields:

- `embedUrl?: string` — the deployment to frame. Required when `status` is `live`.
- `status: "live" | "in-development" | "archived"` — drives the switcher dot and the
  wording. `work-planner` is `in-development`: it is behind sign-in and still being
  built, and the page says so rather than implying a finished product.
- `metrics: { label: string; value: string }[]` — the numbers under the window. Two to
  four. Every value must be checkable.
- `screenshot: string` and `screenshotAlt: string` — now required for any project in the
  workspace, because the screenshot is the load-bearing placeholder rather than a
  decoration.

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

**Every mapping must be verified against the repository before it ships.** The READMEs
are not evidence: `work-planner`'s still describes a scaffold with no auth, boards or
cards, while its merge history has all three; `my_movies`' says `schema.ts` is
deliberately empty and only the health check touches Postgres, so listing Postgres under
`my-movies` would be an overclaim. A skills section whose entire value is that it is
checkable cannot contain a single row that does not check out.

### `decisions.ts` (new)

Three entries: title, two-sentence problem, two-sentence resolution, commit URL. Sourced
from real commits.

## Routes

Unchanged, so nothing 404s: `/`, `/work`, `/work/[slug]`, `/about`, `/contact`,
`not-found`. `/work/[slug]` gains the same window component, embedding that project alone.

The site stays fully static: `generateStaticParams` prerenders every project page, and
there is no runtime data source.

## Quality floor

Non-negotiable, and verified rather than asserted:

- No layout shift. Every image and embed container has fixed dimensions or aspect ratio.
- The embed never blocks first paint or LCP.
- Every interactive element is reachable and operable by keyboard, with a visible focus
  ring.
- `prefers-reduced-motion` is honoured everywhere.
- Contrast clears AA in both themes.
- The production build stays static and type-checks clean.

## Testing

Three layers, per the repository standard.

**Unit / content integrity**
- Every `skills.ts` evidence slug resolves to a real project.
- Every `live` project has an `embedUrl`; every workspace project has a `screenshot` that
  exists on disk and a non-empty `screenshotAlt`.
- No duplicate slugs; `shipped` parses; switcher order references real projects.
- `decisions.ts` entries all carry a commit URL.

**Component**
- The switcher changes the mounted application.
- Exactly one iframe is mounted at a time; switching unmounts the previous one.
- Click-to-load mounts an iframe only after activation.
- The iframe is transparent and non-interactive until `load`, and opaque after it.
- The timeout path discards the iframe and reveals the link.
- Expand sets modal state and moves focus; Escape restores it.
- The mobile branch renders a link and never an iframe.

**End-to-end (Playwright)**
- The workspace renders with the featured app and exactly one iframe with the expected
  `src`.
- Switching apps changes the iframe `src` and leaves exactly one iframe.
- Expand fills the viewport; Escape returns focus to the trigger.
- A mobile-viewport project asserts no iframe exists and the link points at the
  deployment.
- Both themes render, driven by `prefers-color-scheme` emulation.
- Keyboard-only traversal reaches the switcher, the window controls and the contact link.

## Changes to CLAUDE.md

Two documented conventions change and the file is updated in the same work:

- The theme inverts: `:root` is dark, `prefers-color-scheme: light` swaps the values. The
  "never write `dark:` variants" rule is unchanged and matters more.
- Three type faces become two: Schibsted Grotesk and JetBrains Mono.

A new section documents the embed contract — one iframe at a time, screenshot as
placeholder, no embeds below the mobile breakpoint — because it is the thing most likely
to be broken accidentally by a later change.

## Explicitly out of scope

- No CMS or runtime data source. Content stays typed files.
- No analytics.
- No contact form. Email and phone are enough, and a form is a backend to maintain.
- No draggable windows, no desktop metaphor beyond the frame itself.
- `next-store` is not featured. Both of its deployments errored; it is not shippable
  evidence.
