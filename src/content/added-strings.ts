import type { Lang } from '@/lib/i18n';

/**
 * UI strings that do NOT exist in the prototype (features marked [новое] in the PRD).
 * Everything here needs copy/legal approval before release; prototype texts live in en.ts / ru.ts.
 */
export const ADDED = {
  en: {
    heroVideo: { pause: 'Pause background video', play: 'Play background video' },
    // landmark labels: the prototype hard-codes these in English on both languages
    landmarks: { main: 'Main', mobile: 'Mobile', language: 'Language' },
  },
  ru: {
    heroVideo: { pause: 'Остановить фоновое видео', play: 'Включить фоновое видео' },
    landmarks: { main: 'Основное меню', mobile: 'Мобильное меню', language: 'Язык' },
  },
} as const satisfies Record<Lang, unknown>;
