import { test, expect } from '@playwright/test';
import { LANGS } from '../src/lib/i18n';
import { PAGE_KEYS, pagePath } from '../src/lib/routes';

// PRD §13 scenario 11 / §12: no requests to external domains (analytics is off in test builds),
// in particular none to the design reference or its storage.
test('every page loads only same-origin resources', async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  const foreign = new Set<string>();
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (u.protocol.startsWith('http') && u.origin !== origin) foreign.add(`${u.origin} ← ${page.url()}`);
  });
  for (const lang of LANGS)
    for (const p of PAGE_KEYS) {
      await page.goto(pagePath(lang, p));
      await page.waitForLoadState('networkidle');
    }
  expect([...foreign]).toEqual([]);
});
