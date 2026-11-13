import type { CSSProperties } from 'react';
import type { Lang } from '@/lib/i18n';
import type { ScreenKey } from '@/content/types';
import { SS } from '@/content/screens';
import { getDict } from '@/content';
import { SCREENS } from './screens';

/**
 * PRD §7.3 — phone mockup: server-rendered HTML/CSS screen, scaled by `--s` (no JS).
 * role="img" + aria-label with the screen name; everything inside is aria-hidden.
 * `fixed` mockups keep the ember palette (Projects teaser); others follow the brand switch.
 */
export function Phone({
  name,
  lang,
  s = 0.62,
  fixed = false,
  label,
}: {
  name: ScreenKey;
  lang: Lang;
  s?: number;
  fixed?: boolean;
  label?: string;
}) {
  const aria = label ?? getDict(lang).screens[name] ?? name;
  return (
    <div className={`phone ${fixed ? 'br-ember' : 'brandable'}`} style={{ '--s': s } as CSSProperties} role="img" aria-label={aria}>
      <div className="phone-in" aria-hidden="true">
        <span className="island" />
        <div className="scr" dangerouslySetInnerHTML={{ __html: SCREENS[name](SS[lang], lang) }} />
      </div>
    </div>
  );
}

/** Two or three phones side by side (prototype `duo`). */
export function Phones({
  names,
  lang,
  s = 0.6,
  fixed,
  flat,
}: {
  names: readonly ScreenKey[];
  lang: Lang;
  s?: number;
  fixed?: boolean;
  flat?: boolean;
}) {
  return (
    <div className={`duo${names.length > 2 ? ' three' : ''}${flat ? ' flat' : ''}`}>
      {names.map((n) => (
        <Phone key={n} name={n} lang={lang} s={s} fixed={fixed} />
      ))}
    </div>
  );
}
