import { notFound } from 'next/navigation';
import { type Lang, isLang } from './i18n';

/** Resolves the [lang] param of a route; anything else is a 404 (dynamicParams = false anyway). */
export async function resolveLang(params: Promise<{ lang: string }>): Promise<Lang> {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return lang;
}
