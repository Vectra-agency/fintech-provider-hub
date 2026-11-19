import type { Lang } from '@/lib/i18n';
import { getDict } from '@/content';
import { PageHero } from '@/components/patterns/PageHero';
import { Checks, Note, SectionHead, Steps } from '@/components/ui/Bits';
import { Frame } from '@/components/ui/Frame';
import { TwoPartHeading } from '@/components/ui/TwoPartHeading';
import { BrandSwitcher } from '@/components/mockups/BrandSwitcher';
import { AdminBlock } from '@/components/sections/home';
import { FeatureCard, PhoneStage, PlanCard, Section } from '@/components/sections/blocks';
import { LeadSection } from '@/components/sections/LeadSection';

/** PRD §6.2 — White Label Crypto Wallet. */
export function WalletPage({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  const P = d.pages.wallet;
  return (
    <main id="main" tabIndex={-1} data-page="wallet">
      {/* 1. P1b with two phones */}
      <PageHero eyebrow={P.eyebrow} h1={P.h1} sub={P.sub} cta={P.cta} visual={<PhoneStage lang={lang} names={P.phones} s={0.5} />} />

      {/* 2. P7 What's included: Core set (highlighted) + Optional modules */}
      <Section labelledBy="inc-h">
        <SectionHead heading={P.incH} id="inc-h" />
        <div className="grid gap-4 md:grid-cols-2">
          <PlanCard featured title={P.coreT}>
            <Checks items={P.core} />
          </PlanCard>
          <PlanCard title={P.optT}>
            <Checks items={P.opt} />
          </PlanCard>
        </div>
      </Section>

      {/* 3. P3 Your name, your colors, your bot — phone + brand switcher */}
      <Section labelledBy="brand-h">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start gap-6" data-reveal>
            <TwoPartHeading text={P.brandH} id="brand-h" />
            <p className="section-lead">{P.brandP}</p>
            <Checks items={P.brandPts} />
            <BrandSwitcher label={d.home.tryBrand} names={d.home.brands} align="start" />
          </div>
          <Frame>
            <div className="px-4 py-10">
              <PhoneStage lang={lang} names={['cards']} s={0.6} />
            </div>
          </Frame>
        </div>
      </Section>

      {/* 4. P6 Admin panel included */}
      <Section labelledBy="adm-h">
        <SectionHead heading={P.adminH} sub={P.adminP} id="adm-h" />
        <AdminBlock lang={lang} className="" />
      </Section>

      {/* 5. P5 Integrations (all through partners) */}
      <Section labelledBy="int-h">
        <SectionHead heading={P.intH} id="int-h" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {P.ints.map(([t, x]) => (
            <FeatureCard key={t} title={t} text={x} />
          ))}
        </div>
      </Section>

      {/* 6. Managed SaaS model + platforms roadmap */}
      <Section>
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="card gap-5" data-reveal="sm">
            <h2 className="font-display text-3xl tracking-tight text-foreground">{P.modelH}</h2>
            <p className="card-text">{P.modelP}</p>
            <Note>{P.modelKeep}</Note>
          </article>
          <article className="card gap-5" data-reveal="sm">
            <h2 className="font-display text-3xl tracking-tight text-foreground">{P.roadH}</h2>
            <ul className="flex flex-col">
              {P.road.map(([name, state], i) => (
                <li key={name} className="flex items-center justify-between gap-4 border-b border-white/[0.09] py-4 first:border-t">
                  <span className="text-foreground">{name}</span>
                  <span className={i === 0 ? 'text-sm text-live' : 'text-sm text-muted-foreground'}>{state}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Section>

      {/* 7. P3 Launch in 4 stages */}
      <Section labelledBy="steps-h">
        <SectionHead heading={P.stepsH} id="steps-h" />
        <Steps steps={d.home.how.steps} />
      </Section>

      {/* 8. P8 Lead (topic 0) */}
      <LeadSection lang={lang} topic={0} />
    </main>
  );
}
