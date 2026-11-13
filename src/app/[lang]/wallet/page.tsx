import { getDict } from '@/content';
import { resolveLang } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/patterns/PageHero';

export async function generateMetadata({ params }: PageProps<'/[lang]/wallet'>) {
  return pageMetadata(await resolveLang(params), 'wallet');
}

// TODO(M5/M6): sections per PRD §6.
export default async function WalletPage({ params }: PageProps<'/[lang]/wallet'>) {
  const lang = await resolveLang(params);
  const P = getDict(lang).pages.wallet;
  return (
    <main id="main" tabIndex={-1} data-page="wallet">
      <PageHero eyebrow={P.eyebrow} h1={P.h1} sub={P.sub} cta={P.cta} />
    </main>
  );
}
