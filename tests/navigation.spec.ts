import { test, expect } from '@playwright/test';
import { LANGS } from '../src/lib/i18n';
import { NOINDEX_PAGES, PAGE_KEYS, pagePath } from '../src/lib/routes';
import { pageTitle } from '../src/lib/seo';
import { getDict } from '../src/content';
import { metaDesc } from '../src/content/meta';

// PRD §13 scenario 1: every page of both languages.
for (const lang of LANGS) {
  for (const page of PAGE_KEYS) {
    const path = pagePath(lang, page);
    test(`page ${path}: status, lang, title, canonical, hreflang, disclaimer`, async ({ page: p }) => {
      const res = await p.goto(path);
      expect(res?.status()).toBe(200);
      await expect(p.locator('html')).toHaveAttribute('lang', lang);
      await expect(p).toHaveTitle(pageTitle(lang, page));
      await expect(p.locator('meta[name="description"]')).toHaveAttribute('content', metaDesc(lang, page));
      expect(await p.locator('link[rel="canonical"]').getAttribute('href')).toMatch(new RegExp(`${path.replace(/\//g, '\\/')}$`));
      for (const [hl, target] of [['en', pagePath('en', page)], ['ru', pagePath('ru', page)], ['x-default', pagePath('en', page)]] as const) {
        const href = await p.locator(`link[rel="alternate"][hreflang="${hl}"]`).getAttribute('href');
        expect(new URL(href!).pathname).toBe(target);
      }
      const robots = p.locator('meta[name="robots"]');
      if (NOINDEX_PAGES.has(page)) await expect(robots).toHaveAttribute('content', /noindex/);
      else await expect(robots).toHaveCount(0);
      // PRD §9.1: legal disclaimer in the footer of every page
      await expect(p.locator('footer')).toContainText(getDict(lang).footer.disc);
      await expect(p.locator('h1')).toHaveCount(1);
    });
  }
}

// PRD §13 scenario 2: language switch keeps the page (and the home anchor).
test.describe('language switch', () => {
  test('keeps the page', async ({ page }) => {
    await page.goto('/wallet/');
    await page.locator('header .lang-switch a').click();
    await expect(page).toHaveURL(/\/ru\/wallet\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  });

  test('keeps the home anchor', async ({ page }) => {
    await page.goto('/ru/#features');
    const link = page.locator('header .lang-switch a');
    await expect(link).toHaveAttribute('href', '/#features');
    await link.click();
    await expect(page).toHaveURL(/:\d+\/#features$/);
  });
});

// PRD §13 scenario 9: mobile menu.
test.describe('mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens, traps focus, closes on Esc and on navigation', async ({ page }) => {
    await page.goto('/');
    const burger = page.locator('button[aria-controls="mobile-menu"]');
    await expect(burger).toHaveAttribute('aria-expanded', 'false');
    await burger.click();
    const menu = page.locator('#mobile-menu');
    await expect(menu).toBeVisible();
    await expect(burger).toHaveAttribute('aria-expanded', 'true');
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');

    // focus stays inside
    for (let i = 0; i < 25; i++) await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('#mobile-menu'))).toBe(true);
    await page.keyboard.press('Shift+Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('#mobile-menu'))).toBe(true);

    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    await expect(burger).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');

    await burger.click();
    await menu.getByRole('link', { name: getDict('en').nav.projects }).click();
    await expect(page).toHaveURL(/:\d+\/projects\/$/);
    await expect(page.locator('#mobile-menu')).toHaveCount(0);
  });
});

// PRD §7.8: Solutions dropdown — click/Enter opens, Esc closes, aria-expanded reflects state.
test('solutions dropdown works from the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const btn = page.locator('header nav button[aria-expanded]');
  await btn.focus();
  await page.keyboard.press('Enter');
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  const panel = page.locator(`#${await btn.getAttribute('aria-controls')}`);
  await expect(panel.getByRole('link')).toHaveCount(4);
  await page.keyboard.press('Escape');
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  await expect(btn).toBeFocused();
  await expect(panel).toBeHidden();
});

// PRD §7.8: skip link is the first stop and moves focus to <main>.
test('skip link', async ({ page }) => {
  await page.goto('/ru/about/');
  await page.keyboard.press('Tab');
  const skip = page.locator('.skip-link');
  await expect(skip).toBeFocused();
  await expect(skip).toHaveText(getDict('ru').nav.skip);
  await page.keyboard.press('Enter');
  await expect(page.locator('main#main')).toBeFocused();
});

// PRD §10: sitemap has both languages of every indexable page and no noindex pages.
test('sitemap and robots', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const lang of LANGS)
    for (const page of PAGE_KEYS) {
      const has = xml.includes(`${pagePath(lang, page)}</loc>`);
      expect(has, `${lang}/${page}`).toBe(!NOINDEX_PAGES.has(page));
    }
  expect(await (await request.get('/robots.txt')).text()).toMatch(/Sitemap: .*\/sitemap\.xml/);
});
