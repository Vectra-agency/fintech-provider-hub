/** Admin-panel mockup copy — ported verbatim from the prototype (object `ADM`). */
import type { Lang } from '@/lib/i18n';
import type { AdminStrings } from './types';

export const ADM = {
  en: {
    url: 'admin.yourbrand.app/users',
    brand: 'Your Brand · Admin',
    nav: ['Users', 'Balances', 'Cards', 'Support', 'Settings'],
    h: 'Users',
    search: 'Search by UID or @username',
    k: [['Users', '12 480'], ['Active today', '1 932'], ['Open tickets', '3']],
    th: ['UID', 'Telegram', 'Wallet', 'Cards', 'KYC', 'Last active'],
    kyc: {
      ok: 'Verified',
      wait: 'Pending',
      na: 'Not required',
    },
    tk: 'Ticket #2841 · UID 10482736',
    m1: 'Hi! I topped up my card 10 minutes ago, still not showing.',
    m2: 'Thanks, we can see the top-up is being processed by the partner. It usually completes within a few minutes.',
    t1: 'User · 12:41',
    t2: 'Support · 12:44',
    reply: 'Write a reply…',
    send: 'Send',
    resolve: 'Resolve',
    ago: ['2 min', '5 min', '12 min', '1 h', '3 h', 'Yesterday'],
  },
  ru: {
    url: 'admin.yourbrand.app/users',
    brand: 'Your Brand · Админка',
    nav: ['Пользователи', 'Балансы', 'Карты', 'Поддержка', 'Настройки'],
    h: 'Пользователи',
    search: 'Поиск по UID или @username',
    k: [['Пользователи', '12 480'], ['Активны сегодня', '1 932'], ['Открытые обращения', '3']],
    th: ['UID', 'Telegram', 'Кошелёк', 'Карты', 'KYC', 'Активность'],
    kyc: {
      ok: 'Пройден',
      wait: 'На проверке',
      na: 'Не нужен',
    },
    tk: 'Обращение #2841 · UID 10482736',
    m1: 'Здравствуйте! Пополнил карту 10 минут назад, деньги ещё не пришли.',
    m2: 'Спасибо, видим пополнение — его обрабатывает партнёр. Обычно это занимает несколько минут.',
    t1: 'Пользователь · 12:41',
    t2: 'Поддержка · 12:44',
    reply: 'Напишите ответ…',
    send: 'Отправить',
    resolve: 'Решено',
    ago: ['2 мин', '5 мин', '12 мин', '1 ч', '3 ч', 'Вчера'],
  },
} as const satisfies Record<Lang, AdminStrings>;
