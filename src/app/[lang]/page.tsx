import { notFound } from 'next/navigation';
import { isLang } from '@/lib/i18n';
import { ADDED } from '@/content/added-strings';
import { HeroBackground } from '@/components/hero/HeroBackground';

// TODO(M4): home page sections (PRD §6.1). Needs docs/prototype/index.html for content.
// For now: the P1 hero shell (background video + overlays) to check M1 media on preview.
export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <main id="main">
      <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-black">
        <HeroBackground labels={ADDED[lang].heroVideo} />
        <div className="relative z-10 px-4 text-center">
          <h1 className="font-display text-[clamp(2rem,4.6vw,4.5rem)] leading-[0.92] tracking-tight text-white">
            Fintech Provider Hub
          </h1>
        </div>
      </section>
    </main>
  );
}
