/**
 * Release gate (PRD §9.6): fails if any content placeholder is left.
 * Scans content dictionaries and, when present, the built HTML in out/.
 *
 *   pnpm check:placeholders
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const TARGETS = ['src/content', 'out'];
const EXT = /\.(ts|tsx|html|json|txt|xml)$/;

const PATTERNS: { name: string; re: RegExp }[] = [
  // [Company legal name], [date], [email], [Registration number] …
  { name: 'bracket placeholder', re: /\[(?:[A-Z][A-Za-z ]{1,40}|date|email|address|phone)\]/g },
  { name: 'RU bracket placeholder', re: /\[(?:[А-ЯЁ][А-Яа-яЁё ]{1,40}|дата|email|адрес|телефон)\]/g },
  { name: 'pending publication', re: /To be published after confirmation/gi },
  { name: 'pending publication (ru)', re: /Будет опубликовано после подтверждения/gi },
];

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (EXT.test(name)) yield p;
  }
}

const hits: string[] = [];
for (const t of TARGETS) {
  const dir = join(ROOT, t);
  if (!existsSync(dir)) continue;
  for (const file of walk(dir)) {
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      for (const { name, re } of PATTERNS) {
        for (const m of line.matchAll(re)) hits.push(`${relative(ROOT, file)}:${i + 1}  ${name}: ${m[0]}`);
      }
    });
  }
}

if (hits.length) {
  console.error(`✖ ${hits.length} placeholder(s) must be resolved before release (PRD §9.6):\n` + hits.map((h) => '  ' + h).join('\n'));
  process.exit(1);
}
console.log('✓ no placeholders');
