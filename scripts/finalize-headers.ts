/**
 * Post-build: adds the analytics origin to CSP connect-src in out/_headers (PRD §12: connect-src —
 * only the analytics domain). No-op when no provider is configured.
 *
 *   pnpm build && pnpm finalize:headers
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const file = join(process.cwd(), 'out/_headers');
const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
if (!endpoint) {
  console.log('finalize-headers: no analytics endpoint, CSP connect-src stays \'self\'');
  process.exit(0);
}
const origin = new URL(endpoint).origin;
const src = readFileSync(file, 'utf8');
if (!src.includes("connect-src 'self';")) throw new Error("finalize-headers: CSP connect-src 'self' not found in out/_headers");
writeFileSync(file, src.replace("connect-src 'self';", `connect-src 'self' ${origin};`));
console.log(`finalize-headers: connect-src += ${origin}`);
