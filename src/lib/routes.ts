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

/** English is the default locale at the root without a prefix; Russian lives under /ru/. */
export const LANG_PREFIX: Record<Lang, string> = { en: '', ru: '/ru' };

export function pagePath(lang: Lang, page: PageKey, hash?: HomeAnchor): string {
  const seg = PAGES[page];
  return `${LANG_PREFIX[lang]}/${seg ? `${seg}/` : ''}${hash ? `#${hash}` : ''}`;
}

/** Inverse of pagePath: "/wallet/" → en/wallet, "/ru/wallet/" → ru/wallet; unknown segment → page undefined. */
export function parsePath(pathname: string): { lang: Lang; page: PageKey | undefined } {
  const parts = pathname.split('/').filter(Boolean);
  const lang: Lang = parts[0] === 'ru' ? 'ru' : 'en';
  if (lang === 'ru') parts.shift();
  if (parts.length > 1) return { lang, page: undefined };
  const seg = parts[0] ?? '';
  return { lang, page: PAGE_KEYS.find((k) => PAGES[k] === seg) };
}
