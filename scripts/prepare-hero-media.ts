/**
 * PRD §7.1 — web variants of the hero loop + posters, from the masters made by extract-reference.ts.
 *
 *   pnpm prepare:hero [--posters-only]
 *
 * In:  docs/design-reference/media/hero-{desktop,mobile}-master.mp4
 * Out: public/media/hero/hero-{desktop,mobile}.{webm,mp4}, poster-{desktop,mobile}.{avif,webp}
 *
 * Two-pass ABR so file size is predictable against the budget; audio stripped; +faststart for MP4.
 * The poster is frame 0 of the loop, so the poster → video hand-off has no visual jump.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync, rmSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import sharp from 'sharp';

const SRC = join(process.cwd(), 'docs/design-reference/media');
const OUT = join(process.cwd(), 'public/media/hero');

type Variant = { name: 'desktop' | 'mobile'; width: number; budgetMB: number; posterKB: number };
const VARIANTS: Variant[] = [
  { name: 'desktop', width: 1920, budgetMB: 4, posterKB: 80 },
  { name: 'mobile', width: 720, budgetMB: 1.5, posterKB: 80 },
];

const ff = (args: string[]) => execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args], { stdio: 'inherit' });
const duration = (file: string) =>
  Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim());
const sizeKB = (f: string) => Math.round(statSync(f).size / 1024);

/**
 * Highest quality that fits the budget at full size; if even q=35 doesn't fit (WebP on this busy
 * frame), step the width down — WebP is only the fallback for browsers without AVIF.
 */
async function encodePoster(png: string, base: string, budgetKB: number) {
  const { width: full = 0 } = await sharp(png).metadata();
  const widths = [...new Set([full, 1600, 1440, 1280, 1024, Math.round(full * 0.85), Math.round(full * 0.75)])]
    .filter((w) => w <= full)
    .sort((a, b) => b - a);
  for (const fmt of ['avif', 'webp'] as const) {
    const file = `${base}.${fmt}`;
    let result = '';
    search: for (const w of widths) {
      for (let q = 80; q >= 35; q -= 5) {
        const img = sharp(png).resize({ width: w });
        await (fmt === 'avif' ? img.avif({ quality: q, effort: 9 }) : img.webp({ quality: q, effort: 6, smartSubsample: true })).toFile(file);
        if (sizeKB(file) <= budgetKB) {
          result = `${w}px q=${q}`;
          break search;
        }
      }
    }
    console.log(`  ${base.split('/').pop()}.${fmt}: ${result || 'OVER BUDGET'} ${sizeKB(file)} KB`);
    if (!result) process.exitCode = 1;
  }
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const tmp = mkdtempSync(join(tmpdir(), 'hero-'));
  const postersOnly = process.argv.includes('--posters-only');
  try {
    for (const v of VARIANTS) {
      const master = join(SRC, `hero-${v.name}-master.mp4`);
      if (postersOnly) {
        const png = join(tmp, `${v.name}-poster.png`);
        ff(['-i', master, '-vf', `scale='min(${v.width},iw)':-2:flags=lanczos`, '-frames:v', '1', png]);
        await encodePoster(png, join(OUT, `poster-${v.name}`), v.posterKB);
        continue;
      }
      const dur = duration(master);
      // 92% of budget, rest is container overhead / safety
      const kbps = Math.floor(((v.budgetMB * 1024 * 1024 * 8) / dur / 1000) * 0.92);
      const scale = `scale='min(${v.width},iw)':-2:flags=lanczos`;
      const passlog = join(tmp, `${v.name}-pass`);
      console.log(`${v.name}: ${dur.toFixed(2)} s → ${kbps} kbps`);

      const mp4 = join(OUT, `hero-${v.name}.mp4`);
      const x264 = ['-c:v', 'libx264', '-preset', 'veryslow', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-b:v', `${kbps}k`, '-maxrate', `${Math.round(kbps * 1.5)}k`, '-bufsize', `${kbps * 2}k`, '-g', '60', '-an'];
      ff(['-i', master, '-vf', scale, ...x264, '-pass', '1', '-passlogfile', passlog, '-f', 'null', '/dev/null']);
      ff(['-i', master, '-vf', scale, ...x264, '-pass', '2', '-passlogfile', passlog, '-movflags', '+faststart', mp4]);
      console.log(`  hero-${v.name}.mp4: ${sizeKB(mp4)} KB`);

      const webm = join(OUT, `hero-${v.name}.webm`);
      const vp9 = ['-c:v', 'libvpx-vp9', '-b:v', `${Math.round(kbps * 0.8)}k`, '-row-mt', '1', '-tile-columns', '2', '-deadline', 'good', '-g', '60', '-pix_fmt', 'yuv420p', '-an'];
      ff(['-i', master, '-vf', scale, ...vp9, '-cpu-used', '4', '-pass', '1', '-passlogfile', `${passlog}-vp9`, '-f', 'null', '/dev/null']);
      ff(['-i', master, '-vf', scale, ...vp9, '-cpu-used', '1', '-pass', '2', '-passlogfile', `${passlog}-vp9`, webm]);
      console.log(`  hero-${v.name}.webm: ${sizeKB(webm)} KB`);

      const png = join(tmp, `${v.name}-poster.png`);
      ff(['-i', master, '-vf', scale, '-frames:v', '1', png]);
      await encodePoster(png, join(OUT, `poster-${v.name}`), v.posterKB);
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
