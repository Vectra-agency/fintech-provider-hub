import type { CSSProperties } from 'react';
import type { Lang } from '@/lib/i18n';
import { ADDED } from '@/content/added-strings';
import { manrope } from '@/lib/fonts';

const ICON: Record<string, string> = {
  chatgpt: '/media/parus/chatgpt.svg',
  github: '/media/parus/github.svg',
  canva: '/media/parus/canva.png',
};

const Sail = ({ size }: { size: number }) => (
  // eslint-disable-next-line @next/next/no-img-element -- static export, tiny decorative asset
  <img src="/media/parus/sail.png" alt="" width={Math.round(size * 0.806)} height={size} className="pp-sail" />
);

/**
 * Home screen of Parus (paruspay.com), our own wallet product, redrawn in HTML/CSS after its site.
 * Fixed Parus palette and Manrope; does not follow the brand switcher. Decorative: the caller labels it.
 * Design size = the phone mockup (422 × 894), scaled by `--s` (prop, or set by the caller's CSS).
 */
export function ParusPhone({ lang, s }: { lang: Lang; s?: number }) {
  const T = ADDED[lang].parus;
  return (
    <div className={`pp-phone ${manrope.variable}`} style={s ? ({ '--s': s } as CSSProperties) : undefined} aria-hidden="true">
      <div className="phone-in">
        <span className="island" />
        <div className="pp-scr">
          <div className="pp-status">
            <span>9:41</span>
            <span className="pp-sb">
              <svg width="18" height="12" viewBox="0 0 18 12">
                <rect x="0" y="8" width="3" height="4" rx="1" />
                <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
                <rect x="10" y="3" width="3" height="9" rx="1" />
                <rect x="15" y="0" width="3" height="12" rx="1" />
              </svg>
              <svg width="27" height="13" viewBox="0 0 27 13">
                <rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4" />
                <rect x="2" y="2" width="18" height="9" rx="2" />
                <rect x="24.5" y="4" width="2" height="5" rx="1" opacity=".4" />
              </svg>
            </span>
          </div>

          <div className="pp-head">
            <span className="pp-logo">
              <Sail size={26} />
              PARUS
            </span>
            <span className="pp-avatar">SK</span>
          </div>

          <p className="pp-label">{T.total}</p>
          <p className="pp-balance">$ 486.20</p>
          {T.approx && <p className="pp-label">{T.approx}</p>}

          <div className="pp-actions">
            <span>
              <b>＋</b>
              {T.topup}
            </span>
            <span>
              <b>•••</b>
              {T.more}
            </span>
          </div>

          <div className="pp-card">
            <span className="pp-card-row">
              <span className="pp-card-brand">
                <Sail size={24} />
                PARUS
              </span>
              <span className="pp-card-type">{T.virtual}</span>
            </span>
            <span className="pp-chip">
              <i />
              <i />
              <i />
            </span>
            <span className="pp-card-row">
              <span>•••• 4137&nbsp;&nbsp;&nbsp;09/29</span>
              <span className="pp-visa">VISA</span>
            </span>
          </div>

          <div className="pp-hist">
            <b>{T.ops}</b>
            <span>{T.all}</span>
          </div>
          {T.tx.map(([icon, name, when, sum]) => (
            <div key={name} className="pp-tx">
              <span className={`pp-tx-logo is-${icon}`}>
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, tiny decorative asset */}
                <img src={ICON[icon]} alt="" width={26} height={26} />
              </span>
              <span className="pp-tx-name">
                <b>{name}</b>
                <small>{when}</small>
              </span>
              <strong>{sum}</strong>
            </div>
          ))}
          <span className="pp-home" />
        </div>
      </div>
    </div>
  );
}
