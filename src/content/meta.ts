import type { Lang } from '@/lib/i18n';
import type { PageKey } from '@/lib/routes';
import { getDict } from './index';

/**
 * PRD §8 `metaDesc`. Indexable pages have their own description written for search (≤ 160 chars,
 * `check:content` enforces it); the legal drafts and 404 fall back to dictionary text.
 */
export const META_DESC_OVERRIDES: Record<Lang, Partial<Record<PageKey, string>>> = {
  en: {
    home: 'White-label crypto wallet for Telegram: USDT on 5 networks, virtual cards and payments through licensed partners, plus custom fintech development.',
    wallet: 'A USDT wallet under your brand as a Telegram Mini App: 5 networks, virtual cards and fiat on-ramp through partners, admin panel included.',
    cards: 'Virtual card programs through issuing partners: issue cards and top them up from the USDT balance via API, manage them inside your Telegram wallet.',
    payments: 'Buy and sell USDT for USD and EUR, QR payments and CNY payouts to Alipay and WeChat through partner providers. Payout rate locked for 30 seconds.',
    development: 'Telegram Mini Apps, fintech interfaces, admin panels and integrations with card issuers, on/off-ramps and AML/KYC providers, built to your spec.',
    projects: 'A crypto wallet with virtual cards, built as a Telegram Mini App on our platform: USDT on 5 networks, card issuing, Alipay payouts.',
    about: 'We build and run white-label financial products. We are not a bank or a card issuer: regulated services are provided by licensed partners.',
    contact: 'Message us on Telegram and tell us what you want to launch: a white-label crypto wallet, a card program, payments or custom development.',
  },
  ru: {
    home: 'White-label криптокошелёк в Telegram: USDT в 5 сетях, виртуальные карты и платежи через лицензированных партнёров, финтех-разработка на заказ.',
    wallet: 'USDT-кошелёк под вашим брендом в Telegram Mini App: 5 сетей, карты и покупка USDT за рубли через партнёров. Панель управления в комплекте.',
    cards: 'Программы виртуальных карт через партнёров-эмитентов: выпуск и пополнение с баланса USDT по API, управление картами прямо в Telegram-кошельке.',
    payments: 'Покупка и продажа USDT за рубли по СБП, доллары и евро, QR-платежи и выплаты в Alipay через партнёров. Курс выплаты фиксируется на 30 секунд.',
    development: 'Разрабатываем по ТЗ Telegram Mini Apps, финтех-интерфейсы, панели управления и интеграции с эмитентами карт, on/off-ramp и AML/KYC-провайдерами.',
    projects: 'Криптокошелёк с виртуальными картами в Telegram Mini App на нашей платформе: USDT в 5 сетях, выпуск карт, вывод по СБП и в Alipay.',
    about: 'Разрабатываем и сопровождаем white-label финансовые продукты. Мы не банк и не эмитент карт: регулируемые услуги оказывают лицензированные партнёры.',
    contact: 'Напишите нам в Telegram и расскажите, что хотите запустить: white-label криптокошелёк, карточную программу, платежи или разработку на заказ.',
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
