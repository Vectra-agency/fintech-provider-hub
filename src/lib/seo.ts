import type { Metadata } from 'next';
import { type Lang, OG_LOCALE, otherLang, tgUrl } from './i18n';
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

/** PRD §10: title, description, canonical, hreflang (en / ru / x-default = the English page, the default locale), OG/Twitter, noindex for legal drafts. */
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
      languages: { en: pagePath('en', page), ru: pagePath('ru', page), 'x-default': pagePath('en', page) },
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
      // Q5 default: one image per language (scripts/make-brand-assets.ts)
      images: [{ url: `/og/${lang}.png`, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`/og/${lang}.png`] },
  };
}

/** PRD §10 JSON-LD: Organization + WebSite. TODO(Q1): add legalName and address once confirmed. */
export function jsonLd(lang: Lang, description: string) {
  const org = `${SITE_URL}/#organization`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': org,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/logo-512.png`,
        description,
        sameAs: [tgUrl()],
        contactPoint: { '@type': 'ContactPoint', contactType: 'sales', url: tgUrl(), availableLanguage: ['English', 'Russian'] },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        inLanguage: lang,
        publisher: { '@id': org },
      },
    ],
  };
}
