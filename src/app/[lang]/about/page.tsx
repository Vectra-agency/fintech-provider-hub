import { getDict } from '@/content';
import { resolveLang } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/patterns/PageHero';

export async function generateMetadata({ params }: PageProps<'/[lang]/about'>) {
  return pageMetadata(await resolveLang(params), 'about');
}

// TODO(M5/M6): sections per PRD §6.
export default async function AboutPage({ params }: PageProps<'/[lang]/about'>) {
  const lang = await resolveLang(params);
  const P = getDict(lang).pages.about;
  return (
    <main id="main" tabIndex={-1} data-page="about">
      <PageHero eyebrow={P.eyebrow} h1={P.h1} sub={P.sub} />
    </main>
  );
}
