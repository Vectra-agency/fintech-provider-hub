# Fintech Provider Hub — website

Static bilingual (EN/RU) marketing site. Spec: [PRD.md](PRD.md).

Next.js 16 (App Router, `output: 'export'`) · Tailwind CSS v4 · TypeScript strict · Cloudflare Pages (+ one Pages Function on `/`).

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Static export to `out/` |
| `pnpm build:prod` | `check:placeholders` + build (release gate, PRD §9.6) |
| `pnpm preview:cf` | Serve `out/` + `functions/` locally the way Cloudflare Pages does (port 8788) |
| `pnpm typecheck` / `pnpm lint` | TS (app + Pages Function) / ESLint |
| `pnpm test:e2e` | Playwright (starts `wrangler pages dev` itself; run `pnpm build` first) |
| `pnpm lhci` | Lighthouse CI against `out/` |
| `pnpm extract:reference [--only=screens,tokens,hero]` | M1: snapshot of the design reference into `docs/design-reference/` |
| `pnpm prepare:hero` | M1: web variants of the hero loop + posters into `public/media/hero/` |
| `pnpm check:placeholders` | Fails if `[Company legal name]`-style placeholders remain |

pnpm ≥ 11 enforces a minimum release age for dependencies; build scripts are allowed only for `esbuild`, `workerd`, `sharp` (`pnpm-workspace.yaml`).

## Layout

```
src/app/[lang]/        routes (root layout lives here; EN/RU via generateStaticParams)
src/app/global-not-found.tsx   site-wide 404 (needed because the root layout is under [lang])
src/lib/               i18n, routes, brand palettes
src/styles/            tokens.css (from the reference) + globals.css (Tailwind theme)
functions/index.ts     "/" → /en/ or /ru/ by Accept-Language (302, Vary)
public/_headers        security headers, CSP, noindex on *.pages.dev
docs/design-reference/ screenshots, tokens.json, hero masters
scripts/               extract-reference, prepare-hero-media, check-placeholders
tests/                 Playwright
```

## CI

`.github/workflows/ci.yml`: install → typecheck → lint → check-placeholders (main only) → build → Playwright → Lighthouse → deploy.
Deploy needs repo variable `CF_PAGES_PROJECT` and secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`; without them the deploy job is skipped.
