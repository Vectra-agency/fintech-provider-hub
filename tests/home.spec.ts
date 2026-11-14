import { test, expect, type Page } from '@playwright/test';
import { getDict } from '../src/content';
import { PAGE_KEYS, pagePath } from '../src/lib/routes';
import { LANGS } from '../src/lib/i18n';

const en = getDict('en');
const dataLayer = (page: Page) => page.evaluate(() => (window.dataLayer ?? []) as Record<string, unknown>[]);

// Telegram links open a new tab; keep tests offline and fast.
test.beforeEach(async ({ context }) => {
  await context.route(/https:\/\/t\.me\/.*/, (r) => r.fulfill({ status: 200, body: 'telegram' }));
});

// PRD §13 scenario 4 — hero video
test.describe('hero video', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'headless WebKit has no H.264/VP9 decoding');

  test('autoplays muted, pause persists across reloads', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const video = page.locator('video');
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.muted && v.currentTime > 0.2), { timeout: 15_000 }).toBe(true);
    await page.getByRole('button', { name: 'Pause background video' }).click();
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    expect((await dataLayer(page)).some((e) => e.event === 'hero_video_toggle' && e.state === 'pause')).toBe(true);
    await page.reload();
    await expect(page.getByRole('button', { name: 'Play background video' })).toBeVisible();
    await expect(page.locator('video')).toHaveCount(0);
  });

  test('reduced motion: poster only', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.hero-bg picture img')).toBeVisible();
    await page.waitForTimeout(800);
    await expect(page.locator('video')).toHaveCount(0);
  });
});

// PRD §13 scenario 5 — marquee
test.describe('marquee', () => {
  test('animates, pauses on hover; duplicate list hidden from AT', async ({ page }) => {
    await page.goto('/');
    const track = page.locator('.marquee-track');
    expect(await track.evaluate((el) => getComputedStyle(el).animationName)).toBe('marquee');
    await page.locator('.marquee').hover();
    expect(await track.evaluate((el) => getComputedStyle(el).animationPlayState)).toBe('paused');
    await expect(page.locator('.marquee-dup')).toHaveAttribute('aria-hidden', 'true');
  });

  test('static with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    expect(await page.locator('.marquee-track').evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
    await expect(page.locator('.marquee-dup')).toBeHidden();
  });
});

// PRD §13 scenario 6 — showcase tabs
test('showcase tabs: mouse and keyboard', async ({ page }) => {
  await page.goto('/');
  const tabs = page.getByRole('tablist').getByRole('tab');
  await expect(tabs).toHaveCount(4);
  const labels = en.home.show.tabs.map((t) => t.label);

  await tabs.nth(2).click();
  await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText(en.home.show.tabs[2]!.title);

  await tabs.nth(2).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('tab', { name: labels[3] })).toBeFocused();
  await expect(tabs.nth(3)).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Home');
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(tabs.nth(3)).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowDown'); // wraps
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');

  // roving tabindex + one visible panel
  expect(await tabs.evaluateAll((els) => els.map((e) => e.getAttribute('tabindex')))).toEqual(['0', '-1', '-1', '-1']);
  await expect(page.locator('[role="tabpanel"]:not([hidden])')).toHaveCount(1);
  expect((await dataLayer(page)).filter((e) => e.event === 'tab_select').length).toBeGreaterThan(2);
});

// PRD §13 scenario 7 — brand switcher
test('brand switcher recolours mockups, persists across pages, no flash', async ({ page }) => {
  await page.goto('/');
  const phone = page.locator('.phone.brandable').first();
  const b1 = () => phone.evaluate((el) => getComputedStyle(el).getPropertyValue('--b1').trim().toUpperCase());
  expect(await b1()).toBe('#F04800');
  await page.getByRole('button', { name: en.home.brands.ocean }).first().click();
  await expect(page.locator('html')).toHaveAttribute('data-brand', 'ocean');
  expect(await b1()).toBe('#2F6BFF');
  await expect(page.getByRole('button', { name: en.home.brands.ocean }).first()).toHaveAttribute('aria-pressed', 'true');
  expect((await dataLayer(page)).some((e) => e.event === 'brand_preview' && e.brand === 'ocean')).toBe(true);

  // fixed (Projects teaser) mockups keep ember
  expect(await page.locator('.phone.br-ember').first().evaluate((el) => getComputedStyle(el).getPropertyValue('--b1').trim().toUpperCase())).toBe('#F04800');

  // next page: palette applied by the head script, before React hydrates (no colour flash)
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      (window as unknown as { __brandAtDCL: string | null }).__brandAtDCL = document.documentElement.getAttribute('data-brand');
    });
  });
  await page.goto('/ru/wallet/');
  expect(await page.evaluate(() => (window as unknown as { __brandAtDCL: string | null }).__brandAtDCL)).toBe('ocean');
});

