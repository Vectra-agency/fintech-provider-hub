/**
 * Shape of the site copy. Explicit (not `typeof en`) because EN and RU legitimately differ:
 * RU has the RUB/SBP payout screen (`wdRub`) and different list lengths (PRD §8).
 * Both dictionaries are checked with `satisfies Dict`.
 */
import type { HeadingText } from '@/components/ui/TwoPartHeading';

export type SolutionId = 'wallet' | 'cards' | 'payments' | 'development';
export type ScreenKey = 'wallet' | 'deposit' | 'issue' | 'setup' | 'cards' | 'freeze' | 'wdUsdt' | 'wdAlipay' | 'wdRub';
export type BrandKey = 'ember' | 'ocean' | 'mint' | 'iris';

type Str = string;
type List = readonly Str[];
export type Pair = readonly [Str, Str];
type Pairs = readonly Pair[];
type Screens = readonly ScreenKey[];

type PageHero = { eyebrow: Str; h1: Str; sub: Str };
type DocPage = { eyebrow: Str; h1: Str; draft: Str; updated: Str; s: Pairs };

export interface Dict {
  langName: Str;
  otherName: Str;
  screens: Record<Exclude<ScreenKey, 'wdRub'>, Str> & { wdRub?: Str };
  meta: Record<'home' | 'wallet' | 'cards' | 'payments' | 'development' | 'projects' | 'about' | 'contact' | 'privacy' | 'terms' | '404', Str>;
  nav: Record<'solutions' | 'features' | 'projects' | 'about' | 'contact' | 'demo' | 'menu' | 'close' | 'skip', Str>;
  sol: readonly { id: SolutionId; name: Str; short: Str }[];
  home: {
    eyebrow: Str;
    h1: HeadingText;
    sub: Str;
    cta1: Str;
    cta2: Str;
    tryBrand: Str;
    brands: Record<BrandKey, Str>;
    specs: Pairs;
    show: {
      h2: HeadingText;
      sub: Str;
      tabs: readonly { id: 'wallet' | 'issue' | 'manage' | 'pay'; label: Str; title: Str; pts: List; phones: Screens }[];
    };
    solutions: { h2: Str; sub: Str; more: Str };
    features: { h2: Str; sub: Str; items: Pairs };
    how: { h2: Str; steps: Pairs };
    managed: { h2: HeadingText; sub: Str; cols: readonly (readonly [Str, List])[]; adminT: Str; adminD: Str };
    projects: { h2: Str; kicker: Str; title: Str; desc: Str; tags: List; note: Str; cta: Str };
    about: { h2: Str; p: Str; facts: Pairs; more: Str };
  };
  lead: {
    h2: HeadingText;
    sub: Str;
    topicL: Str;
    topics: List;
    msgL: Str;
    tpl: (topic: string) => string;
    copy: Str;
    copied: Str;
    copyFail: Str;
    open: Str;
    direct: Str;
  };
  pages: {
    wallet: PageHero & {
      cta: Str;
      phones: Screens;
      incH: Str;
      coreT: Str;
      core: List;
      optT: Str;
      opt: List;
      brandH: Str;
      brandP: Str;
      brandPts: List;
      adminH: Str;
      adminP: Str;
      intH: Str;
      ints: Pairs;
      modelH: Str;
      modelP: Str;
      modelKeep: Str;
      roadH: Str;
      road: Pairs;
      stepsH: Str;
    };
    cards: PageHero & {
      cta: Str;
      phones: Screens;
      typesH: Str;
      types: Pairs;
      binH: Str;
      binP: Str;
      bins: List;
      apiH: Str;
      api: List;
      useH: Str;
      uses: List;
      reqH: Str;
      req: List;
      disc: Str;
      mgmtH: Str;
      mgmtPhones: Screens;
    };
    payments: PageHero & { cta: Str; phones: Screens; dirH: Str; dirs: Pairs; flowH: Str; flow: Pairs; note: Str };
    development: PageHero & { cta: Str; capH: Str; caps: Pairs; procH: Str; proc: Pairs; stackH: Str; stack: List };
    projects: PageHero & { groups: readonly (readonly [Str, Str, Screens])[]; note: Str };
    about: PageHero & { doH: Str; dos: Pairs; notH: Str; notP: Str; forH: Str; fors: List; coH: Str; co: Pairs };
    contact: PageHero;
    privacy: DocPage;
    terms: DocPage;
    '404': { h1: Str; sub: Str; cta: Str };
  };
  footer: { tag: Str; disc: Str; company: Str; legal: Str; rights: Str };
}

/** Phone-screen copy (`SS`). RU-only keys belong to the RUB/SBP payout screen. */
export type ScreenStrings = Record<
  | 'close' | 'back' | 'topup' | 'topupSub' | 'withdraw' | 'withdrawSub' | 'inWallet' | 'onCards' | 'history' | 'all' | 'allOps'
  | 'walletTab' | 'today' | 'yesterday' | 'h1n' | 'h1d' | 'h2n' | 'h2d' | 'h2a' | 'h3n' | 'h3d' | 'h4n' | 'h4d' | 'h5n' | 'h5d'
  | 'payQr' | 'depTitle' | 'depSub' | 'network' | 'addrNote' | 'share' | 'newCard' | 'canIssue' | 'virt' | 'instant' | 'virtDesc'
  | 'v1' | 'v2' | 'v3' | 'issueFee' | 'monthly' | 'yourPrice' | 'issueBtn' | 'phys' | 'soon' | 'physDesc' | 'notify' | 'setupSub'
  | 'balance' | 'design' | 'graphite' | 'flame' | 'sunset' | 'cardName' | 'travel' | 'onlyYou' | 'fromWallet' | 'swipeIssue'
  | 'myCards' | 'subs' | 'of3' | 'main' | 'topupC' | 'freeze' | 'details' | 'ops' | 'o1' | 'o1d' | 'o2' | 'o2d' | 'o3' | 'o3d'
  | 'o4' | 'o4d' | 'declined' | 'nWallet' | 'nCards' | 'nServices' | 'frzQ' | 'frzD' | 'cancel' | 'wdUsdt' | 'wdUsdtSub'
  | 'recipient' | 'amount' | 'max' | 'avail' | 'netFee' | 'netFeeV' | 'code2fa' | 'code2faPh' | 'pasteB' | 'confirm' | 'wdAli'
  | 'wdAliSub' | 'youSend' | 'youGet' | 'all2' | 'rate' | 'fee' | 'feeV' | 'rateNote' | 'recip' | 'accData' | 'qrCode' | 'accNo'
  | 'wdAliBtn' | 'wdAliBtnS',
  string
> &
  Partial<Record<'wdRub' | 'wdRubSub' | 'bank' | 'bankPh' | 'phoneL' | 'feesL' | 'feesV' | 'rateNoteR' | 'swipeReq', string>>;

/** Admin mockup copy (`ADM`). */
export interface AdminStrings {
  url: Str;
  brand: Str;
  nav: List;
  h: Str;
  search: Str;
  k: Pairs;
  th: List;
  kyc: Record<'ok' | 'wait' | 'na', Str>;
  tk: Str;
  m1: Str;
  m2: Str;
  t1: Str;
  t2: Str;
  reply: Str;
  send: Str;
  resolve: Str;
  ago: List;
}
