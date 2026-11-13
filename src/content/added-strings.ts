import type { Lang } from '@/lib/i18n';

/**
 * UI strings that do NOT exist in the prototype (features marked [новое] in the PRD).
 * Everything here needs copy/legal approval before release; prototype texts live in en.ts / ru.ts.
 */
export const ADDED = {
  en: {
    heroVideo: { pause: 'Pause background video', play: 'Play background video' },
  },
  ru: {
    heroVideo: { pause: 'Остановить фоновое видео', play: 'Включить фоновое видео' },
  },
} as const satisfies Record<Lang, unknown>;
