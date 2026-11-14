import type { Lang } from '@/lib/i18n';
import { getDict } from '@/content';
import { PageHero } from '@/components/patterns/PageHero';
import { DocBody } from '@/components/patterns/DocPage';

export function TermsPage({ lang }: { lang: Lang }) {
  const P = getDict(lang).pages.terms;
  return (
    <main id="main" tabIndex={-1} data-page="terms">
      <PageHero eyebrow={P.eyebrow} h1={P.h1} />
      <DocBody draft={P.draft} updated={P.updated} sections={P.s} />
    </main>
  );
}
