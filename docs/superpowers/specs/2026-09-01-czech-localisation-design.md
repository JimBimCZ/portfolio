# Czech localisation

Design spec. Written 2026-09-01.

## The job

The site has one audience in two languages. A recruiter or client abroad reads
English; a Czech client, a Brno agency, or a local hiring manager reads Czech —
and a portfolio that addresses them in a second language is quietly telling them
they were not the person it was written for.

So: every word of the site exists in Czech, reachable by one click from any page,
without breaking a single URL that already works.

## Decisions

**English stays at the root. Czech lives under `/cs`.** `vitbusek.dev/work` does
not move, so no shared link, CV footer, or crawled URL breaks. Czech is
`/cs/work`. Route slugs stay English on both sides (`/cs/work/trader`), because a
slug is an identifier — translating it would fork `projects.ts` for no reader's
benefit.

**The site never guesses.** No `Accept-Language` sniffing, no middleware, no
redirect. English is what every entry point serves; Czech is what the switch
gives you. Two reasons. The privacy notice promises no cookies and no local
storage, so a guess could not be remembered without either contradicting that
notice or re-guessing on every visit and overriding the visitor's click. And a
Czech-speaking recruiter who wants the English CV — the common case when they are
screening for an international team — should not be bounced away from it.

**Job titles stay English inside the Czech copy.** "Frontend Developer",
"Team Leader", "agentic AI" — Czech listings and Czech CVs use them untranslated,
and rendering them as "vývojář uživatelského rozhraní" would read as a machine
translation of a CV rather than a CV.

**The Czech is written, not translated.** The hero line is the test: a literal
Czech rendering of "I build robust software, and AI tooling is why it ships in
days" is stiff and slightly foreign. The Czech dictionary carries the same
argument in a sentence a Czech engineer would actually write.

## Routing: two route groups, two root layouts

```
src/app/
  (en)/
    layout.tsx            <html lang="en">   /
    page.tsx                                 /
    work/page.tsx                            /work
    work/[slug]/page.tsx                     /work/:slug
    about|contact|privacy/page.tsx
    not-found.tsx
  (cs)/
    layout.tsx            <html lang="cs">   /cs
    cs/page.tsx                              /cs
    cs/work/page.tsx                         /cs/work
    cs/work/[slug]/page.tsx                  /cs/work/:slug
    cs/about|contact|privacy/page.tsx
    cs/not-found.tsx
  global-not-found.tsx    unmatched URLs
```

Route groups are what buy the asymmetric URL shape: `(en)` contributes no path
segment, so its pages sit at the root, while `(cs)` holds a literal `cs`
directory. Because there is no top-level `layout.tsx`, each group renders its own
`<html>` and `<body>` — which is the point. `<html lang="cs">` on the Czech tree
is correct rather than approximated, so a screen reader pronounces Czech as Czech
and a crawler is told the truth about the page.

The alternative was a single `app/[lang]` tree with a `next.config` rewrite
mapping `/work` to `/en/work`. It removes the duplicate route files, but
`beforeFiles` rewrites run ahead of static file serving, so the rewrite's regex
also has to exclude `/og.jpg`, `/work/trader.webp`, and `/_next`. Getting that
wrong does not fail a build — it silently 404s a poster. Rejected on failure
mode, not on elegance.

**Page bodies become components.** Each page's JSX moves to
`src/components/pages/<name>.tsx`, taking `{ copy, locale }`. The twelve route
files are thin: pick the dictionary, export `metadata`, render the component.
Structure therefore cannot drift between languages — only the wrapper is
duplicated, and it is eight lines.

**The 404.** Per-group `not-found.tsx` covers `notFound()` from a route segment,
which is the existing `/work/unknown-slug` case, in the right language on each
side. A URL matching no route at all has no single layout to compose from once
the root layout is gone; Next.js 16.3.1 answers that with `global-not-found.tsx`
behind `experimental.globalNotFound`, which is marked experimental. This is the
one unverified assumption in the spec and the first thing the implementation
checks. If the flag does not hold up, the fallback is an English-only global 404,
recorded in the plan rather than papered over.

## Content model

Prose is per-locale. Everything else stays single-source. A second copy of
`projects.ts` would let a `liveUrl`, a poster path, or a project's existence drift
between languages, and drift in the data is a broken page rather than an awkward
sentence.

