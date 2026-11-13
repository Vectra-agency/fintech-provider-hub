import type { Lang } from '@/lib/i18n';
import type { PageKey } from '@/lib/routes';
import { getDict } from './index';

/**
 * PRD §8 `metaDesc`: defaults to the page `sub`. Where `sub` is longer than 160 characters it is
 * replaced by verbatim sentences from the prototype (no rewriting) — `check:headings` verifies that
 * every override occurs in the prototype text and fits the limit.
 */
export const META_DESC_OVERRIDES: Record<Lang, Partial<Record<PageKey, string>>> = {
  en: {
    // first sentence of pages.wallet.sub
    wallet: 'A branded crypto wallet in Telegram with cards and fiat on-ramp, run on our infrastructure.',
    // first two sentences of home.about.p (pages.about.sub is a single 166-char sentence)
    about: 'We are a Hong Kong fintech company. We build and run white-label financial products, develop custom fintech software and connect financial APIs.',
  },
  ru: {
    wallet: 'Криптокошелёк под вашим брендом в Telegram с картами и покупкой USDT за рубли, на нашей инфраструктуре.',
    about: 'Мы — финтех-компания из Гонконга. Разрабатываем и сопровождаем white-label финансовые продукты, делаем финтех-разработку на заказ и подключаем финансовые API.',
  },
};

export const META_DESC_MAX = 160;

export function metaDesc(lang: Lang, page: PageKey | '404'): string {
  const d = getDict(lang);
  if (page !== '404' && META_DESC_OVERRIDES[lang][page]) return META_DESC_OVERRIDES[lang][page]!;
  switch (page) {
    case 'home':
      return d.home.sub;
    case 'privacy':
    case 'terms':
      return d.footer.tag; // legal drafts have no `sub`
    case '404':
      return d.pages['404'].sub;
    default:
      return d.pages[page].sub;
  }
}
