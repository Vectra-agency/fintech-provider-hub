import { resolveLang } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';
import { ADDED } from '@/content/added-strings';
import { HeroBackground } from '@/components/hero/HeroBackground';

export async function generateMetadata({ params }: PageProps<'/[lang]'>) {
  return pageMetadata(await resolveLang(params), 'home');
}

// TODO(M4): home page sections (PRD §6.1). Needs docs/prototype/index.html for content.
// For now: the P1 hero shell (background video + overlays) to check M1 media on preview.
export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const lang = await resolveLang(params);
  return (
    <main id="main" tabIndex={-1} data-page="home">
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
