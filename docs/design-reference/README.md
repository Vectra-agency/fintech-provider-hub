# Design reference snapshot

Source: https://qronos-ai-agent-scheduler-template-v1.21st.app/ — captured 2026-11-13 with `pnpm extract:reference`.
Only the visual language is reused. Texts, the Qronos name/logo, marquee logos, testimonials, pricing, metrics, images and the "All systems operational" line are **not** (PRD §0).

| Path | Content |
|---|---|
| `screenshots/{1440,768,390}/` | `viewport.jpg` (first screen), `full.jpg`, one file per section (`00-header` … `09-section-divider`) |
| `tokens.json` | computed styles per width, `:root` variables, keyframes, media queries, motion log, actually rendered fonts |
| `media/hero-canvas.json` | what the hero background is, its container and overlay layers |
| `media/hero-{desktop,mobile}-master.mp4` | near-lossless seamless loop rendered from the hero canvas (source for `pnpm prepare:hero`); 45–70 MB each, gitignored — regenerate or move to Git LFS |
| `media/raw/` | per-frame PNGs (gitignored, regenerate with `--only=hero`) |

## Findings that differ from PRD assumptions

1. **The hero is not a video.** It is a Three.js scene in a `<canvas>`: a rotating twisted hyperboloid of white lines with glowing dots and pink comets (`#eca8d6`), a ~5 s zoom-in intro and cursor repel. There is no file to download.
   To keep PRD §7.1 (video + poster + pause + reduced-motion) and the JS budget (three.js alone is ~150 KB gz), the canvas is rendered frame-by-frame under Playwright's fake clock (deterministic, no dropped frames), intro skipped, and closed into a 12 s loop with a 1 s crossfade. Canvas box: `max-w-[1344px]`, full hero height; overlays are CSS (`--hero-overlay-x`, `--hero-overlay-y` in `src/styles/tokens.css`). Cursor repel is lost in a video.
   Rights: still **Q9** — the footage is a rendering of the template's code. Production builds (`main`) set `NEXT_PUBLIC_HERO_MEDIA=off` and strip `out/media/hero` until Q9 is closed.
   Web files (`pnpm prepare:hero`): desktop 1920×1280 MP4 3.7 MB / WebM 3.0 MB, mobile 720×1560 MP4 1.4 MB / WebM 1.1 MB, posters AVIF 76 KB (WebP fallback 77–78 KB at reduced size). Seam check: PSNR last→first frame 22.7 dB vs 26.0 dB between neighbours mid-loop.
2. **Fonts.** Display face is declared as `"Google Sans", sans-serif` but never loaded (no `@font-face`), so visitors see the fallback — Helvetica on macOS (`renderedFonts` in `tokens.json`), Arial on Windows. Screenshots therefore show Helvetica. Body text is the system stack (`system-ui, -apple-system, Segoe UI…`).
   We self-host **Google Sans** via `next/font/google` (it is on Google Fonts now, variable 400–700, has Cyrillic) → **Q11 closed**. Body stays on the system stack, which has Cyrillic everywhere.
3. **Q12.** The template's original sources are not public, but the deployed markup is plain Tailwind utility classes, which give exact values (spacing, radii, gradients, durations). Components are rebuilt from those classes plus screenshots.

## Key values (details in `src/styles/tokens.css`)

- Colours: background `#000101`, foreground `#ecebe7`, muted text `#757168` (second part of H2), hairlines `white/9%`, frame border `#37333b`, frame fill `linear-gradient(145deg, #131315fa, #070708fa)`.
- Type: H1 Google Sans 400, `clamp(2rem, 4.6vw, 4.5rem)`, leading .92, tracking -0.025em, 2nd line gradient white→zinc-300→zinc-500. H2 37→48px (lg), leading .95, tracking -0.025em. H3 30→36px. Lead paragraph 20px/1.625 muted. UI 12–14px system font; mono labels 8–9px uppercase.
- Layout: frame lines `max-w 1400px` (two hairlines each side, 8px apart); header/hero/dividers `max-w 1344px`, `lg:w-[calc(100%-3.5rem)]`; section inner `max-w 1400px px-[15px] lg:px-14`; section padding `py-24 lg:py-32`; header fixed `top-3`, `h-12`, transparent → `bg-background/80 backdrop-blur-xl` on scroll.
- Breakpoints: 390px, 40rem, 48rem, 64rem, 80rem, 96rem (Tailwind defaults + `min-[390px]`).
- Motion: reveal = `opacity 0→1` + `translateY(1rem|2rem)→0`, `1s` (`0.7s` small), `cubic-bezier(.4,0,.2,1)`, delays 150/200/300/500 ms; header colour swap 300–500 ms; marquee 80 s linear (hover slows to 25 s); "star" border light on the outline CTA: `offset-path` loop 3 s linear.
- Buttons: outline pill (1px `slate-200/50`, black fill, moving light on border, `»` icon) and solid white pill (black text, inner top highlight). Labels uppercase by CSS.
