import type { Metadata } from 'next';
import { Google_Sans } from 'next/font/google';
import '@/styles/globals.css';

const display = Google_Sans({ subsets: ['latin', 'cyrillic'], variable: '--font-google-sans', display: 'swap', adjustFontFallback: false });

export const metadata: Metadata = {
  title: '404 · Fintech Provider Hub',
  // robots noindex is injected by Next.js for not-found pages; adding it here duplicates the tag.
};

// Language is picked on the client from the path prefix (PRD §5); EN by default.
const LANG_BOOT = `try{if(location.pathname.indexOf('/ru/')===0||location.pathname==='/ru'){document.documentElement.lang='ru';document.documentElement.setAttribute('data-lang','ru')}}catch(e){}`;

// TODO(M6): P8-styled 404 with eyebrow/title/subtitle/button texts from the prototype (PRD §6.10).
export default function GlobalNotFound() {
  return (
    <html lang="en" data-lang="en" className={display.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LANG_BOOT }} />
      </head>
      <body>
        <main id="main" className="frame-container grid min-h-svh place-items-center text-center">
          <div>
            <p className="eyebrow">404</p>
            {/* Plain <a>: this page bypasses the app tree; switching root layouts is a full load anyway. */}
            {/* eslint-disable @next/next/no-html-link-for-pages */}
            <p className="mt-6 flex justify-center gap-4">
              <a className="underline" href="/en/" lang="en">EN</a>
              <a className="underline" href="/ru/" lang="ru">RU</a>
            </p>
            {/* eslint-enable @next/next/no-html-link-for-pages */}
          </div>
        </main>
      </body>
    </html>
  );
}
