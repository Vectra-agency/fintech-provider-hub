import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import type { Lang } from '@/lib/i18n';
import { HEAD_BOOT, DEFAULT_BRAND } from '@/lib/brand';
import { display, inter } from '@/lib/fonts';
import { jsonLd } from '@/lib/seo';
import { getDict } from '@/content';
import { ADDED } from '@/content/added-strings';
import { FrameLines } from './FrameLines';
import { RevealObserver } from './RevealObserver';
import { Header } from './Header';
import { Footer } from './Footer';
import { SkipLink } from './SkipLink';
import { AnalyticsListener } from './AnalyticsListener';
import '@/styles/globals.css';

export const siteMetadata: Metadata = {
  icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.png' },
};

export const siteViewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

/**
 * The document shell shared by the two root layouts: app/(en)/layout.tsx (English at "/") and
 * app/ru/layout.tsx (Russian at "/ru/"). Switching languages crosses root layouts = full page load.
 */
export function SiteLayout({ lang, children }: { lang: Lang; children: ReactNode }) {
  const d = getDict(lang);
  const labels = {
    ...d.nav,
    langName: d.langName,
    otherName: d.otherName,
    landmarks: ADDED[lang].landmarks,
    sol: d.sol.map(({ id, name, short }) => ({ id, name, short })),
  };
  return (
    <html lang={lang} className={`${display.variable} ${inter.variable}`} data-brand={DEFAULT_BRAND} suppressHydrationWarning>
      {/* App Router root-layout shell (rendered by app/(en)/layout.tsx and app/ru/layout.tsx); the rule targets the Pages Router */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_BOOT }} />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang, d.footer.tag)).replace(/</g, '\\u003c') }} />
        <SkipLink label={d.nav.skip} />
        <FrameLines />
        <Header lang={lang} labels={labels} />
        {children}
        <Footer lang={lang} />
        <RevealObserver />
        <AnalyticsListener />
      </body>
    </html>
  );
}
