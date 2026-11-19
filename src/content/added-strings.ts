import type { Lang } from '@/lib/i18n';

/**
 * UI strings that do NOT exist in the prototype (features marked [новое] in the PRD).
 * Everything here needs copy/legal approval before release; prototype texts live in en.ts / ru.ts.
 */
export const ADDED = {
  en: {
    // landmark labels: the prototype hard-codes these in English on both languages
    landmarks: { main: 'Main', mobile: 'Mobile', language: 'Language' },
    /** Home hero visual: the Parus wallet home screen (paruspay.com) in front, its admin panel behind. */
    parus: {
      label: 'Parus wallet home screen in front of its admin panel',
      admin: 'Admin panel',
      total: 'Total balance',
      approx: '',
      topup: 'Top up',
      more: 'More',
      virtual: 'VIRTUAL',
      ops: 'Transactions',
      all: 'All',
      tx: [
        ['chatgpt', 'ChatGPT', 'Today, 14:32', '− $20.00'],
        ['github', 'GitHub', 'Yesterday, 19:08', '− $4.00'],
        ['canva', 'Canva', 'Aug 4', '− $14.99'],
      ],
    },
  },
  ru: {
    landmarks: { main: 'Основное меню', mobile: 'Мобильное меню', language: 'Язык' },
    parus: {
      label: 'Главный экран кошелька Parus на фоне его панели управления',
      admin: 'Панель управления',
      total: 'Общий баланс',
      approx: '≈ 39 618 ₽',
      topup: 'Пополнить',
      more: 'Ещё',
      virtual: 'VIRTUAL',
      ops: 'Операции',
      all: 'Все',
      tx: [
        ['chatgpt', 'ChatGPT', 'Сегодня, 14:32', '− $20.00'],
        ['github', 'GitHub', 'Вчера, 19:08', '− $4.00'],
        ['canva', 'Canva', '4 августа', '− $14.99'],
      ],
    },
  },
} as const satisfies Record<Lang, unknown>;
