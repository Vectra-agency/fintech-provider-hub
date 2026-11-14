import { test, expect } from '@playwright/test';
import { LANGS } from '../src/lib/i18n';
import { getDict } from '../src/content';
import { pagePath } from '../src/lib/routes';

// URL scheme: English is the default at "/" (no prefix, no language redirect), Russian under /ru/.
test.describe('locale roots', () => {
  test('"/" is English even for a Russian browser', async ({ page }) => {
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'ru-RU,ru;q=0.9' });
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);
    expect(res?.url()).toMatch(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('old /en/ URLs redirect permanently to the unprefixed pages', async ({ request }) => {
    for (const [from, to] of [['/en/', '/'], ['/en', '/'], ['/en/wallet/', '/wallet/'], ['/en/about/', '/about/']] as const) {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status(), from).toBe(301);
      expect(new URL(res.headers()['location']!, 'http://x').pathname, from).toBe(to);
    }
  });
});

// PRD §13 scenario 1 (partial until M2): language roots respond with correct <html lang>.
for (const lang of LANGS) {
  test(`${pagePath(lang, 'home')} renders with lang=${lang}`, async ({ page }) => {
    const res = await page.goto(pagePath(lang, 'home'));
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
  });
}

// PRD §13 scenario 10.
test('unknown path → 404 page with noindex, language from the path', async ({ page }) => {
  const res = await page.goto('/definitely-missing/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(getDict('en').pages['404'].h1);
  await expect(page.getByRole('link', { name: getDict('en').pages['404'].cta })).toHaveAttribute('href', '/');

  await page.goto('/ru/definitely-missing/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(getDict('ru').pages['404'].h1);
  await expect(page).toHaveTitle(new RegExp(getDict('ru').meta['404']));
});
