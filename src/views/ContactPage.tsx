import type { Lang } from '@/lib/i18n';
import { getDict } from '@/content';
import { PageHero } from '@/components/patterns/PageHero';
import { LeadSection } from '@/components/sections/LeadSection';

/** PRD §6.8 — Contact: P1b + the enlarged P8 Lead. */
export function ContactPage({ lang }: { lang: Lang }) {
  const P = getDict(lang).pages.contact;
  return (
    <main id="main" tabIndex={-1} data-page="contact">
      <PageHero eyebrow={P.eyebrow} h1={P.h1} sub={P.sub} />
      <LeadSection lang={lang} topic={0} big />
    </main>
  );
}
