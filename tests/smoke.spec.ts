import { test, expect } from '@playwright/test';
import { LANGS } from '../src/lib/i18n';

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
test('unknown path → 404 page with noindex', async ({ page }) => {
  const res = await page.goto('/en/definitely-missing/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});
