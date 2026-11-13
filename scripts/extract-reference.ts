/**
 * M1 — snapshot of the design reference (PRD §4.3.1).
 *
 *   pnpm extract:reference                 # everything
 *   pnpm extract:reference --only=screens  # screens | tokens | hero (comma-separated)
 *
 * Output: docs/design-reference/
 *   screenshots/{1440,768,390}/*.jpg   full page + one shot per section
 *   tokens.json                        computed styles, :root vars, fonts, keyframes, motion
 *   media/hero-canvas.json             what the hero background actually is + overlays
 *   media/raw/{desktop,mobile}/*.png   frame-by-frame capture of the hero canvas (gitignored)
 *   media/hero-{desktop,mobile}-master.mp4  near-lossless seamless loop built from the frames
 *
 * The reference hero is NOT a <video>: it is a Three.js scene in a <canvas>. To satisfy PRD §7.1
 * (hero video with poster, pause, reduced-motion fallback) without shipping three.js, the canvas is
 * rendered deterministically under Playwright's fake clock and encoded into a looping video.
 * Rights for this footage are open question Q9 — keep it on preview deploys until confirmed.
 */
import { chromium, type Browser, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const REF_URL = 'https://qronos-ai-agent-scheduler-template-v1.21st.app/';
const OUT = join(process.cwd(), 'docs/design-reference');
const WIDTHS = [1440, 768, 390] as const;
const HEIGHTS: Record<number, number> = { 1440: 900, 768: 1024, 390: 844 };

const SECTIONS = [
  { name: '00-header', selector: 'header' },
  { name: '01-hero', selector: 'main > section:nth-of-type(1)' },
  { name: '02-stateful-execution', selector: '#features' },
  { name: '03-durable-autonomy-bento', selector: '#how-it-works' },
  { name: '04-insights-dashboard', selector: '#insights' },
  { name: '05-pricing-columns', selector: '#pricing' },
  { name: '06-testimonials', selector: '#customers' },
  { name: '07-final-cta', selector: 'main > section:last-of-type' },
  { name: '08-footer', selector: 'footer' },
  { name: '09-section-divider', selector: 'main > div.h-10' },
] as const;

const only = (process.argv.find((a) => a.startsWith('--only='))?.slice(7) ?? 'screens,tokens,hero').split(',');

const log = (...a: unknown[]) => console.log('[extract]', ...a);

/** tsx/esbuild wraps named functions in `__name(...)`; that helper doesn't exist inside the page. */
async function newContext(browser: Browser, opts: Parameters<Browser['newContext']>[0]) {
  const ctx = await browser.newContext(opts);
  await ctx.addInitScript({ content: 'globalThis.__name = (f) => f;' });
  return ctx;
}

async function slowScroll(page: Page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.45);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 180));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 800));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 1200));
  });
}

// ---------------------------------------------------------------- screenshots

