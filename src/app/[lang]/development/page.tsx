import { getDict } from '@/content';
import { resolveLang } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/patterns/PageHero';
import { SectionHead, Steps } from '@/components/ui/Bits';
import { FeatureCard, Section } from '@/components/sections/blocks';
import { StackPipeline } from '@/components/sections/StackPipeline';
import { LeadSection } from '@/components/sections/LeadSection';

export async function generateMetadata({ params }: PageProps<'/[lang]/development'>) {
  return pageMetadata(await resolveLang(params), 'development');
}

/** PRD §6.5 — Custom Fintech Development. */
export default async function DevelopmentPage({ params }: PageProps<'/[lang]/development'>) {
  const lang = await resolveLang(params);
  const P = getDict(lang).pages.development;
  return (
    <main id="main" tabIndex={-1} data-page="development">
      {/* 1. P1b; visual: "Where we fit" as a pipeline of five layers */}
      <PageHero eyebrow={P.eyebrow} h1={P.h1} sub={P.sub} cta={P.cta} visual={<StackPipeline title={P.stackH} layers={P.stack} />} />

      {/* 2. P5 What we build */}
      <Section labelledBy="cap-h">
        <SectionHead heading={P.capH} id="cap-h" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {P.caps.map(([t, x]) => (
            <FeatureCard key={t} title={t} text={x} />
          ))}
        </div>
      </Section>

      {/* 3. P3 Process */}
      <Section labelledBy="proc-h">
        <SectionHead heading={P.procH} id="proc-h" />
        <Steps steps={P.proc} />
      </Section>

      {/* 4. P8 Lead (topic 3) */}
      <LeadSection lang={lang} topic={3} />
    </main>
  );
}
