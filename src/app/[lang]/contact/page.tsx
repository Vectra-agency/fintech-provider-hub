import { getDict } from '@/content';
import { resolveLang } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/patterns/PageHero';
import { LeadSection } from '@/components/sections/LeadSection';

export async function generateMetadata({ params }: PageProps<'/[lang]/contact'>) {
  return pageMetadata(await resolveLang(params), 'contact');
}

/** PRD §6.8 — Contact: P1b + the enlarged P8 Lead. */
export default async function ContactPage({ params }: PageProps<'/[lang]/contact'>) {
  const lang = await resolveLang(params);
  const P = getDict(lang).pages.contact;
  return (
    <main id="main" tabIndex={-1} data-page="contact">
      <PageHero eyebrow={P.eyebrow} h1={P.h1} sub={P.sub} />
      <LeadSection lang={lang} topic={0} big />
    </main>
  );
}