`src/content/projects.ts` keeps what is not language: `slug`, `shipped`,
`status`, `signInRequired`, `stack`, `repo`, `liveUrl`, `poster`, `tour`, metric
**values**, the log order and the carousel order. `site.ts` keeps `name`, `email`,
`phone`, `url`, `ogImage`, and the link hrefs. `skills.ts` keeps the group
structure and the `evidence` slugs.

Two dictionaries hold every string a human reads:

```
src/content/copy/
  types.ts    the Copy type — one shape, both locales
  en.ts
  cs.ts
  index.ts    getCopy(locale), Locale, LOCALES
```

A dictionary covers:

- **chrome** — nav labels, the availability status, footer links, the language
  switch, carousel controls (`Previous app`, `Next app`, `Choose an application`,
  `Deployed applications`, `Open live app`, `Sign-in required`)
- **pages** — every heading, button, and paragraph currently hardcoded in a page:
  `View work`, `Get in touch`, `What each one actually is`, `Track record`,
  `Skills, with receipts`, `All projects →`, `Full history →`, the work page's
  title and lede and `More in progress`, the project page's `Role`, `Stack`,
  `What it brings`, `Visit site`, `Source`, `← Work`, the contact and privacy and
  404 copy
- **projects** — keyed by `ProjectSlug`: `summary`, `role`, `highlights`,
  `posterAlt`, `liveNote`, and each metric's `label`
- **skills** — group titles, skill names, details
- **person** — `role`, `location`, `tagline`, `intro`, `status`, `ogImageAlt`,
  `manifest` rows, `bio` paragraphs, per-role `note` and title in `experience`,
  the toolkit rows, the whole `privacy` block
- **metadata** — per-page title and description, and the `og` description

Both dictionaries `satisfies Copy`, and the project record is keyed on
`ProjectSlug`. Adding a project without Czech prose, or dropping a key from one
side, is a compile error — the same guarantee `evidence` already gives, extended
to the translation.

Project **titles** stay in `projects.ts`: they are product names, not prose.

## The language switch

Top right of the header, after the nav: `EN · CS`, the current locale in accent
with `aria-current="true"`, wrapped in `<nav aria-label="Language">`. Each link
carries `hreflang` and `lang`, so `Čeština` is announced in Czech rather than
read as English.

It links to the counterpart of the page you are on, not to the home page —
`/work/trader` ↔ `/cs/work/trader`. `SiteHeader` is already a Client Component
reading `usePathname` for the active nav state, so the counterpart is a prefix
add or strip on the current path. No cookie, no storage, no redirect: the privacy
notice stays literally true.

## Metadata and dates

Every page declares `alternates.languages` with both URLs plus `x-default`
pointing at English, and a canonical for itself, so the two trees are related
rather than competing. `openGraph.locale` is `en_GB` on one side and `cs_CZ` on
the other.

`formatShipped` takes a locale and formats through `toLocaleDateString` with
`en-US` or `cs-CZ`, giving `August 2026` and `srpen 2026`. Czech month names are
lower case, which is correct and will look like a bug to anyone who does not know
that — hence a test that pins it.

## Testing

- `copy.test.ts` — both dictionaries cover every project slug and every skill,
  and no string is empty. Types catch a missing key; this catches an empty one.
- `formatShipped` gets a `cs-CZ` case alongside the existing ones, including a
  January date.
- Component and page tests take a dictionary, so the Czech tree is rendered in
  tests rather than assumed. Where a test currently asserts English copy, it
  asserts through the dictionary instead of a literal.
- e2e: the switch moves `/` ↔ `/cs` and `/work/trader` ↔ `/cs/work/trader`;
  `<html lang>` is `en` and `cs` in the respective trees; the carousel operates
  under `/cs`; both 404s render in their own language; and posters still load,
  which is the existing test that would catch a routing change breaking static
  assets.

## Delivery

Three pull requests, each green on `npm run build && npm run lint && npm test`.

1. **Content model.** Prose moves out of `site.ts`, `projects.ts` and `skills.ts`
   into `copy/en.ts` behind the `Copy` type; pages read the dictionary. The
   rendered site is byte-for-byte what it is today. Pure refactor, no Czech, no
   routing.
2. **Czech dictionary.** `copy/cs.ts`, the full translation, plus the parity
   tests. Nothing renders it yet. This is the PR that needs reading closely, and
   it reviews as prose rather than as prose tangled with routing.
3. **Routing and switch.** Route groups, both trees, page components, the header
   switch, hreflang, localised dates, the 404s, and the e2e suite.
