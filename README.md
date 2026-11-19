# Fintech Provider Hub — website

Static bilingual (EN/RU) marketing site. Spec: [PRD.md](PRD.md). Content reference: [docs/design-reference/prototype/index.html](docs/design-reference/prototype/index.html). Design reference snapshot: [docs/design-reference/](docs/design-reference/README.md).

Next.js 16 (App Router, `output: 'export'`) · Tailwind CSS v4 · TypeScript strict · Cloudflare Pages (fully static).

**URLs:** English is the default at the root without a prefix (`/`, `/wallet/`, …), Russian under `/ru/` (`/ru/`, `/ru/wallet/`, …). Old `/en/…` URLs redirect 301 to the unprefixed pages (`public/_redirects`).

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Static export to `out/` + CSP finalisation (`connect-src` += analytics origin) |
| `pnpm build:prod` | `check:placeholders` + build — the release gate (PRD §9.6) |
| `pnpm preview:cf` | Serve `out/` with `_redirects`/`_headers` the way Cloudflare Pages does (port 8788) |
| `pnpm typecheck` / `pnpm lint` | route types + TS / ESLint |
| `pnpm check:content` | EN/RU dictionaries have the same keys; two-part headings are clean; meta descriptions ≤ 160 chars; no "Hong Kong" outside the footer/legal pages; no "админка" in Russian |
| `pnpm check:placeholders` | Fails while `[Company legal name]`-style placeholders or "to be published" remain |
| `pnpm check:js-budget` | ≤ 150 KB gz JS per page (PRD §12) |
| `pnpm test:e2e` | Playwright + axe (starts `wrangler pages dev` itself; run `pnpm build` first) |
| `pnpm lhci` | Lighthouse CI against `out/` (mobile) |
| `pnpm extract:reference [--only=screens,tokens,hero]` | Snapshot of the design reference into `docs/design-reference/` |
| `pnpm make:brand-assets` | `logo-512.png`, `apple-touch-icon.png`, `og/{en,ru}.png` from our logo |

pnpm ≥ 11 enforces a minimum release age for dependencies; build scripts are allowed only for `esbuild`, `workerd`, `sharp` (`pnpm-workspace.yaml`).

## Build-time configuration

| Variable | Purpose | Open question |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical/hreflang/sitemap/OG/JSON-LD base. Fallback `https://fintech-provider-hub.pages.dev` | Q3 |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | `plausible` or `umami`; unset → events go to `window.dataLayer` only | Q2 |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | Provider API origin (also added to CSP `connect-src`) | Q2 |
| `NEXT_PUBLIC_ANALYTICS_SITE` | Plausible domain / Umami website id | Q2 |

Analytics adapters call the providers' HTTP APIs directly — no third-party script, no cookies.

## Layout

```
src/app/(en)/              English routes at the root (route group, own root layout)
src/app/ru/                Russian routes under /ru/ (own root layout)
src/app/global-not-found.tsx  one static 404 for both languages (/ru/… → RU, else EN)
src/views/                 page components shared by both route trees (<WalletPage lang="en" /> …)
src/content/               en.ts, ru.ts (site copy), screens.ts (SS), admin.ts (ADM), types.ts,
                           meta.ts (metaDesc), added-strings.ts (UI strings not in the prototype)
src/components/
  layout/                  SiteLayout (document shell), Header (island), Footer, FrameLines, SkipLink, RevealObserver, AnalyticsListener
  hero/                    HeroProduct: Parus home screen (ParusPhone) in front of its admin panel (greyscale)
  patterns/                PageHero (P1b), ShowcaseTabs (P4), Marquee (P2), LeadBlock (P8 island)
  sections/                home sections, LeadSection, shared blocks, StackPipeline
  mockups/                 Phone + screens (prototype HTML builders), widgets, AdminShell, ScaleToFit, BrandSwitcher
  ui/                      Button, TwoPartHeading, Pill, Frame, Bits, icons, Logo
src/styles/                tokens.css (from the reference), globals/chrome/components/mockups.css
public/_headers            security headers, CSP, noindex on *.pages.dev
public/_redirects          /en/* → unprefixed English pages (301)
scripts/                   extract-reference, prepare-hero-media, make-brand-assets, check-*, finalize-headers
tests/                     Playwright: smoke, navigation, home, a11y (axe), external requests
```

## Deviations from the PRD (agreed or forced)

- Home hero (2026-11-19): the reference's abstract canvas loop is gone. The hero shows the product: the Parus wallet home screen (paruspay.com, our product) in a phone in front, its admin panel behind in greyscale. Pure HTML/CSS, no video, so Q9 (footage licence) no longer applies. Inner pages have a plain dark hero.
- Copy (2026-11-19): the dictionaries are no longer verbatim prototype text; the owner edits them directly. Status pills (Included / Via partner / Add-on), solution-card tags and the "demo data" notes under mockups are removed; partner dependency is stated in the copy and the footer disclaimer, demo data in the Terms. Hong Kong is mentioned only in the footer and on the legal pages; Russian says "панель управления", not "админка".
- Frames: the reference's double hairlines (outer ring + inner card, paired page-frame lines, two-line section dividers) are reduced to one line. Action buttons keep theirs.
- URL scheme (decided 2026-11-14, replaces PRD §5): English at the root without a prefix, Russian under `/ru/`; no `Accept-Language` redirect on `/`, so the Pages Function is gone. `x-default` points to the English page. Two root layouts (`(en)` and `ru`), so switching languages is a full page load.
- 404 is `app/global-not-found.tsx` (with two root layouts there is no single layout for `app/not-found.tsx`).
- Fonts: the reference declares Google Sans but never loads it (visitors see Helvetica/Arial). We self-host Google Sans (has Cyrillic → Q11 closed); body text stays on the system stack. A size-matched fallback face keeps CLS at 0.
- Contrast: the reference muted grey (#757168, 4.3:1) and white/40 text fail WCAG AA; lifted to #837f76 and white/55.
- Showcase tabs: the active tab's details sit under the numbered list (a tab panel can't live inside a `tablist`).
- Prototype is at `docs/design-reference/prototype/` (PRD says `docs/prototype/`).

## Release blockers

`pnpm check:placeholders` lists them; currently: company legal data (Q1), privacy/terms dates and analytics provider name (Q2, Q8). Also required: production domain (Q3), manual pass in the Telegram in-app browser on iOS and Android (navigation, copy fallback, opening Telegram).

## CI

`.github/workflows/ci.yml`: install → typecheck → lint → check-content → check-placeholders (main only) → build → JS budget → Playwright + axe → Lighthouse → deploy.
Deploy needs repo variable `CF_PAGES_PROJECT` and secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`; without them the deploy job is skipped. Optional repo variables: `SITE_URL`, `ANALYTICS_PROVIDER`, `ANALYTICS_ENDPOINT`, `ANALYTICS_SITE`.
