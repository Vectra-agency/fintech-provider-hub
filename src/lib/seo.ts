import type { Metadata } from 'next';
import { type Lang, OG_LOCALE, otherLang } from './i18n';
import { type PageKey, NOINDEX_PAGES, pagePath } from './routes';
import { getDict } from '@/content';
import { metaDesc } from '@/content/meta';

export const SITE_NAME = 'Fintech Provider Hub';

/** TODO(Q3): production domain. CI sets NEXT_PUBLIC_SITE_URL; the fallback is only for local/preview builds. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://fintech-provider-hub.pages.dev').replace(/\/$/, '');

export function pageTitle(lang: Lang, page: PageKey): string {
  const d = getDict(lang);
  return page === 'home' ? d.meta.home : `${d.meta[page]} · ${SITE_NAME}`;
}

/** PRD §10: title, description, canonical, hreflang (en/ru/x-default → "/"), OG/Twitter, noindex for legal drafts. */
export function pageMetadata(lang: Lang, page: PageKey): Metadata {
  const title = pageTitle(lang, page);
  const description = metaDesc(lang, page);
  const url = pagePath(lang, page);
  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { en: pagePath('en', page), ru: pagePath('ru', page), 'x-default': '/' },
    },
    robots: NOINDEX_PAGES.has(page) ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale: OG_LOCALE[lang],
      alternateLocale: [OG_LOCALE[otherLang(lang)]],
      // TODO(M7, Q5): og:image 1200×630 per language from the hero poster + our logo
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}
