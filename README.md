# Fintech Provider Hub — website

Static bilingual (EN/RU) marketing site. Spec: [PRD.md](PRD.md). Content reference: [docs/design-reference/prototype/index.html](docs/design-reference/prototype/index.html). Design reference snapshot: [docs/design-reference/](docs/design-reference/README.md).

Next.js 16 (App Router, `output: 'export'`) · Tailwind CSS v4 · TypeScript strict · Cloudflare Pages (+ one Pages Function on `/`).

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Static export to `out/` + CSP finalisation (`connect-src` += analytics origin) |
| `pnpm build:prod` | `check:placeholders` + build — the release gate (PRD §9.6) |
| `pnpm preview:cf` | Serve `out/` + `functions/` the way Cloudflare Pages does (port 8788) |
| `pnpm typecheck` / `pnpm lint` | route types + TS (app and Pages Function) / ESLint |
| `pnpm check:headings` | Every dictionary string vs the prototype; two-part headings join back to the original; metaDesc rules |
| `pnpm check:placeholders` | Fails while `[Company legal name]`-style placeholders or "to be published" remain |
| `pnpm check:js-budget` | ≤ 150 KB gz JS per page (PRD §12) |
| `pnpm test:e2e` | Playwright + axe (starts `wrangler pages dev` itself; run `pnpm build` first) |
| `pnpm lhci` | Lighthouse CI against `out/` (mobile) |
| `pnpm extract:reference [--only=screens,tokens,hero]` | Snapshot of the design reference into `docs/design-reference/` |
| `pnpm prepare:hero [--posters-only]` | Web variants of the hero loop + posters into `public/media/hero/` |
| `pnpm make:brand-assets` | `logo-512.png`, `apple-touch-icon.png`, `og/{en,ru}.png` from our logo |

pnpm ≥ 11 enforces a minimum release age for dependencies; build scripts are allowed only for `esbuild`, `workerd`, `sharp` (`pnpm-workspace.yaml`).

## Build-time configuration

| Variable | Purpose | Open question |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical/hreflang/sitemap/OG/JSON-LD base. Fallback `https://fintech-provider-hub.pages.dev` | Q3 |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | `plausible` or `umami`; unset → events go to `window.dataLayer` only | Q2 |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | Provider API origin (also added to CSP `connect-src`) | Q2 |
| `NEXT_PUBLIC_ANALYTICS_SITE` | Plausible domain / Umami website id | Q2 |
| `NEXT_PUBLIC_HERO_MEDIA` | `off` removes the hero loop and posters (production until Q9 is closed) | Q9 |

Analytics adapters call the providers' HTTP APIs directly — no third-party script, no cookies.

## Layout

```
src/app/[lang]/            routes; the root layout lives here (EN/RU via generateStaticParams)
src/app/global-not-found.tsx  one static 404 for both languages (language from the path prefix)
src/content/               en.ts, ru.ts (prototype T), screens.ts (SS), admin.ts (ADM), types.ts,
                           meta.ts (metaDesc), added-strings.ts (UI strings not in the prototype)
src/components/
  layout/                  Header (island), Footer, FrameLines, SkipLink, RevealObserver, AnalyticsListener
  hero/                    HeroBackground + HeroVideo (island)
  patterns/                PageHero (P1b), ShowcaseTabs (P4), Marquee (P2), LeadBlock (P8 island)
  sections/                home sections, LeadSection, shared blocks, StackPipeline
  mockups/                 Phone + screens (prototype HTML builders), widgets, AdminShell, ScaleToFit, BrandSwitcher
  ui/                      Button, TwoPartHeading, Pill, Frame, Bits, icons, Logo
src/styles/                tokens.css (from the reference), globals/chrome/components/mockups.css
functions/index.ts         "/" → /en/ or /ru/ by Accept-Language (302, Vary)
public/_headers            security headers, CSP, noindex on *.pages.dev
scripts/                   extract-reference, prepare-hero-media, make-brand-assets, check-*, finalize-headers
tests/                     Playwright: smoke, navigation, home, a11y (axe), external requests
```

## Deviations from the PRD (agreed or forced)

- The reference hero is a Three.js canvas, not a video. It is rendered frame-by-frame into a seamless loop (approved). Production builds ship without it until Q9.
- 404 is `app/global-not-found.tsx` (the root layout sits under `[lang]`, so `app/not-found.tsx` can't wrap it).
- Fonts: the reference declares Google Sans but never loads it (visitors see Helvetica/Arial). We self-host Google Sans (has Cyrillic → Q11 closed); body text stays on the system stack. A size-matched fallback face keeps CLS at 0.
- Contrast: the reference muted grey (#757168, 4.3:1) and white/40 text fail WCAG AA; lifted to #837f76 and white/55.
- Showcase tabs: the active tab's details sit under the numbered list (a tab panel can't live inside a `tablist`).
- Prototype is at `docs/design-reference/prototype/` (PRD says `docs/prototype/`).

## Release blockers

`pnpm check:placeholders` lists them; currently: company legal data (Q1), privacy/terms dates and analytics provider name (Q2, Q8). Also required: production domain (Q3), template/footage licence (Q9), manual pass in the Telegram in-app browser on iOS and Android (navigation, video autoplay, copy fallback, opening Telegram).

## CI

`.github/workflows/ci.yml`: install → typecheck → lint → check-headings → check-placeholders (main only) → build → JS budget → Playwright + axe → Lighthouse → deploy.
Deploy needs repo variable `CF_PAGES_PROJECT` and secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`; without them the deploy job is skipped. Optional repo variables: `SITE_URL`, `ANALYTICS_PROVIDER`, `ANALYTICS_ENDPOINT`, `ANALYTICS_SITE`.
