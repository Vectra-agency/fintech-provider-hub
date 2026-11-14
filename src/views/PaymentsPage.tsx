import type { Lang } from '@/lib/i18n';
import { getDict } from '@/content';
import { PageHero } from '@/components/patterns/PageHero';
import { DemoNote, Note, SectionHead, Steps } from '@/components/ui/Bits';
import { MiniWidget } from '@/components/mockups/MiniWidget';
import { FeatureCard, PhoneStage, Section } from '@/components/sections/blocks';
import { LeadSection } from '@/components/sections/LeadSection';

/** PRD §6.4 — Global Payment Solutions. The availability note is mandatory (PRD §9.3). RU has the RUB/SBP direction. */
export function PaymentsPage({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  const P = d.pages.payments;
  return (
    <main id="main" tabIndex={-1} data-page="payments">
      {/* 1. P1b with two phones */}
      <PageHero eyebrow={P.eyebrow} h1={P.h1} sub={P.sub} cta={P.cta} visual={<PhoneStage lang={lang} names={P.phones} s={0.5} />} />

      {/* 2. P5 Payment directions + availability note */}
      <Section labelledBy="dir-h">
        <SectionHead heading={P.dirH} id="dir-h" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {P.dirs.map(([t, x, st]) => (
            <FeatureCard key={t} status={st} statusLabel={d.status[st]} title={t} text={x} />
          ))}
        </div>
        <Note className="mt-6">{P.note}</Note>
      </Section>

      {/* 3. P3 How a payout works + the 30-second quote widget */}
      <Section labelledBy="flow-h">
        <SectionHead heading={P.flowH} id="flow-h">
          <div className="bento-visual brandable !m-0 max-w-[24rem]">
            <MiniWidget kind="quote" lang={lang} />
            <DemoNote className="bento-note">{d.demoNote}</DemoNote>
          </div>
        </SectionHead>
        <Steps steps={P.flow} />
      </Section>

      {/* 4. P8 Lead (topic 2) */}
      <LeadSection lang={lang} topic={2} />
    </main>
  );
}
