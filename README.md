# Portfolio

Personal site for Vit Busek. Next.js 16 (App Router), React 19, Tailwind v4, TypeScript. Fully static — every route is prerendered at build time.

## Develop

```bash
npm run dev       # http://localhost:3000
npm run build     # type-checks and prerenders
npm run lint
npm test          # unit and component tests (vitest)
npm run test:e2e  # end-to-end tests (playwright)
```

## Editing content

Both files are typed, so the build catches a malformed entry.

- `src/content/site.ts` — name, role, contact details, nav, and the spec block on the home page.
- `src/content/projects.ts` — the project list. Newest first; add an entry and `/work/<slug>` is generated for it.

Screenshots go in `public/work/` and are referenced from a project's `image` field. They are real captures of the running apps; a test fails if a referenced file is missing.

## Theming

Colors and fonts are defined once as tokens in `src/app/globals.css`. Light and dark are two sets of values for the same token names, switched by `prefers-color-scheme`.
