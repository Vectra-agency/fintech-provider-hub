import { getDict } from '@/content';
import { resolveLang } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/patterns/PageHero';

export async function generateMetadata({ params }: PageProps<'/[lang]/payments'>) {
  return pageMetadata(await resolveLang(params), 'payments');
}

// TODO(M5/M6): sections per PRD §6.
export default async function PaymentsPage({ params }: PageProps<'/[lang]/payments'>) {
  const lang = await resolveLang(params);
  const P = getDict(lang).pages.payments;
  return (
    <main id="main" tabIndex={-1} data-page="payments">
      <PageHero eyebrow={P.eyebrow} h1={P.h1} sub={P.sub} cta={P.cta} />
    </main>
  );
}
