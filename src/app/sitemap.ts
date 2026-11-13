import type { MetadataRoute } from 'next';
import { LANGS } from '@/lib/i18n';
import { NOINDEX_PAGES, PAGE_KEYS, pagePath } from '@/lib/routes';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

/** PRD §10: every indexable page in both languages, with hreflang alternates; noindex pages excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGE_KEYS.filter((p) => !NOINDEX_PAGES.has(p)).flatMap((page) =>
    LANGS.map((lang) => ({
      url: SITE_URL + pagePath(lang, page),
      alternates: { languages: Object.fromEntries(LANGS.map((l) => [l, SITE_URL + pagePath(l, page)])) },
      changeFrequency: 'monthly' as const,
      priority: page === 'home' ? 1 : 0.7,
    })),
  );
}
