export const LANGS = ['en', 'ru'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export const isLang = (v: unknown): v is Lang => typeof v === 'string' && (LANGS as readonly string[]).includes(v);
export const otherLang = (l: Lang): Lang => (l === 'en' ? 'ru' : 'en');

/** BCP-47 for og:locale */
export const OG_LOCALE: Record<Lang, string> = { en: 'en_US', ru: 'ru_RU' };

/** Only constant for the Telegram handle (PRD §8). */
export const TG_HANDLE = 'fintechprovider';
export const tgUrl = (text?: string) =>
  `https://t.me/${TG_HANDLE}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
