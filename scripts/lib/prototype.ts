/**
 * Loads the content objects (T, SS, ADM) straight from the prototype — the content reference (PRD §0).
 * The dictionary blocks are self-contained object literals; only TG_HANDLE is referenced from outside.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';

export const PROTOTYPE_PATH = join(process.cwd(), 'docs/design-reference/prototype/index.html');

function block(src: string, name: string): string {
  const start = src.indexOf(`const ${name} = {`);
  if (start < 0) throw new Error(`prototype: const ${name} not found`);
  const end = src.indexOf('\n};', start);
  if (end < 0) throw new Error(`prototype: end of ${name} not found`);
  return src.slice(start + `const ${name} = `.length, end + 2);
}

export type Proto = { T: Record<'en' | 'ru', unknown>; SS: Record<'en' | 'ru', Record<string, string>>; ADM: Record<'en' | 'ru', unknown> };

export function loadPrototype(): Proto {
  const html = readFileSync(PROTOTYPE_PATH, 'utf8');
  const handle = /const TG_HANDLE = '([^']+)'/.exec(html)?.[1];
  if (!handle) throw new Error('prototype: TG_HANDLE not found');
  const ctx = { TG_HANDLE: handle };
  const ev = (name: string) => runInNewContext(`(${block(html, name)})`, ctx);
  return { T: ev('T'), SS: ev('SS'), ADM: ev('ADM') };
}
