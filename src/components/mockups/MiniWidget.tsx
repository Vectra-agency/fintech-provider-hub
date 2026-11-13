import type { Lang } from '@/lib/i18n';
import { SS } from '@/content/screens';
import { WIDGETS, type WidgetKind } from './widgets';

/** Decorative fragment of the product UI (aria-hidden); the caller adds the demo-data note (PRD §9.4). */
export function MiniWidget({ kind, lang }: { kind: WidgetKind; lang: Lang }) {
  return <div className="scr scr-widget brandable" aria-hidden="true" dangerouslySetInnerHTML={{ __html: WIDGETS[kind](SS[lang]) }} />;
}
