import type { Lang } from '@/lib/i18n';
import type { Dict } from './types';
import { en } from './en';
import { ru } from './ru';

const DICT: Record<Lang, Dict> = { en, ru };
export const getDict = (lang: Lang): Dict => DICT[lang];

export type { Dict } from './types';
