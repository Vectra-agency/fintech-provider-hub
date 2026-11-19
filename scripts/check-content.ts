/**
 * Content checks for the dictionaries (en.ts, ru.ts, admin.ts, screens.ts).
 *
 * Until 2026-11-19 the copy had to match the prototype verbatim; since then the owner edits it directly,
 * so this script guards structure and the owner's standing copy rules instead:
 *  - EN and RU have the same object keys (list lengths may differ: RU has RUB/SBP content);
 *  - two-part headings ([part1, part2]) have no empty parts or stray whitespace;
 *  - meta descriptions fit META_DESC_MAX;
 *  - "Hong Kong" / "Гонконг" appears only in the footer, legal pages, company details and the BIN list;
 *  - Russian says "панель управления" / "панель администратора", never "админка".
 *
 *   pnpm check:content
 */
import { en } from '../src/content/en';
import { ru } from '../src/content/ru';
import { ADM } from '../src/content/admin';
import { SS } from '../src/content/screens';
import { META_DESC_MAX, metaDesc } from '../src/content/meta';
import { PAGE_KEYS } from '../src/lib/routes';

const errors: string[] = [];
let strings = 0;

type Visit = (value: string, path: string) => void;
function walk(v: unknown, path: string, visit: Visit) {
  if (typeof v === 'string') return void (strings++, visit(v, path));
  if (typeof v === 'function') return void visit((v as (s: string) => string)('X'), `${path}()`);
  if (Array.isArray(v)) {
    if (v.length === 2 && v.every((x) => typeof x === 'string') && v.some((p) => p !== p.trim() || !p))
      errors.push(`${path}: heading/pair part is empty or has stray whitespace`);
    return v.forEach((x, i) => walk(x, `${path}[${i}]`, visit));
  }
  if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`, visit);
}

// 1. same object keys in both languages (RU-only screen keys are allowed)
const RU_ONLY = new Set(['screens.wdRub']);
function keys(a: unknown, b: unknown, path: string) {
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) || Array.isArray(b)) return;
  const ka = new Set(Object.keys(a));
  const kb = new Set(Object.keys(b));
  for (const k of ka) if (!kb.has(k) && !RU_ONLY.has(`${path}${k}`)) errors.push(`ru.${path}${k}: missing (exists in en)`);
  for (const k of kb) if (!ka.has(k) && !RU_ONLY.has(`${path}${k}`)) errors.push(`en.${path}${k}: missing (exists in ru)`);
  for (const k of ka) if (kb.has(k)) keys((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], `${path}${k}.`);
}
keys(en, ru, '');

// 2–4. per-string rules
const HK = /hong\s*kong|гонконг/i;
const HK_ALLOWED = /^(en|ru)\.(footer\.rights|pages\.(privacy|terms)\.|pages\.about\.co\b|pages\.cards\.bins\b)/;
const sources: [unknown, string][] = [
  [en, 'en'],
  [ru, 'ru'],
  [ADM.en, 'ADM.en'],
  [ADM.ru, 'ADM.ru'],
  [SS.en, 'SS.en'],
  [SS.ru, 'SS.ru'],
];
for (const [src, name] of sources)
  walk(src, name, (s, path) => {
    if (HK.test(s) && !HK_ALLOWED.test(path)) errors.push(`${path}: mentions Hong Kong outside the footer/legal pages — "${s}"`);
    if (/админк/i.test(s)) errors.push(`${path}: "админка" → "панель управления" / "панель администратора" — "${s}"`);
  });

for (const lang of ['en', 'ru'] as const)
  for (const page of [...PAGE_KEYS, '404'] as const) {
    const d = metaDesc(lang, page);
    if (!d) errors.push(`metaDesc.${lang}.${page}: empty`);
    if (d.length > META_DESC_MAX) errors.push(`metaDesc.${lang}.${page}: ${d.length} > ${META_DESC_MAX} chars`);
    if (HK.test(d)) errors.push(`metaDesc.${lang}.${page}: mentions Hong Kong`);
  }

if (errors.length) {
  console.error(`✖ ${errors.length} content problem(s):\n` + errors.map((e) => '  ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ content OK: ${strings} strings checked`);
