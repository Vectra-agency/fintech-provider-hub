import { getDict } from '@/content';
import { resolveLang } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/patterns/PageHero';
import { DocBody } from '@/components/patterns/DocPage';

// noindex until legal review (Q8) — set in pageMetadata via NOINDEX_PAGES.
export async function generateMetadata({ params }: PageProps<'/[lang]/privacy'>) {
  return pageMetadata(await resolveLang(params), 'privacy');
}

export default async function PrivacyPage({ params }: PageProps<'/[lang]/privacy'>) {
  const lang = await resolveLang(params);
  const P = getDict(lang).pages.privacy;
  return (
    <main id="main" tabIndex={-1} data-page="privacy">
      <PageHero eyebrow={P.eyebrow} h1={P.h1} />
      <DocBody draft={P.draft} updated={P.updated} sections={P.s} />
    </main>
  );
}
