/**
 * Mini-widgets for the Platform Features bento (PRD §6.1 item 5): fragments of the phone screens with
 * the prototype's demo data only — no new figures (PRD §9.5). Server-only HTML strings, aria-hidden.
 */
import 'server-only';
import type { ScreenStrings } from '@/content/types';
import { coin, e, ic } from './screens';

export type WidgetKind = 'networks' | 'freeze' | 'quote' | 'username';

const chip = (a: string, b: string, on?: boolean, wide?: boolean) =>
  `<span class="s-chip${on ? ' on' : ''}${wide ? ' wide' : ''}" style="height:48px">${a}<small>${b}</small></span>`;

export const WIDGETS: Record<WidgetKind, (L: ScreenStrings) => string> = {
  // from the deposit / withdraw screens: network picker
  networks: (L) =>
    `<div class="s-white" style="padding:16px;display:flex;flex-direction:column;gap:10px"><span class="s-lbl">${e(L.network)}</span>` +
    `<div class="s-chipgrid">${chip('TRC-20', 'TRON', true)}${chip('TON', 'The Open Network')}${chip('ERC-20', 'Ethereum')}${chip('BEP-20', 'BNB Chain')}${chip('Solana', 'SPL', false, true)}</div></div>`,

  // from the "My cards" freeze sheet
  freeze: (L) =>
    `<div class="s-white" style="padding:18px 16px 10px;display:flex;flex-direction:column;gap:14px">` +
    `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center"><span style="width:56px;height:56px;border-radius:50%;background:#E8F0FE;color:#1F5FD6;display:flex;align-items:center;justify-content:center">${ic('snow', 26, 1.8)}</span>` +
    `<b style="font-size:19px;letter-spacing:-.3px">${e(L.frzQ)}</b><span style="color:#3E434B;line-height:1.4;font-size:14px">${e(L.frzD)}</span></div>` +
    `<span class="s-dark-btn">${ic('snow', 18, 2)}${e(L.freeze)}</span>` +
    `<span style="height:40px;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:15px">${e(L.cancel)}</span></div>`,

  // from the Alipay payout screen: amounts + rate locked with the 30-second timer
  quote: (L) =>
    `<div class="s-white" style="padding:8px;display:flex;flex-direction:column;gap:6px;position:relative">` +
    `<div class="s-xbox" style="flex-direction:column;align-items:stretch;gap:6px"><span class="s-muted" style="font-size:14px;color:#3E434B">${e(L.youSend)}</span><span style="display:flex;justify-content:space-between;align-items:center"><span class="big">140.45</span><span class="s-cur">${coin('₮', 'usdt')}USDT</span></span></div>` +
    `<span class="s-swap" style="top:50%">${ic('down', 18, 2.2)}</span>` +
    `<div class="s-xbox" style="flex-direction:column;align-items:stretch;gap:6px"><span class="s-muted" style="font-size:14px;color:#3E434B">${e(L.youGet)}</span><span style="display:flex;justify-content:space-between;align-items:center"><span class="big">1 000</span><span class="s-cur"><span class="s-coin" style="background:#C8102E;font-size:13px">¥</span>CNY</span></span></div></div>` +
    `<div class="s-white" style="padding:2px 16px"><div class="s-kv"><span>${e(L.rate)}</span><span style="display:flex;align-items:center"><b class="s-num">1 USDT = 7.12 ¥</b><span class="s-timer">0:21</span></span></div></div>`,

  // transfer by @username: recipient/amount/confirm labels of the withdraw screens, demo user from the admin rows
  username: (L) =>
    `<div class="s-white" style="padding:16px;display:flex;flex-direction:column;gap:10px"><span class="s-lbl">${e(L.recip)}</span>` +
    `<span class="s-field"><span style="font-weight:600">@alex_m</span><span style="color:var(--bi);display:flex">${ic('at', 18, 1.9)}</span></span>` +
    `<span class="s-lbl" style="margin-top:4px">${e(L.amount)}</span><span class="s-field"><b class="s-num" style="font-size:19px;font-weight:600">150.00</b><span style="font-weight:600;color:#3E434B">USDT</span></span>` +
    `<span class="s-cta" style="position:static;height:52px;font-size:16px">${e(L.confirm)}</span></div>`,
};
