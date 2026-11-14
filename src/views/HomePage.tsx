import type { Lang } from '@/lib/i18n';
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

/** PRD §6.1 — home page, sections in the PRD order. */
export function HomePage({ lang }: { lang: Lang }) {
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