async function screens(browser: Browser) {
  for (const width of WIDTHS) {
    const dir = join(OUT, 'screenshots', String(width));
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    const ctx = await newContext(browser, { viewport: { width, height: HEIGHTS[width]! }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(REF_URL, { waitUntil: 'networkidle' });
    // first screen exactly as a visitor sees it (header included), after the hero intro settles
    await page.waitForTimeout(2500);
    await page.screenshot({ path: join(dir, 'viewport.jpg'), type: 'jpeg', quality: 85 });
    await slowScroll(page);
    await page.screenshot({ path: join(dir, 'full.jpg'), fullPage: true, type: 'jpeg', quality: 85 });

    for (const s of SECTIONS) {
      const loc = page.locator(s.selector).first();
      if (!(await loc.count())) {
        log(`  ${width}: section ${s.name} not found`);
        continue;
      }
      const hideHeader = s.name !== '00-header';
      await page.evaluate((hide) => {
        document.getElementById('__hide-header')?.remove();
        if (hide) {
          const st = document.createElement('style');
          st.id = '__hide-header';
          st.textContent = 'header{visibility:hidden!important}';
          document.head.append(st);
        }
      }, hideHeader);
      await loc.scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
      await loc.screenshot({ path: join(dir, `${s.name}.jpg`), type: 'jpeg', quality: 85 });
    }
    log(`screens ${width}px done`);
    await ctx.close();
  }
}

// ---------------------------------------------------------------- tokens

/** Runs in the page. Kept dependency-free and self-contained. */
function collectInPage() {
  const PROPS = [
    'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-transform', 'color',
    'background-color', 'background-image', 'border-top-width', 'border-top-style', 'border-top-color',
    'border-radius', 'box-shadow', 'padding', 'max-width', 'backdrop-filter', 'opacity', 'transition',
    'animation', 'mix-blend-mode', 'mask-image', 'filter', 'text-wrap',
  ];
  const DEFAULTS: Record<string, string> = {
    'background-image': 'none', 'box-shadow': 'none', 'backdrop-filter': 'none', 'opacity': '1',
    'animation': 'none 0s ease 0s 1 normal none running', 'mix-blend-mode': 'normal', 'mask-image': 'none',
    'filter': 'none', 'border-top-width': '0px', 'border-top-style': 'none', 'max-width': 'none',
    'transition': 'all', 'letter-spacing': 'normal', 'text-transform': 'none', 'background-color': 'rgba(0, 0, 0, 0)',
    'border-radius': '0px', 'padding': '0px', 'text-wrap': 'wrap',
  };
  const short = (el: Element) => {
    const c = typeof (el as HTMLElement).className === 'string' ? (el as HTMLElement).className : '';
    return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${c ? '.' + c.trim().split(/\s+/).slice(0, 6).join('.') : ''}`;
  };
  const pick = (el: Element) => {
    const cs = getComputedStyle(el);
    const o: Record<string, unknown> = {};
    for (const p of PROPS) {
      const v = cs.getPropertyValue(p);
      if (v && DEFAULTS[p] !== v && !(p === 'transition' && v.startsWith('all 0s'))) o[p] = v;
    }
    const r = el.getBoundingClientRect();
    o._size = `${Math.round(r.width)}x${Math.round(r.height)}`;
    o._text = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90);
    o._el = short(el);
    o._class = typeof (el as HTMLElement).className === 'string' ? (el as HTMLElement).className : '';
    return o;
  };
  const first = (sel: string) => {
    const el = document.querySelector(sel);
    return el ? pick(el) : null;
  };

  const hero = document.querySelector('main > section');
  const heroButtons = hero ? [...hero.querySelectorAll('button')] : [];
  const named = {
    body: first('body'),
    main: first('main'),
    header: first('header'),
    headerNav: first('header nav'),
    navLink: first('header nav a[href^="#"]'),
    headerCta: first('header nav button'),
    h1: first('h1'),
    h1Line1: first('h1 > span:nth-child(1)'),
    h1Line2: first('h1 > span:nth-child(2)'),
    heroSubtitle: hero ? (hero.querySelector('p') ? pick(hero.querySelector('p')!) : null) : null,
    heroCtaPrimary: heroButtons[0] ? pick(heroButtons[0]) : null,
    heroCtaSecondary: heroButtons[1] ? pick(heroButtons[1]) : null,
    frameLines: first('main > div[aria-hidden="true"]'),
    sectionDivider: first('main > div.h-10'),
    footer: first('footer'),
  };

  // Every heading on the page, by tag
  const headings: Record<string, unknown[]> = {};
  for (const tag of ['h1', 'h2', 'h3', 'h4']) headings[tag] = [...document.querySelectorAll(tag)].map(pick);

  // Text style catalogue: unique typographic signatures among elements that own text
  const textSig = new Map<string, { count: number; sample: Record<string, unknown> }>();
  const boxSig = new Map<string, { count: number; sample: Record<string, unknown> }>();
  for (const el of document.querySelectorAll('main *')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim());
    if (ownText) {
      const k = ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-transform', 'color']
        .map((p) => cs.getPropertyValue(p)).join('|');
      const e = textSig.get(k);
      if (e) e.count++;
      else textSig.set(k, { count: 1, sample: pick(el) });
    }
    const r = el.getBoundingClientRect();
    const decorated = cs.borderTopWidth !== '0px' || cs.boxShadow !== 'none' || cs.backgroundImage !== 'none'
      || (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') || cs.backdropFilter !== 'none';
    if (decorated && r.width * r.height > 1600) {
      const k = ['background-color', 'background-image', 'border-top-width', 'border-top-color', 'border-radius', 'box-shadow', 'backdrop-filter']
        .map((p) => cs.getPropertyValue(p)).join('|');
      const e = boxSig.get(k);
      if (e) e.count++;
      else boxSig.set(k, { count: 1, sample: pick(el) });
    }
  }
  const byCount = (m: Map<string, { count: number; sample: Record<string, unknown> }>) =>
    [...m.values()].sort((a, b) => b.count - a.count).map((v) => ({ count: v.count, ...v.sample }));

  // Section-level layout
  const sections = [...document.querySelectorAll('main > section, main > footer')].map((s) => {
    const inner = s.querySelector(':scope > div');
    return { ...pick(s), inner: inner ? pick(inner) : null };
  });

  return {
    url: location.href,
    viewport: `${innerWidth}x${innerHeight}`,
    named,
    headings,
    textStyles: byCount(textSig),
    surfaces: byCount(boxSig).slice(0, 80),
    sections,
  };
}

function collectStylesheets() {
  const rootVars: Record<string, Record<string, string>> = {};
  const keyframes: Record<string, string> = {};
  const fontFaces: string[] = [];
  const media = new Set<string>();
  const properties: string[] = [];
  const walk = (rules: CSSRuleList, ctx: string) => {
    for (const r of rules) {
      if (r instanceof CSSStyleRule) {
        if (/(^|,)\s*(:root|:host|html|\.dark)\b/.test(r.selectorText)) {
          const key = (ctx ? ctx + ' ' : '') + r.selectorText;
          for (let i = 0; i < r.style.length; i++) {
            const p = r.style[i]!;
            if (p.startsWith('--')) (rootVars[key] ??= {})[p] = r.style.getPropertyValue(p).trim();
          }
        }
        if (r.cssRules?.length) walk(r.cssRules, ctx);
      } else if (r instanceof CSSKeyframesRule) {
        keyframes[r.name] = r.cssText;
      } else if (r instanceof CSSFontFaceRule) {
        fontFaces.push(r.cssText);
      } else if (r instanceof CSSMediaRule) {
        media.add(r.conditionText);
        walk(r.cssRules, `@media ${r.conditionText}`);
      } else if (typeof CSSPropertyRule !== 'undefined' && r instanceof CSSPropertyRule) {
        properties.push(r.cssText);
      } else if ('cssRules' in r && (r as CSSGroupingRule).cssRules) {
        walk((r as CSSGroupingRule).cssRules, ctx);
      }
    }
  };
  for (const s of document.styleSheets) {
    try {
      walk(s.cssRules, '');
    } catch {
      /* cross-origin sheet */
    }
  }
  const loadedFonts = [...document.fonts].map((f) => ({ family: f.family, weight: f.weight, style: f.style, status: f.status, unicodeRange: f.unicodeRange }));
  return { rootVars, keyframes, fontFaces, mediaQueries: [...media].sort(), propertyRules: properties, loadedFonts };
}

async function renderedFonts(page: Page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const out: Record<string, unknown> = {};
  for (const [name, sel] of Object.entries({
    h1: 'h1 span',
    h2: 'h2',
    h3: 'h3',
    body: 'main p',
    navLink: 'header nav a[href^="#"]',
    button: 'main section button span',
    footer: 'footer p',
  })) {
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: sel });
    if (!nodeId) continue;
    try {
      const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
      out[name] = fonts;
    } catch (e) {
      out[name] = String(e);
    }
  }
  await cdp.detach();
  return out;
}

/** Records class/style mutations and running animations while scrolling (reveal-on-scroll parameters). */
async function collectMotion(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { __motion: unknown[]; __anims: Map<string, unknown> };
    w.__motion = [];
    w.__anims = new Map();
    const t0 = performance.now();
    const path = (el: Element) => {
      const c = typeof (el as HTMLElement).className === 'string' ? (el as HTMLElement).className : '';
      return `${el.tagName.toLowerCase()}.${c.split(/\s+/).slice(0, 4).join('.')}`;
    };
    new MutationObserver((recs) => {
      for (const r of recs) {
        const el = r.target as Element;
        const cs = getComputedStyle(el);
        const before = (r.oldValue || '').split(/\s+/);
        const nowCls = typeof (el as HTMLElement).className === 'string' ? (el as HTMLElement).className.split(/\s+/) : [];
        w.__motion.push({
          t: Math.round(performance.now() - t0),
          attr: r.attributeName,
          el: path(el),
          removed: r.attributeName === 'class' ? before.filter((c) => c && !nowCls.includes(c)) : undefined,
          added: r.attributeName === 'class' ? nowCls.filter((c) => c && !before.includes(c)) : undefined,
          styleBefore: r.attributeName === 'style' ? r.oldValue : undefined,
          styleAfter: r.attributeName === 'style' ? el.getAttribute('style') : undefined,
          transition: `${cs.transitionProperty} ${cs.transitionDuration} ${cs.transitionTimingFunction} ${cs.transitionDelay}`,
        });
      }
    }).observe(document.querySelector('main')!, { subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class', 'style'] });
    const sample = () => {
      for (const a of document.getAnimations()) {
        const timing = a.effect?.getComputedTiming();
        const target = (a.effect as KeyframeEffect | null)?.target;
        const name = (a as CSSAnimation).animationName ?? (a as CSSTransition).transitionProperty ?? 'waapi';
        const key = `${a.constructor.name}|${name}|${timing?.duration}|${timing?.easing}|${timing?.delay}`;
        if (!w.__anims.has(key))
          w.__anims.set(key, {
            kind: a.constructor.name, name, duration: timing?.duration, delay: timing?.delay, easing: timing?.easing,
            iterations: timing?.iterations, direction: timing?.direction, target: target ? path(target) : null,
          });
      }
    };
    setInterval(sample, 120);
  });
  await slowScroll(page);
  return page.evaluate(() => {
    const w = window as unknown as { __motion: Record<string, unknown>[]; __anims: Map<string, unknown> };
    // Group class toggles: "removed → added @ transition"
    const groups = new Map<string, { count: number; example: unknown }>();
    const styleEls = new Map<string, { count: number; first: unknown; last: unknown; tFirst: number; tLast: number }>();
    for (const m of w.__motion) {
      if (m.attr === 'class') {
        const k = `${(m.removed as string[]).join(' ')} → ${(m.added as string[]).join(' ')} @ ${m.transition}`;
        const g = groups.get(k);
        if (g) g.count++;
        else groups.set(k, { count: 1, example: m.el });
      } else {
        const k = m.el as string;
        const e = styleEls.get(k);
        if (e) {
          e.count++;
          e.last = m.styleAfter;
          e.tLast = m.t as number;
        } else styleEls.set(k, { count: 1, first: m.styleBefore, last: m.styleAfter, tFirst: m.t as number, tLast: m.t as number });
      }
    }
    return {
      classToggles: [...groups.entries()].map(([k, v]) => ({ change: k, ...v })).sort((a, b) => b.count - a.count).slice(0, 60),
      inlineStyleAnimations: [...styleEls.entries()].map(([el, v]) => ({ el, ...v, span: v.tLast - v.tFirst }))
        .sort((a, b) => b.count - a.count).slice(0, 40),
      runningAnimations: [...w.__anims.values()],
    };
  });
}

async function tokens(browser: Browser) {
  const result: Record<string, unknown> = {
    source: REF_URL,
    capturedAt: new Date().toISOString(),
    note: 'Computed styles of the design reference. Source of truth for visuals is screenshots/. Texts, logos, metrics are NOT to be reused (PRD §0).',
    byWidth: {} as Record<number, unknown>,
  };
  for (const width of WIDTHS) {
    const ctx = await newContext(browser, { viewport: { width, height: HEIGHTS[width]! }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(REF_URL, { waitUntil: 'networkidle' });
    if (width === 1440) {
      result.motion = await collectMotion(page);
      result.stylesheets = await page.evaluate(collectStylesheets);
      result.renderedFonts = await renderedFonts(page);
    } else {
      await slowScroll(page);
    }
    (result.byWidth as Record<number, unknown>)[width] = await page.evaluate(collectInPage);
    log(`tokens ${width}px done`);
    await ctx.close();
  }
  writeFileSync(join(OUT, 'tokens.json'), JSON.stringify(result, null, 2));
}

// ---------------------------------------------------------------- hero

const HERO_FPS = 30;
const HERO_LOOP_S = 12; // seamless loop length
const HERO_XFADE_S = 1; // crossfade used to close the loop
const HERO_WARMUP_S = 6; // the scene zooms in during the first ~5 s; skip it

const HERO_VARIANTS = [
  // canvas box is max-w-[1344px]; 1344×896 CSS @ 10/7 DPR → 1920×1280
  { name: 'desktop', viewport: { width: 1440, height: 896 }, dpr: 10 / 7 },
  // below `sm` the canvas box is full width; 360×780 @2 → 720×1560
  { name: 'mobile', viewport: { width: 360, height: 780 }, dpr: 2 },
] as const;

async function heroInfo(page: Page) {
  return page.evaluate(() => {
    const hero = document.querySelector('main > section')!;
    const box = hero.querySelector(':scope > div')!;
    const canvas = box.querySelector('canvas');
    const layers = [...box.children].map((el) => {
      const cs = getComputedStyle(el);
      return {
        class: (el as HTMLElement).className,
        style: el.getAttribute('style'),
        backgroundImage: cs.backgroundImage,
        backgroundColor: cs.backgroundColor,
        opacity: cs.opacity,
        mixBlendMode: cs.mixBlendMode,
      };
    });
    return {
      kind: canvas ? 'webgl-canvas (three.js)' : 'unknown',
      videoSources: [...hero.querySelectorAll('video source, video[src]')].map((v) => v.getAttribute('src')),
      container: { class: (box as HTMLElement).className, rect: box.getBoundingClientRect().toJSON() },
      canvas: canvas ? { width: canvas.width, height: canvas.height, css: canvas.getBoundingClientRect().toJSON() } : null,
      layers,
      sceneProps: {
        background: '#000000',
        lineOptions: { color: '#ffffff', glow: 10 },
        dotOptions: { color: '#ffffff', glow: 10 },
        cometOptions: { color: '#eca8d6', glow: 6 },
        repel: true,
        note: 'Props passed by HeroSection to the canvas component (read from the reference JS bundle). Intro: zoom/fade over the first ~5 s; cursor repels lines.',
      },
    };
  });
}

async function hero(browser: Browser) {
  const mediaDir = join(OUT, 'media');
  mkdirSync(mediaDir, { recursive: true });
  const totalFrames = (HERO_LOOP_S + HERO_XFADE_S) * HERO_FPS;

  for (const v of HERO_VARIANTS) {
    const framesDir = join(mediaDir, 'raw', v.name);
    rmSync(framesDir, { recursive: true, force: true });
    mkdirSync(framesDir, { recursive: true });
    const ctx = await newContext(browser, { viewport: v.viewport, deviceScaleFactor: v.dpr, reducedMotion: 'no-preference' });
    const page = await ctx.newPage();
    await page.clock.install();
    await page.goto(REF_URL, { waitUntil: 'load' });
    await page.waitForSelector('main > section canvas');
    if (v.name === 'desktop') writeFileSync(join(mediaDir, 'hero-canvas.json'), JSON.stringify(await heroInfo(page), null, 2));

    // Show only the canvas: hide header, text, overlays, frame lines.
    await page.addStyleTag({
      content: `
        header, main > div[aria-hidden="true"] { display: none !important; }
        main > section:first-of-type > :not(:first-child) { visibility: hidden !important; }
        main > section:first-of-type > :first-child > :not(:first-child) { display: none !important; }
      `,
    });
    await page.clock.pauseAt(Date.now() + 500);
    await page.clock.runFor(HERO_WARMUP_S * 1000);

    const box = await page.locator('main > section:first-of-type > div:first-child').boundingBox();
    if (!box) throw new Error('hero canvas box not found');
    const clip = { x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height) };
    log(`hero ${v.name}: clip ${clip.width}x${clip.height} css @${v.dpr.toFixed(3)}x, ${totalFrames} frames`);

    let prev = 0;
    for (let i = 0; i < totalFrames; i++) {
      const target = Math.round(((i + 1) * 1000) / HERO_FPS);
      await page.clock.runFor(target - prev);
      prev = target;
      await page.screenshot({ path: join(framesDir, `f${String(i).padStart(5, '0')}.png`), clip, animations: 'allow', scale: 'device' });
      if (i % 60 === 0) log(`  frame ${i}/${totalFrames}`);
    }
    await ctx.close();

    // Seamless loop: frames [X, X+L) where the last X frames crossfade into frames [0, X).
    const X = HERO_XFADE_S * HERO_FPS;
    const L = HERO_LOOP_S * HERO_FPS;
    const out = join(mediaDir, `hero-${v.name}-master.mp4`);
    execFileSync('ffmpeg', [
      '-y', '-loglevel', 'error', '-framerate', String(HERO_FPS), '-i', join(framesDir, 'f%05d.png'),
      '-filter_complex',
      `[0:v]split[a][b];` +
      `[a]trim=start_frame=${X}:end_frame=${X + L},setpts=PTS-STARTPTS[main];` +
      `[b]trim=start_frame=0:end_frame=${X},setpts=PTS-STARTPTS[head];` +
      `[main][head]xfade=transition=fade:duration=${HERO_XFADE_S}:offset=${HERO_LOOP_S - HERO_XFADE_S},` +
      `trim=end_frame=${L},scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p[v]`,
      '-map', '[v]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-an', '-movflags', '+faststart', out,
    ]);
    log(`hero ${v.name}: ${out}`);
  }
}

// ---------------------------------------------------------------- main

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ args: ['--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
  try {
    if (only.includes('screens')) await screens(browser);
    if (only.includes('tokens')) await tokens(browser);
    if (only.includes('hero')) await hero(browser);
  } finally {
    await browser.close();
  }
  if (!existsSync(join(OUT, 'tokens.json')) && only.includes('tokens')) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
