import type { Metadata } from 'next';
import { Google_Sans } from 'next/font/google';
import { getDict } from '@/content';
import { LANGS } from '@/lib/i18n';
import { pagePath } from '@/lib/routes';
import { FrameLines } from '@/components/layout/FrameLines';
import { LogoLockup } from '@/components/ui/Logo';
import { NotFoundTitle } from '@/components/layout/NotFoundTitle';
import '@/styles/globals.css';

const display = Google_Sans({ subsets: ['latin', 'cyrillic'], variable: '--font-google-sans', display: 'swap', adjustFontFallback: false });

const en = getDict('en');
const ru = getDict('ru');

export const metadata: Metadata = {
  title: `${en.meta['404']} · Fintech Provider Hub`,
  // robots noindex is injected by Next.js for not-found pages; adding it here duplicates the tag.
};

/**
 * PRD §6.10 / §5 — one static 404 for both languages: the language comes from the path prefix on the
 * client (EN by default). The script runs before paint, so the other language never flashes.
 */
const LANG_BOOT = `try{var ru=/^\\/ru(\\/|$)/.test(location.pathname);var h=document.documentElement;h.lang=ru?'ru':'en';h.setAttribute('data-lang',h.lang);if(ru)document.title=${JSON.stringify(`${ru.meta['404']} · Fintech Provider Hub`)}}catch(e){}`;

export default function GlobalNotFound() {
  return (
    <html lang="en" data-lang="en" className={display.variable} data-brand="ember">
      <head>
        <script dangerouslySetInnerHTML={{ __html: LANG_BOOT }} />
      </head>
      <body>
        <FrameLines />
        <NotFoundTitle ru={`${ru.meta['404']} · Fintech Provider Hub`} />
        <main id="main" className="nf">
          <div className="lead-glow" aria-hidden="true" />
          {LANGS.map((lang) => {
            const d = getDict(lang);
            const P = d.pages['404'];
            return (
              <div key={lang} className={`nf-${lang} section-inner relative flex flex-col items-center gap-6 text-center`} lang={lang}>
                <a href={pagePath(lang, 'home')} className="mb-10">
                  <LogoLockup gradientId={`logo-g-404-${lang}`} />
                </a>
                <p className="eyebrow">404</p>
                <h1 className="heading-cta">{P.h1}</h1>
                <p className="section-lead max-w-md">{P.sub}</p>
                <a href={pagePath(lang, 'home')} className="btn btn-solid btn-md mt-4">
                  <span className="btn-solid-highlight" aria-hidden="true" />
                  <span className="btn-label">{P.cta}</span>
                </a>
              </div>
            );
          })}
        </main>
      </body>
    </html>
  );
}
