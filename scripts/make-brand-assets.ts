/**
 * Generates raster brand assets from our logo (prototype LOGO) — run when the logo or copy changes:
 *   public/logo-512.png (JSON-LD Organization.logo), public/apple-touch-icon.png,
 *   public/og/{en,ru}.png (1200×630, PRD §10 / Q5: one per language).
 * The OG image does not use the hero poster: that footage is still under Q9.
 *
 *   pnpm make:brand-assets
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { getDict } from '../src/content';
import { LANGS } from '../src/lib/i18n';

const PUB = join(process.cwd(), 'public');
const logo = readFileSync(join(PUB, 'favicon.svg'), 'utf8');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function main() {
  await sharp(Buffer.from(logo), { density: 1200 }).resize(512, 512).png().toFile(join(PUB, 'logo-512.png'));
  await sharp({ create: { width: 180, height: 180, channels: 4, background: '#000' } })
    .composite([{ input: await sharp(Buffer.from(logo), { density: 800 }).resize(140, 140).png().toBuffer(), top: 20, left: 20 }])
    .png()
    .toFile(join(PUB, 'apple-touch-icon.png'));

  for (const lang of LANGS) {
    const d = getDict(lang);
    const [l1, l2] = typeof d.home.h1 === 'string' ? [d.home.h1, ''] : d.home.h1;
    const font = "'Helvetica Neue', Helvetica, Arial, sans-serif";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="50%" cy="0%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".09"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="l2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#d4d4d8"/><stop offset="1" stop-color="#71717b"/></linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#000101"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g stroke="#fff" stroke-opacity=".15"><path d="M40 0v630M48 0v630M1152 0v630M1160 0v630"/></g>
  <g stroke="#fff" stroke-opacity=".1"><path d="M40 96h1120M40 534h1120"/></g>
  <text x="104" y="64" font-family="${font}" font-size="26" fill="#fff" letter-spacing="-.3">Fintech Provider Hub</text>
  <text x="600" y="282" text-anchor="middle" font-family="${font}" font-size="76" fill="#fff" letter-spacing="-2">${esc(l1)}</text>
  <text x="600" y="366" text-anchor="middle" font-family="${font}" font-size="76" fill="url(#l2)" letter-spacing="-2">${esc(l2)}</text>
  <text x="600" y="584" text-anchor="middle" font-family="${font}" font-size="22" fill="#fff" fill-opacity=".6">${esc(d.home.eyebrow)}</text>
</svg>`;
    const mark = await sharp(Buffer.from(logo), { density: 600 }).resize(40, 40).png().toBuffer();
    await sharp(Buffer.from(svg))
      .composite([{ input: mark, top: 30, left: 52 }])
      .png({ compressionLevel: 9 })
      .toFile(join(PUB, 'og', `${lang}.png`));
    console.log(`og/${lang}.png`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
