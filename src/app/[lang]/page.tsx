import { resolveLang } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';
import { SectionDivider } from '@/components/layout/FrameLines';
import {
  HomeAbout,
  HomeFeatures,
  HomeHero,
  HomeHow,
  HomeManaged,
  HomeMarquee,
  HomeProjects,
  HomeShowcase,
  HomeSolutions,
} from '@/components/sections/home';
import { LeadSection } from '@/components/sections/LeadSection';

export async function generateMetadata({ params }: PageProps<'/[lang]'>) {
  return pageMetadata(await resolveLang(params), 'home');
}

/** PRD §6.1 — home page, sections in the PRD order. */
export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const lang = await resolveLang(params);
  return (
    <main id="main" tabIndex={-1} data-page="home">
      <HomeHero lang={lang} />
      <HomeMarquee lang={lang} />
      <HomeShowcase lang={lang} />
      <SectionDivider />
      <HomeSolutions lang={lang} />
      <SectionDivider />
      <HomeFeatures lang={lang} />
      <SectionDivider />
      <HomeHow lang={lang} />
      <SectionDivider />
      <HomeManaged lang={lang} />
      <SectionDivider />
      <HomeProjects lang={lang} />
      <SectionDivider />
      <HomeAbout lang={lang} />
      <SectionDivider />
      <LeadSection lang={lang} />
    </main>
  );
}
