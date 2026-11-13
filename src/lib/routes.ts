import type { Lang } from './i18n';

/** PRD §5. Key → path segment ('' = home). */
export const PAGES = {
  home: '',
  wallet: 'wallet',
  cards: 'cards',
  payments: 'payments',
  development: 'development',
  projects: 'projects',
  about: 'about',
  contact: 'contact',
  privacy: 'privacy',
  terms: 'terms',
} as const;

export type PageKey = keyof typeof PAGES;
export const PAGE_KEYS = Object.keys(PAGES) as PageKey[];

/** Pages served with noindex until legal review (PRD §6.9, Q8). */
export const NOINDEX_PAGES: ReadonlySet<PageKey> = new Set(['privacy', 'terms']);

/** Home-page anchors (PRD §5). */
export type HomeAnchor = 'solutions' | 'features';

export function pagePath(lang: Lang, page: PageKey, hash?: HomeAnchor): string {
  const seg = PAGES[page];
  return `/${lang}/${seg ? `${seg}/` : ''}${hash ? `#${hash}` : ''}`;
}

/** Inverse of pagePath for a pathname like "/ru/wallet/". */
export function parsePath(pathname: string): { lang: string | undefined; page: PageKey | undefined } {
  const [, lang, seg = ''] = pathname.split('/');
  const page = PAGE_KEYS.find((k) => PAGES[k] === seg);
  return { lang, page };
}
