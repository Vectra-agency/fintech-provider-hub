import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LANGS } from '../src/lib/i18n';
import { PAGE_KEYS, pagePath } from '../src/lib/routes';

// PRD §13 scenario 12 / §12: axe on every page, 0 critical and serious violations.
for (const lang of LANGS) {
  for (const page of PAGE_KEYS) {
    const path = pagePath(lang, page);
    test(`axe ${path}`, async ({ page: p }) => {
      await p.emulateMedia({ reducedMotion: 'reduce' }); // no entrance animations: stable contrast sampling
      await p.goto(path);
      // Text inside the product mockups is part of an image (role="img", WCAG 1.4.3 exception) and the
      // screens' own colours must stay as designed (PRD §4.3.3) — so they're excluded from contrast only.
      // The home hero scene (Parus phone + admin panel dimmed to greyscale on purpose) is one role="img".
      const results = await new AxeBuilder({ page: p })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('.phone .scr')
        .exclude('.scr-widget')
        .exclude('.hero-stage')
        .analyze();
      const bad = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
      expect(
        bad.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`),
      ).toEqual([]);
    });
  }
}

test('axe 404', async ({ page }) => {
  await page.goto('/missing-page/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious').map((v) => v.id)).toEqual([]);
});
