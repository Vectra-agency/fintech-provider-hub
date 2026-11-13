import { getDict } from '@/content';
import { resolveLang } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/patterns/PageHero';

export async function generateMetadata({ params }: PageProps<'/[lang]/contact'>) {
  return pageMetadata(await resolveLang(params), 'contact');
}

// TODO(M5/M6): sections per PRD §6.
export default async function ContactPage({ params }: PageProps<'/[lang]/contact'>) {
  const lang = await resolveLang(params);
  const P = getDict(lang).pages.contact;
  return (
    <main id="main" tabIndex={-1} data-page="contact">
      <PageHero eyebrow={P.eyebrow} h1={P.h1} sub={P.sub} />
    </main>
  );
}
