import { test, expect } from '@playwright/test';
import { LANGS } from '../src/lib/i18n';
import { getDict } from '../src/content';

// PRD §13 scenario 3: root redirect by Accept-Language.
test.describe('root redirect', () => {
  test('ru → /ru/', async ({ request }) => {
    const res = await request.get('/', { headers: { 'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8' }, maxRedirects: 0 });
    expect(res.status()).toBe(302);
    expect(new URL(res.headers()['location']!).pathname).toBe('/ru/');
    expect(res.headers()['vary']).toMatch(/Accept-Language/i);
  });

  test('no header → /en/', async ({ request }) => {
    const res = await request.get('/', { headers: { 'Accept-Language': '' }, maxRedirects: 0 });
    expect(res.status()).toBe(302);
    expect(new URL(res.headers()['location']!).pathname).toBe('/en/');
  });

  test('en preferred over ru → /en/', async ({ request }) => {
    const res = await request.get('/', { headers: { 'Accept-Language': 'en-GB,ru;q=0.5' }, maxRedirects: 0 });
    expect(new URL(res.headers()['location']!).pathname).toBe('/en/');
  });
});

// PRD §13 scenario 1 (partial until M2): language roots respond with correct <html lang>.
for (const lang of LANGS) {
  test(`/${lang}/ renders with lang=${lang}`, async ({ page }) => {
    const res = await page.goto(`/${lang}/`);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
  });
}

// PRD §13 scenario 10.
test('unknown path → 404 page with noindex, language from the path', async ({ page }) => {
  const res = await page.goto('/en/definitely-missing/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(getDict('en').pages['404'].h1);
  await expect(page.getByRole('link', { name: getDict('en').pages['404'].cta })).toHaveAttribute('href', '/en/');

  await page.goto('/ru/definitely-missing/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(getDict('ru').pages['404'].h1);
  await expect(page).toHaveTitle(new RegExp(getDict('ru').meta['404']));
});
