/**
 * Phone screens — ported from the prototype (`SCREENS`, helpers, pseudo-QR) as HTML string builders.
 * Rendered on the server only (no client JS); the screens' own design is the client's product UI and is
 * kept as is, recoloured through the brand variables (PRD §4.3.3, §7.3). Dictionary text is escaped.
 * Demo numbers and identifiers below are the prototype's demo data — do not add new ones (PRD §9.5).
 */
import 'server-only';
import type { Lang } from '@/lib/i18n';
import type { ScreenKey, ScreenStrings } from '@/content/types';

type L = ScreenStrings & Record<string, string>;

export const e = (s: string | undefined): string =>
  (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const IC: Record<string, string> = {
  back:'<path d="M15 5l-7 7 7 7"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
  qr:'<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M7 12h10"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  down:'<path d="M12 4v14M6 12l6 6 6-6"/>',
  snow:'<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.8L12 6.5l2.5-1.7M9.5 19.2L12 17.5l2.5 1.7"/>',
  info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.5"/>',
  card:'<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  swap:'<path d="M7 4L4 7l3 3M4 7h13M17 20l3-3-3-3M20 17H7"/>',
  wallet:'<path d="M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M4 7l11-3v3"/><circle cx="16" cy="13.5" r="1.2"/>',
  grid:'<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  paste:'<rect x="6" y="4" width="12" height="17" rx="2.5"/><path d="M9 4h6v3H9z"/>',
  scan:'<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/>',
  bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  pen:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  chev:'<path d="M6 9l6 6 6-6"/>',
  bank:'<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
  share:'<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5"/><path d="M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"/>',
  send:'<path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/>',
  at:'<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>'
};
export function ic(n: string, s = 20, w = 2): string { return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`; }
export const DOTS = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5.5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="18.5" cy="12" r="1.7"/></svg>';
/* neutral "your brand" mark — replaces client logos and card-scheme marks */
export function mark(s = 44, fill = 'var(--b1)'): string { return `<svg width="${s}" height="${s}" viewBox="0 0 48 48" aria-hidden="true"><path d="M7 41C7 20 19 7 41 7C41 28 28 41 7 41Z" style="fill:${fill}"/><path d="M14 34L30 18" stroke="#fff" stroke-opacity=".6" stroke-width="2.4" stroke-linecap="round"/></svg>`; }

/* deterministic pseudo-QR */
export const QR = (() => {
  const n = 25, c = 6; let seed = 7, r = '';
  const rnd = (): number => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const finder = (x: number, y: number) => x < 7 && y < 7 || x >= n - 7 && y < 7 || x < 7 && y >= n - 7;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { if (finder(x, y)) continue; if (rnd() > .52) r += `M${x*c} ${y*c}h${c}v${c}h-${c}z`; }
  const f = (x: number, y: number) => `<rect x="${x*c+3}" y="${y*c+3}" width="${6*c}" height="${6*c}" rx="7" fill="none" stroke="#121416" stroke-width="${c}"/><rect x="${x*c+2*c}" y="${y*c+2*c}" width="${3*c}" height="${3*c}" rx="3" fill="#121416"/>`;
  return `<svg width="176" height="176" viewBox="0 0 ${n*c} ${n*c}" aria-hidden="true"><path d="${r}" fill="#121416"/>${f(0,0)}${f(n-7,0)}${f(0,n-7)}</svg>`;
})();

const statusBar = (): string => `<div class="s-status"><span>9:41</span><span class="s-sb"><svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1" fill="#121416"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="#121416"/><rect x="10" y="3" width="3" height="9" rx="1" fill="#121416"/><rect x="15" y="0" width="3" height="12" rx="1" fill="#121416"/></svg><svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="#121416" opacity=".4"/><rect x="2" y="2" width="18" height="9" rx="2" fill="#121416"/><rect x="24.5" y="4" width="2" height="5" rx="1" fill="#121416" opacity=".4"/></svg></span></div>`;
const sTop = (L: L, back?: 1) => `<div class="s-top">${back ? `<span class="s-pill">${ic('back',16,2.4)}${e(L.back)}</span>` : `<span class="s-pill">${e(L.close)}</span>`}<span class="s-pill dots">${DOTS}</span></div>`;
export const coin = (t: string, k: string) => `<span class="s-coin c-${k}">${t}</span>`;
const row = (ico: string, bg: string, fg: string, n: string, d: string, a: string, pos?: 1) => `<div class="s-row"><span class="s-ico" style="background:${bg};color:${fg}">${ico}</span><div class="s-rt"><b>${n}</b><span class="s-muted">${d}</span></div><span class="s-amt${pos ? ' pos' : ''}">${a}</span></div>`;
const cardArt = (L: L, kind: string, bal: string, name: string, num: string, eye?: 1) => `<div class="cart ca-${kind}"><span class="t">${e(L.balance)}${eye ? ' ' + ic('eye',16,1.8) : ''}</span><span class="bal">${bal}</span><span class="bt"><span class="nm">${name}${eye ? '' : ''}<span>${num}</span></span>${mark(30,'#fff')}</span></div>`;

function cardsScreen(L: L, lang: Lang, sheet?: 1): string {
    const act = (i: string, t: string) => `<span class="s-glass" style="height:88px;border-radius:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;font-size:14px;font-weight:600">${i}${t}</span>`;
    const op = (k: string, n: string, d: string, a: string) => { const top = k === 't', f = k === 'f';
      return `<div class="s-row"><span class="s-ico" style="background:${top ? '#E3F6EE' : '#F0F1F4'};color:${top ? '#0F6B4C' : '#3E434B'}">${ic(top ? 'down' : f ? 'x' : 'card',20,2)}</span><div class="s-rt"><b>${n}</b><span class="s-muted">${d}</span></div><span style="display:flex;flex-direction:column;align-items:flex-end;gap:4px"><span class="s-amt${top ? ' pos' : ''}" style="${f ? 'color:#646973;text-decoration:line-through' : ''}">${a}</span>${f ? `<span class="s-badge bd-red">${e(L.declined)}</span>` : ''}</span></div>`; };
    return `${statusBar()}<div class="s-body">${sTop(L)}
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 2px 2px 4px"><span style="display:flex;align-items:baseline;gap:10px"><h3 class="s-h1">${e(L.myCards)}</h3><span style="color:#3E434B;font-weight:500">${e(L.of3)}</span></span><span class="s-glass" style="width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center">${ic('plus',22,2.2)}</span></div>
      <div style="margin:0 -16px;overflow:hidden"><div style="display:flex;gap:12px;padding:4px 16px 18px">${cardArt(L,'graphite','$412.70',e(L.main) + ' ' + ic('pen',13,2),'•••• 4137',1)}${cardArt(L,'flame','$73.50',e(L.subs),'•••• 9021',1)}</div></div>
      <div style="display:flex;justify-content:center;gap:8px;margin:-16px 0 -2px"><span style="width:18px;height:6px;border-radius:3px;background:var(--b1)"></span><span style="width:6px;height:6px;border-radius:3px;background:rgba(18,20,22,.2)"></span></div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">${act(ic('down',24,2),e(L.topupC))}${act(ic('snow',24,1.8),e(L.freeze))}${act(ic('info',24,2),e(L.details))}</div>
      <div class="s-white" style="padding:14px 20px 8px"><div style="min-height:44px;display:flex;justify-content:space-between;align-items:center"><span class="s-h2">${e(L.ops)}</span><span class="s-link">${e(L.all)}</span></div>
        ${op('t',e(L.o1),e(L.o1d),'+$100.00')}${op('b',e(L.o2),e(L.o2d),'−$20.00')}${op('f',e(L.o3),e(L.o3d),'−$7.07')}${op('b',e(L.o4),e(L.o4d),'−$379.00')}</div>
    </div><div class="s-fade"></div>
    <div class="s-nav"><span>${ic('wallet',22,1.9)}${e(L.nWallet)}</span><span class="on">${ic('card',22,2)}${e(L.nCards)}</span><span>${ic('grid',22,1.9)}${e(L.nServices)}</span></div><span class="s-fab">${ic('qr',26,2.1)}</span>
    ${sheet ? `<div class="s-scrim"></div><div class="s-sheet"><span class="s-grab"></span><div style="display:flex;flex-direction:column;align-items:center;gap:8px;padding-top:8px;text-align:center"><span style="width:64px;height:64px;border-radius:50%;background:#E8F0FE;color:#1F5FD6;display:flex;align-items:center;justify-content:center">${ic('snow',30,1.8)}</span><b style="font-size:22px;letter-spacing:-.3px">${e(L.frzQ)}</b><span style="max-width:320px;color:#3E434B;line-height:1.4">${e(L.frzD)}</span></div><span class="s-dark-btn">${ic('snow',18,2)}${e(L.freeze)}</span><span style="height:48px;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:16px">${e(L.cancel)}</span></div>` : ''}`;
  }

export const SCREENS: Record<ScreenKey, (L: L, lang: Lang) => string> = {
  wallet(L: L, lang: Lang) {
    const tc = lang === 'ru' ? coin('СБП','sbp') + coin('USDT','usdt') : coin('USDT','usdt') + coin('$','usd') + coin('€','eur');
    const wc = coin('USDT','usdt') + (lang === 'ru' ? coin('₽','rub') : '') + coin('Ali','ali');
    const r2 = lang === 'ru' ? row('<span style="font-size:10px">СБП</span>','#EEE8FF','#4B2DB3',e(L.h2n),e(L.h2d),e(L.h2a),1) : row(ic('down',20),'#E3F6EE','#0F6B4C',e(L.h2n),e(L.h2d),e(L.h2a),1);
    return `${statusBar()}<div class="s-body">${sTop(L)}
      <div style="display:flex;align-items:center;gap:14px;padding:14px 8px 10px"><span style="width:60px;height:60px;border-radius:50%;background:#fff;color:var(--bi);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px var(--bs)">${ic('user',28,1.9)}</span><span style="font-size:19px;font-weight:700;display:flex;align-items:center;gap:8px">UID 10482736 <span style="color:#3E434B">${ic('copy',17,1.9)}</span></span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="s-glass" style="height:142px;padding:18px;display:flex;flex-direction:column;justify-content:space-between"><span class="s-grad" style="font-size:23px;font-weight:700;letter-spacing:-.4px;align-self:flex-start">${e(L.topup)}</span><span style="display:flex;flex-direction:column;gap:8px"><span style="color:#3E434B">${e(L.topupSub)}</span><span class="s-coins">${tc}</span></span></div>
        <div class="s-glass" style="height:142px;padding:18px;display:flex;flex-direction:column;justify-content:space-between"><span style="font-size:23px;font-weight:700;letter-spacing:-.4px">${e(L.withdraw)}</span><span style="display:flex;flex-direction:column;gap:8px"><span style="color:#3E434B">${e(L.withdrawSub)}</span><span class="s-coins">${wc}</span></span></div>
      </div>
      <div class="s-glass" style="height:104px;padding:0 24px 0 22px;display:flex;align-items:center;justify-content:space-between"><span style="display:flex;flex-direction:column;gap:2px"><span class="s-num" style="font-size:34px;font-weight:700;letter-spacing:-.8px">$612.45</span><span style="font-size:16px;color:#3E434B">${e(L.inWallet)}</span></span><span style="opacity:.75">${mark(48)}</span></div>
      <div class="s-white" style="padding:22px 20px 20px;display:flex;flex-direction:column;gap:14px"><span class="s-num" style="font-size:26px;font-weight:700;letter-spacing:-.5px">$486.20</span><span style="font-size:16px;color:#3E434B;margin-top:-10px">${e(L.onCards)}</span>
        <div style="display:flex;gap:10px"><span class="minicard mc-silver"><span class="mc-chip"></span><span>4137</span></span><span class="minicard mc-holo"><span style="align-self:flex-end;opacity:.7">${mark(14,'#121416')}</span><span>9021</span></span><span class="minicard mc-add">${ic('plus',22,1.8)}</span></div></div>
      <div class="s-white" style="padding:22px 20px 10px;display:flex;flex-direction:column;gap:14px"><div style="display:flex;justify-content:space-between;align-items:center"><span class="s-h2">${e(L.history)}</span><span class="s-link">${e(L.all)}</span></div>
        <div class="s-seg"><span class="on">${e(L.allOps)}</span><span>${e(L.walletTab)}</span></div>
        <div><div class="s-muted" style="font-weight:600;padding:4px 0 2px">${e(L.today)}</div>
        ${row(ic('card',20,1.9),'#ECEEF2','#3E434B',e(L.h1n),e(L.h1d),'−$20.00')}${r2}${row('USDT','#1A7F5F','#fff',e(L.h3n),e(L.h3d),'+50.00 USDT',1)}
        <div class="s-muted" style="font-weight:600;padding:10px 0 2px">${e(L.yesterday)}</div>${row(ic('swap',20,1.9),'var(--bt)','var(--bi)',e(L.h4n),e(L.h4d),'+12.6 TON')}</div></div>
    </div><div class="s-fade"></div><span class="s-cta narrow">${ic('qr',24,2.1)}${e(L.payQr)}</span>`;
  },
  deposit(L: L) {
    const ch = (a: string, b: string, on?: 0 | 1, w?: 0 | 1) => `<span class="s-chip${on ? ' on' : ''}${w ? ' wide' : ''}" style="height:48px">${a}<small>${b}</small></span>`;
    return `${statusBar()}<div class="s-body">${sTop(L,1)}
      <div class="s-title"><h3 class="s-h1">${e(L.depTitle)}</h3><span class="s-sub">${e(L.depSub)}</span></div>
      <div class="s-white" style="padding:16px;display:flex;flex-direction:column;gap:10px"><span class="s-lbl">${e(L.network)}</span>
        <div class="s-chipgrid">${ch('TRC-20','TRON',1)}${ch('TON','The Open Network')}${ch('ERC-20','Ethereum')}${ch('BEP-20','BNB Chain')}${ch('Solana','SPL',0,1)}</div></div>
      <div class="s-white" style="padding:16px 18px;display:flex;flex-direction:column;align-items:center;gap:12px"><span class="s-qr" style="padding:10px;border-radius:18px;border:1px solid #E6E8EC;display:flex">${QR}</span>
        <span class="s-field" style="width:100%;font-family:ui-monospace,Menlo,monospace;font-size:14px"><span>TQ7mK3vX9aR2…pL2fD8</span><span style="color:var(--bi)">${ic('copy',18,1.9)}</span></span>
        <span class="s-muted" style="text-align:center;line-height:1.35;font-size:12px">${e(L.addrNote)}</span></div>
    </div><div class="s-fade" style="height:110px"></div><span class="s-cta">${e(L.share)}</span>`;
  },
  issue(L: L) {
    const chk = (t: string) => `<span class="s-check"><i>${ic('check',14,2.6)}</i>${t}</span>`;
    return `${statusBar()}<div class="s-body">${sTop(L,1)}
      <div class="s-title"><h3 class="s-h1">${e(L.newCard)}</h3><span class="s-sub">${e(L.canIssue)}</span></div>
      <div class="s-white" style="padding:18px 16px;display:flex;flex-direction:column;gap:14px">
        <div style="display:flex;gap:14px;align-items:center"><span style="width:90px;height:58px;border-radius:12px;background:linear-gradient(135deg,#34373F,#121318);display:flex;align-items:flex-end;justify-content:flex-end;padding:7px;flex:none">${mark(16,'#fff')}</span><span style="display:flex;flex-direction:column;gap:6px;align-items:flex-start"><b style="font-size:19px">${e(L.virt)}</b><span class="s-badge bd-green">${e(L.instant)}</span></span></div>
        <span style="color:#3E434B">${e(L.virtDesc)}</span>
        <div style="display:flex;flex-direction:column;gap:10px">${chk(e(L.v1))}${chk(e(L.v2))}${chk(e(L.v3))}</div>
        <div style="background:#F3F4F7;border-radius:16px;padding:2px 16px"><div class="s-kv"><span>${e(L.issueFee)}</span><b>${e(L.yourPrice)}</b></div><div class="s-kv"><span>${e(L.monthly)}</span><b>${e(L.yourPrice)}</b></div></div>
        <span class="s-cta" style="position:static;height:56px">${e(L.issueBtn)}</span></div>
      <div class="s-white" style="padding:18px 16px;display:flex;flex-direction:column;gap:14px;background:rgba(255,255,255,.7)">
        <div style="display:flex;gap:14px;align-items:center"><span style="width:90px;height:58px;border-radius:12px;background:linear-gradient(135deg,#6B6E76,#3A3C42);display:flex;flex-direction:column;justify-content:space-between;padding:7px;flex:none"><span style="width:12px;height:9px;border-radius:2px;background:#D9B65C"></span><span style="align-self:flex-end">${mark(16,'#fff')}</span></span><span style="display:flex;flex-direction:column;gap:6px;align-items:flex-start"><b style="font-size:19px">${e(L.phys)}</b><span class="s-badge bd-grey">${e(L.soon)}</span></span></div>
        <span style="color:#3E434B">${e(L.physDesc)}</span><span class="s-ghost-btn">${ic('bell',18,1.9)}${e(L.notify)}</span></div>
    </div>`;
  },
  setup(L: L) {
    return `${statusBar()}<div class="s-body">${sTop(L,1)}
      <div class="s-title"><h3 class="s-h1">${e(L.virt)}</h3><span class="s-sub">${e(L.setupSub)}</span></div>
      <div style="display:flex;justify-content:center;padding:2px 0">${cardArt(L,'graphite','$0.00',e(L.travel),'•••• ••••')}</div>
      <div class="s-white" style="padding:18px 16px;display:flex;flex-direction:column;gap:12px"><span class="s-lbl">${e(L.design)}</span>
        <div style="display:flex;gap:8px"><span class="dsw on"><i style="background:linear-gradient(135deg,#34373F,#121318)"></i>${e(L.graphite)}</span><span class="dsw"><i style="background:linear-gradient(135deg,#D9420E,#7A1606)"></i>${e(L.flame)}</span><span class="dsw"><i style="background:linear-gradient(120deg,#FF8A3D,#F2557D,#8B5CF6)"></i>${e(L.sunset)}</span></div>
        <span class="s-lbl" style="margin-top:4px">${e(L.cardName)}</span><span class="s-field"><span style="font-weight:500">${e(L.travel)}</span><span class="s-muted">${L.travel.length}/20</span></span><span class="s-muted">${e(L.onlyYou)}</span></div>
      <div class="s-white" style="padding:2px 16px"><div class="s-kv"><span style="color:#3E434B">${e(L.issueFee)}</span><b>${e(L.yourPrice)}</b></div><div class="s-kv"><span style="color:#3E434B">${e(L.fromWallet)}</span><b class="s-num">612.45 USDT</b></div></div>
    </div><div class="s-fade"></div><span class="s-swipe"><i>${ic('arrow',22,2.4)}</i>${e(L.swipeIssue)}</span>`;
  },
  cards: (L: L, lang: Lang) => cardsScreen(L, lang),
  freeze: (L: L, lang: Lang) => cardsScreen(L, lang, 1),
  wdUsdt(L: L) {
    const ch = (a: string, b: string, on?: 0 | 1, w?: 0 | 1) => `<span class="s-chip${on ? ' on' : ''}${w ? ' wide' : ''}" style="height:52px">${a}<small>${b}</small></span>`;
    return `${statusBar()}<div class="s-body">${sTop(L,1)}
      <div class="s-title"><h3 class="s-h1">${e(L.wdUsdt)}</h3><span class="s-sub">${e(L.wdUsdtSub)}</span></div>
      <div class="s-white" style="padding:16px;display:flex;flex-direction:column;gap:10px"><span class="s-lbl">${e(L.network)}</span><div class="s-chipgrid">${ch('TRC-20','TRON',1)}${ch('TON','The Open Network')}${ch('ERC-20','Ethereum')}${ch('BEP-20','BNB Chain')}${ch('Solana','SPL',0,1)}</div></div>
      <div class="s-white" style="padding:16px;display:flex;flex-direction:column;gap:10px"><span class="s-lbl">${e(L.recipient)}</span><span class="s-field" style="font-family:ui-monospace,Menlo,monospace;font-size:14px"><span style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis">TLm4qR8sV2xN6bH9cK3wP7yD</span><span style="display:flex;gap:14px;color:#3E434B">${ic('paste',18,1.9)}${ic('scan',18,1.9)}</span></span>
        <span class="s-lbl" style="margin-top:4px">${e(L.amount)}</span><span class="s-field" style="padding-right:6px"><b class="s-num" style="font-size:19px;font-weight:600">150.00</b><span style="display:flex;align-items:center;gap:10px;font-weight:600;color:#3E434B">USDT<span style="height:40px;padding:0 14px;border-radius:12px;background:var(--bt);color:var(--bi);display:flex;align-items:center">${e(L.max)}</span></span></span>
        <span class="s-muted">${e(L.avail)}</span><div style="background:#F3F4F7;border-radius:14px;padding:0 14px"><div class="s-kv"><span>${e(L.netFee)}</span><b>${e(L.netFeeV)}</b></div></div></div>
      <div class="s-white" style="padding:16px;display:flex;flex-direction:column;gap:10px"><span class="s-lbl">${e(L.code2fa)}</span><span class="s-field ph"><span>${e(L.code2faPh)}</span><span style="height:38px;padding:0 12px;border-radius:10px;background:#fff;color:#3E434B;font-size:14px;font-weight:600;display:flex;align-items:center">${e(L.pasteB)}</span></span></div>
    </div><div class="s-fade"></div><span class="s-cta">${e(L.confirm)}</span>`;
  },
  wdAlipay(L: L) {
    return `${statusBar()}<div class="s-body">${sTop(L,1)}
      <div class="s-title"><h3 class="s-h1">${e(L.wdAli)}</h3><span class="s-sub">${e(L.wdAliSub)}</span></div>
      <div class="s-white" style="padding:8px;display:flex;flex-direction:column;gap:6px;position:relative">
        <div class="s-xbox" style="flex-direction:column;align-items:stretch;gap:6px"><span class="s-muted" style="font-size:14px;color:#3E434B">${e(L.youSend)}</span><span style="display:flex;justify-content:space-between;align-items:center"><span class="big">140.45</span><span class="s-cur">${coin('₮','usdt')}USDT</span></span><span style="display:flex;justify-content:space-between"><span class="s-muted">${e(L.avail)}</span><span style="font-size:13px;font-weight:600;color:var(--bi)">${e(L.all2)}</span></span></div>
        <span class="s-swap" style="top:50%">${ic('down',18,2.2)}</span>
        <div class="s-xbox" style="flex-direction:column;align-items:stretch;gap:6px"><span class="s-muted" style="font-size:14px;color:#3E434B">${e(L.youGet)}</span><span style="display:flex;justify-content:space-between;align-items:center"><span class="big">1 000</span><span class="s-cur"><span class="s-coin" style="background:#C8102E;font-size:13px">¥</span>CNY</span></span></div></div>
      <div class="s-white" style="padding:2px 16px"><div class="s-kv"><span>${e(L.rate)}</span><span style="display:flex;align-items:center"><b class="s-num">1 USDT = 7.12 ¥</b><span class="s-timer">0:21</span></span></div><div class="s-kv"><span>${e(L.fee)}</span><b>${e(L.feeV)}</b></div></div>
      <span class="s-muted" style="padding:0 6px;line-height:1.4">${e(L.rateNote)}</span>
      <div class="s-white" style="padding:16px;display:flex;flex-direction:column;gap:10px"><span class="s-lbl">${e(L.recip)}</span><div class="s-seg"><span class="on">${e(L.accData)}</span><span>${e(L.qrCode)}</span></div><span class="s-lbl" style="margin-top:2px">${e(L.accNo)}</span><span class="s-field ph">7-9001234567</span></div>
    </div><div class="s-fade"></div><span class="s-cta">${e(L.wdAliBtn)}<small>${e(L.wdAliBtnS)}</small></span>`;
  },
  wdRub(L: L) {
    return `${statusBar()}<div class="s-body">${sTop(L,1)}
      <div class="s-title"><h3 class="s-h1">${e(L.wdRub)}</h3><span class="s-sub">${e(L.wdRubSub)}<span class="s-badge bd-brand">P2P</span></span></div>
      <div class="s-white" style="padding:8px;display:flex;flex-direction:column;gap:6px;position:relative">
        <div class="s-xbox" style="flex-direction:column;align-items:stretch;gap:6px"><span class="s-muted" style="font-size:14px;color:#3E434B">${e(L.youSend)}</span><span style="display:flex;justify-content:space-between;align-items:center"><span class="big">111.12</span><span class="s-cur">${coin('₮','usdt')}USDT</span></span><span class="s-muted">${e(L.avail)}</span></div>
        <span class="s-swap" style="top:52%">${ic('down',18,2.2)}</span>
        <div class="s-xbox" style="flex-direction:column;align-items:stretch;gap:6px"><span class="s-muted" style="font-size:14px;color:#3E434B">${e(L.youGet)}</span><span style="display:flex;justify-content:space-between;align-items:center"><span class="big">10 000</span><span class="s-cur">${coin('₽','rub')}RUB</span></span></div></div>
      <div class="s-white" style="padding:2px 16px"><div class="s-kv"><span>${e(L.rate)}</span><span style="display:flex;align-items:center"><b class="s-num">1 USDT = 90.00 ₽</b><span class="s-timer">0:20</span></span></div><div class="s-kv"><span>${e(L.feesL)}</span><b>${e(L.feesV)}</b></div></div>
      <span class="s-muted" style="padding:0 6px;line-height:1.4">${e(L.rateNoteR)}</span>
      <div class="s-white" style="padding:16px;display:flex;flex-direction:column;gap:10px"><span class="s-lbl">${e(L.bank)}</span><span class="s-field"><span style="display:flex;align-items:center;gap:10px;color:#646973">${ic('bank',20,1.8)}${e(L.bankPh)}</span>${ic('chev',18,2)}</span><span class="s-lbl" style="margin-top:2px">${e(L.phoneL)}</span><span class="s-field ph">+7 900 123-45-67</span></div>
    </div><div class="s-fade"></div><span class="s-swipe"><i>${ic('arrow',22,2.4)}</i>${e(L.swipeReq)}</span>`;
  }
};
