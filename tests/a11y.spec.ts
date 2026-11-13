import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LANGS } from '../src/lib/i18n';
import { PAGE_KEYS, pagePath } from '../src/lib/routes';

// PRD §13 scenario 12 / §12: axe on every page, 0 critical and serious violations.
for (const lang of LANGS) {
  for (const page of PAGE_KEYS) {
    const path = pagePath(lang, page);
    test(`axe ${path}`, async ({ page: p }) => {
      await p.emulateMedia({ reducedMotion: 'reduce' }); // poster instead of video: stable contrast sampling
      await p.goto(path);
      const results = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      const bad = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
      expect(
        bad.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`),
      ).toEqual([]);
    });
  }
}

test('axe 404', async ({ page }) => {
  await page.goto('/en/missing-page/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious').map((v) => v.id)).toEqual([]);
});
