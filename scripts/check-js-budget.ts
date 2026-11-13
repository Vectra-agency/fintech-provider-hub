/**
 * PRD §12: ≤ 150 KB (gzip) of JS per page. Counts every <script src> in each exported HTML page,
 * except `noModule` polyfills (modern browsers never download them).
 *
 *   pnpm check:js-budget        (after `pnpm build`)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const OUT = join(process.cwd(), 'out');
const BUDGET_KB = 150;

function* htmlFiles(dir: string): Generator<string> {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) {
      if (n !== '_next') yield* htmlFiles(p);
    } else if (n.endsWith('.html')) yield p;
  }
}

const cache = new Map<string, number>();
const gz = (src: string) => {
  if (!cache.has(src)) cache.set(src, gzipSync(readFileSync(join(OUT, src.split('?')[0]!))).length);
  return cache.get(src)!;
};

let failed = false;
for (const file of htmlFiles(OUT)) {
  const html = readFileSync(file, 'utf8');
  const srcs = new Set<string>();
  for (const m of html.matchAll(/<script\b([^>]*)>/g)) {
    const attrs = m[1]!;
    const src = /\bsrc="([^"]+)"/.exec(attrs)?.[1];
    if (src && !/\bnoModule\b/i.test(attrs)) srcs.add(src);
  }
  const kb = [...srcs].reduce((s, src) => s + gz(src), 0) / 1024;
  const line = `${kb.toFixed(1).padStart(6)} KB  ${relative(OUT, file)}`;
  if (kb > BUDGET_KB) {
    failed = true;
    console.error(`✖ ${line}  (budget ${BUDGET_KB} KB)`);
  } else console.log(`✓ ${line}`);
}
process.exit(failed ? 1 : 0);