// PRD §13 scenario 8 — lead block
test.describe('lead block', () => {
  test('chips, copy, Telegram link', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard permissions are Chromium-only in Playwright');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');
    const lead = page.locator('#lead');
    const ta = lead.locator('textarea');
    await expect(ta).toHaveValue(en.lead.tpl(en.lead.topics[0]!));
    await lead.getByRole('button', { name: en.lead.topics[2] }).click();
    await expect(lead.getByRole('button', { name: en.lead.topics[2] })).toHaveAttribute('aria-pressed', 'true');
    await expect(ta).toHaveValue(en.lead.tpl(en.lead.topics[2]!));

    await ta.fill('Hello from the test');
    await lead.getByRole('button', { name: en.lead.copy }).click();
    await expect(lead.getByRole('status')).toHaveText(`${en.lead.copied} ✓`);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('Hello from the test');
    expect((await dataLayer(page)).some((e) => e.event === 'copy_message' && e.topic === 'payments')).toBe(true);

    const open = lead.getByRole('link', { name: en.lead.open });
    await expect(open).toHaveAttribute('href', 'https://t.me/fintechprovider');
    await expect(open).toHaveAttribute('target', '_blank');
    await expect(open).toHaveAttribute('rel', /noopener/);
  });

  test('copy fallback selects the text and explains', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('denied')) }, configurable: true });
      document.execCommand = () => false;
    });
    await page.goto('/contact/');
    const lead = page.locator('#lead');
    await lead.getByRole('button', { name: en.lead.copy }).click();
    await expect(lead.getByRole('status')).toHaveText(en.lead.copyFail);
    const sel = await lead.locator('textarea').evaluate((t: HTMLTextAreaElement) => [t.selectionStart, t.selectionEnd, t.value.length]);
    expect(sel[0]).toBe(0);
    expect(sel[1]).toBe(sel[2]);
    await expect(lead.locator('textarea')).toBeFocused();
  });

  test('topic is preselected per page', async ({ page }) => {
    for (const [p, i] of [['cards', 1], ['payments', 2], ['development', 3], ['about', 0]] as const) {
      await page.goto(pagePath('ru', p));
      await expect(page.locator('#lead textarea')).toHaveValue(getDict('ru').lead.tpl(getDict('ru').lead.topics[i]!));
    }
  });
});

// Analytics wiring for hero CTAs (PRD §11)
test('hero CTAs are tracked', async ({ page }) => {
  await page.goto('/');
  await page.locator('.home-hero').getByRole('link', { name: en.home.cta1 }).click();
  await expect(page).toHaveURL(/#solutions$/);
  const popup = page.waitForEvent('popup');
  await page.locator('.home-hero').getByRole('link', { name: en.home.cta2 }).click();
  await (await popup).close();
  const events = await dataLayer(page);
  expect(events.some((e) => e.event === 'explore_solutions' && e.page === 'home' && e.lang === 'en')).toBe(true);
  expect(events.some((e) => e.event === 'request_demo' && e.placement === 'hero')).toBe(true);
});

// Responsive: nothing sticks out of a 390 / 320 px viewport (min width 320, PRD §12)
for (const width of [320, 390]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    for (const lang of LANGS)
      for (const p of PAGE_KEYS) {
        await page.goto(pagePath(lang, p));
        const offenders = await page.evaluate(() => {
          const vw = document.documentElement.clientWidth;
          const scrollable = (el: Element | null): boolean => {
            for (let n = el?.parentElement; n && n !== document.body; n = n.parentElement) {
              const o = getComputedStyle(n).overflowX;
              if ((o === 'auto' || o === 'scroll' || o === 'hidden') && n.tagName !== 'MAIN') return true;
            }
            return false;
          };
          return [...document.querySelectorAll('main *, header *, footer *')]
            .filter((el) => {
              const r = el.getBoundingClientRect();
              return r.width > 0 && (r.right > vw + 1 || r.left < -1) && !scrollable(el) && !el.closest('[aria-hidden="true"]');
            })
            .slice(0, 5)
            .map((el) => `${el.tagName.toLowerCase()}.${String((el as HTMLElement).className).slice(0, 60)} right=${Math.round(el.getBoundingClientRect().right)}`);
        });
        expect(offenders, `${lang}/${p}`).toEqual([]);
      }
  });
}
