import { getDict } from '@/content';
import { resolveLang } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/patterns/PageHero';
import { DocBody } from '@/components/patterns/DocPage';

// noindex until legal review (Q8) — set in pageMetadata via NOINDEX_PAGES.
export async function generateMetadata({ params }: PageProps<'/[lang]/terms'>) {
  return pageMetadata(await resolveLang(params), 'terms');
}

export default async function TermsPage({ params }: PageProps<'/[lang]/terms'>) {
  const lang = await resolveLang(params);
  const P = getDict(lang).pages.terms;
  return (
    <main id="main" tabIndex={-1} data-page="terms">
      <PageHero eyebrow={P.eyebrow} h1={P.h1} />
      <DocBody draft={P.draft} updated={P.updated} sections={P.s} />
    </main>
  );
}
