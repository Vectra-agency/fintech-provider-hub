import type { Lang } from '@/lib/i18n';
import { ADM } from '@/content/admin';
import { ic } from './screens';
import { ScaleToFit } from './ScaleToFit';

/** Demo rows from the prototype `admin()` — illustrative data, do not extend (PRD §9.5). */
const ROWS = [
  ['10482736', '@alex_m', '612.45 USDT', '2', 'ok', true],
  ['10482119', '@lina.k', '1 204.10 USDT', '1', 'ok', false],
  ['10481977', '@tradeplus', '88.00 USDT', '0', 'na', false],
  ['10481503', '@mike_d', '3 450.00 USDT', '3', 'wait', false],
  ['10481266', '@sofia_r', '12.30 USDT', '1', 'ok', false],
  ['10480934', '@den4ik', '240.75 USDT', '0', 'na', false],
] as const;
const NAV_ICONS = ['user', 'wallet', 'card', 'at', 'grid'] as const;

export const ADMIN_W = 1120;
export const ADMIN_H = 660;

const Ic = ({ name, size = 16 }: { name: string; size?: number }) => (
  <span className="adm-ic" dangerouslySetInnerHTML={{ __html: ic(name, size, 1.8) }} />
);

/**
 * PRD §7.4 — admin mockup redrawn as the reference app shell. Texts, demo data and structure
 * (sidebar, KPIs, table, ticket) come from the prototype unchanged. Fixed design size, scaled by ScaleToFit.
 */
export function AdminShell({ lang }: { lang: Lang }) {
  const A = ADM[lang];
  return (
    <ScaleToFit width={ADMIN_W} height={ADMIN_H}>
      <div className="adm brandable" role="img" aria-label={A.brand}>
        <div className="adm-in" aria-hidden="true">
          <div className="adm-bar">
            <i />
            <i />
            <i />
            <span>{A.url}</span>
          </div>
          <div className="adm-main">
            <div className="adm-side">
              <div className="adm-logo">
                <i />
                {A.brand}
              </div>
              {A.nav.map((n, i) => (
                <div key={n} className={`adm-nav${i === 0 ? ' on' : ''}`}>
                  <Ic name={NAV_ICONS[i] ?? 'grid'} />
                  {n}
                  {i === 3 && <em>3</em>}
                </div>
              ))}
            </div>
            <div className="adm-c">
              <div className="adm-head">
                <h4>{A.h}</h4>
                <span className="adm-search">
                  <Ic name="scan" size={14} />
                  {A.search}
                </span>
              </div>
              <div className="adm-kpis">
                {A.k.map(([label, value]) => (
                  <div key={label} className="adm-kpi">
                    <span>{label}</span>
                    <b>{value}</b>
                  </div>
                ))}
              </div>
              <div className="adm-table">
                <table>
                  <thead>
                    <tr>
                      {A.th.map((t) => (
                        <th key={t}>{t}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((r, i) => (
                      <tr key={r[0]} className={r[5] ? 'sel' : undefined}>
                        <td>{r[0]}</td>
                        <td>{r[1]}</td>
                        <td>{r[2]}</td>
                        <td>{r[3]}</td>
                        <td>
                          <span className={`st st-${r[4]}`}>{A.kyc[r[4]]}</span>
                        </td>
                        <td>{A.ago[i]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="adm-r">
              <h5>{A.tk}</h5>
              <div className="adm-msg">
                {A.m1}
                <small>{A.t1}</small>
              </div>
              <div className="adm-msg me">
                {A.m2}
                <small>{A.t2}</small>
              </div>
              <div className="adm-reply">
                <span>{A.reply}</span>
                <div>
                  <b className="s">{A.resolve}</b>
                  <b className="p">{A.send}</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScaleToFit>
  );
}
