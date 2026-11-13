import { getDict } from '@/content';
import { resolveLang } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/patterns/PageHero';
import { SectionHead } from '@/components/ui/Bits';
import { TwoPartHeading } from '@/components/ui/TwoPartHeading';
import { PlanCard, Section, Tags } from '@/components/sections/blocks';
import { LeadSection } from '@/components/sections/LeadSection';

export async function generateMetadata({ params }: PageProps<'/[lang]/about'>) {
  return pageMetadata(await resolveLang(params), 'about');
}

/** PRD §6.7 — About Us. "What we are not" is mandatory (PRD §9.3). */
export default async function AboutPage({ params }: PageProps<'/[lang]/about'>) {
  const lang = await resolveLang(params);
  const P = getDict(lang).pages.about;
  return (
    <main id="main" tabIndex={-1} data-page="about">
      <PageHero eyebrow={P.eyebrow} h1={P.h1} sub={P.sub} />

      {/* 2. P7 What we do */}
      <Section labelledBy="do-h">
        <SectionHead heading={P.doH} id="do-h" />
        <div className="grid gap-4 md:grid-cols-3">
          {P.dos.map(([t, x], i) => (
            <PlanCard key={t} featured={i === 0} title={t}>
              <p className="plan-desc text-base">{x}</p>
            </PlanCard>
          ))}
        </div>
      </Section>

      {/* 3. What we are not | Who we work with */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6" data-reveal>
            <TwoPartHeading text={P.notH} />
            <p className="section-lead text-foreground/80">{P.notP}</p>
          </div>
          <div className="flex flex-col gap-6" data-reveal>
            <TwoPartHeading text={P.forH} />
            <Tags items={P.fors} />
          </div>
        </div>
      </Section>

      {/* 4. Company details — TODO(Q1): legal name, registration number, address, email are placeholders */}
      <Section labelledBy="co-h">
        <h2 id="co-h" className="font-display text-3xl tracking-tight text-foreground">
          {P.coH}
        </h2>
        <dl className="company-details mt-8">
          {P.co.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <LeadSection lang={lang} topic={0} />
    </main>
  );
}
