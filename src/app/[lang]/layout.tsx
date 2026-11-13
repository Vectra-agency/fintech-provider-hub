import type { Viewport } from 'next';
import { Google_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';
import { LANGS, isLang } from '@/lib/i18n';
import { HEAD_BOOT, DEFAULT_BRAND } from '@/lib/brand';
import { FrameLines } from '@/components/layout/FrameLines';
import { RevealObserver } from '@/components/layout/RevealObserver';
import '@/styles/globals.css';

// Display face of the design reference. Self-hosted by next/font at build time; has Cyrillic (Q11).
// TODO(M7): Next ships no metrics for Google Sans, so there is no size-adjusted fallback face.
// Add a manual fallback @font-face (size-adjust / ascent-override over Arial) to keep CLS ≤ 0.05.
const display = Google_Sans({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-google-sans',
  display: 'swap',
  adjustFontFallback: false,
});

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} className={display.variable} data-brand={DEFAULT_BRAND} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_BOOT }} />
      </head>
      <body>
        <FrameLines />
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
