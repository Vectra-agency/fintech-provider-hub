/**
 * PRD §8: dictionaries must match the prototype verbatim.
 *  - two-part headings ([part1, part2]) must join with a single space into the prototype text;
 *  - every other string, list and key must be identical; functions (lead.tpl) must give the same output.
 *
 *   pnpm check:headings
 */
import { loadPrototype } from './lib/prototype';
import { en } from '../src/content/en';
import { ru } from '../src/content/ru';
import { SS } from '../src/content/screens';
import { ADM } from '../src/content/admin';
import { TG_HANDLE } from '../src/lib/i18n';
import { readFileSync } from 'node:fs';
import { PROTOTYPE_PATH } from './lib/prototype';
import { META_DESC_OVERRIDES, META_DESC_MAX, metaDesc } from '../src/content/meta';
import { PAGE_KEYS } from '../src/lib/routes';

const errors: string[] = [];
let headings = 0;
let strings = 0;

const isPair = (v: unknown): v is readonly [string, string] =>
  Array.isArray(v) && v.length === 2 && v.every((x) => typeof x === 'string');

function cmp(ours: unknown, proto: unknown, path: string) {
  if (typeof proto === 'string') {
    if (typeof ours === 'string') {
      strings++;
      if (ours !== proto) errors.push(`${path}\n    ours:  ${JSON.stringify(ours)}\n    proto: ${JSON.stringify(proto)}`);
    } else if (isPair(ours)) {
      headings++;
      if (ours.join(' ') !== proto) errors.push(`${path} (two-part)\n    ours:  ${JSON.stringify(ours.join(' '))}\n    proto: ${JSON.stringify(proto)}`);
      if (ours.some((p) => p !== p.trim() || !p)) errors.push(`${path}: heading part has stray whitespace or is empty`);
    } else errors.push(`${path}: expected string, got ${typeof ours}`);
    return;
  }
  if (typeof proto === 'function') {
    if (typeof ours !== 'function') return void errors.push(`${path}: expected function`);
    for (const arg of ['X', 'White Label Wallet', 'Карточные программы']) {
      const a = (ours as (s: string) => string)(arg);
      const b = (proto as (s: string) => string)(arg);
      if (a !== b) errors.push(`${path}(${arg}) differs`);
    }
    return;
  }
  if (Array.isArray(proto)) {
    if (!Array.isArray(ours)) return void errors.push(`${path}: expected array`);
    if (ours.length !== proto.length) errors.push(`${path}: length ${ours.length} ≠ ${proto.length}`);
    proto.forEach((p, i) => cmp(ours[i], p, `${path}[${i}]`));
    return;
  }
  if (proto && typeof proto === 'object') {
    if (!ours || typeof ours !== 'object') return void errors.push(`${path}: expected object`);
    const ok = new Set(Object.keys(ours));
    for (const k of Object.keys(proto)) {
      if (!ok.has(k)) errors.push(`${path}.${k}: missing`);
      else cmp((ours as Record<string, unknown>)[k], (proto as Record<string, unknown>)[k], `${path}.${k}`);
      ok.delete(k);
    }
    for (const k of ok) errors.push(`${path}.${k}: not in prototype`);
    return;
  }
  if (ours !== proto) errors.push(`${path}: ${String(ours)} ≠ ${String(proto)}`);
}

const p = loadPrototype();
cmp(en, p.T.en, 'T.en');
cmp(ru, p.T.ru, 'T.ru');
cmp(SS.en, p.SS.en, 'SS.en');
cmp(SS.ru, p.SS.ru, 'SS.ru');
cmp(ADM.en, p.ADM.en, 'ADM.en');
cmp(ADM.ru, p.ADM.ru, 'ADM.ru');

const protoHandle = /const TG_HANDLE = '([^']+)'/.exec(readFileSync(PROTOTYPE_PATH, 'utf8'))?.[1];
if (protoHandle !== TG_HANDLE) errors.push(`TG_HANDLE: ${TG_HANDLE} ≠ prototype ${protoHandle}`);

// metaDesc: overrides must be verbatim prototype text; every description must fit the limit
const allText = (v: unknown): string[] =>
  typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(allText) : v && typeof v === 'object' ? Object.values(v).flatMap(allText) : [];
for (const lang of ['en', 'ru'] as const) {
  const corpus = allText(p.T[lang]).join('\n');
  for (const [page, text] of Object.entries(META_DESC_OVERRIDES[lang])) {
    if (!corpus.includes(text!)) errors.push(`metaDesc.${lang}.${page}: override is not verbatim prototype text`);
  }
  for (const page of PAGE_KEYS) {
    const d = metaDesc(lang, page);
    if (d.length > META_DESC_MAX) errors.push(`metaDesc.${lang}.${page}: ${d.length} > ${META_DESC_MAX} chars`);
  }
}

if (errors.length) {
  console.error(`✖ ${errors.length} difference(s) from the prototype:\n` + errors.map((e) => '  ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ content matches the prototype: ${strings} strings, ${headings} two-part headings`);
