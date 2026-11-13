import { getDict } from '@/content';
import { resolveLang } from '@/lib/page';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/patterns/PageHero';
import { Checks, Note, SectionHead } from '@/components/ui/Bits';
import { Pill } from '@/components/ui/Pill';
import { Frame } from '@/components/ui/Frame';
import { TwoPartHeading } from '@/components/ui/TwoPartHeading';
import { PhoneStage, PlanCard, Section, Tags } from '@/components/sections/blocks';
import { LeadSection } from '@/components/sections/LeadSection';

export async function generateMetadata({ params }: PageProps<'/[lang]/cards'>) {
  return pageMetadata(await resolveLang(params), 'cards');
}

/** PRD §6.3 — Crypto Card Programs. The "we don't issue cards" disclaimer is mandatory (PRD §9.3). */
export default async function CardsPage({ params }: PageProps<'/[lang]/cards'>) {
  const lang = await resolveLang(params);
  const d = getDict(lang);
  const P = d.pages.cards;
  return (
    <main id="main" tabIndex={-1} data-page="cards">
      {/* 1. P1b with two phones */}
      <PageHero eyebrow={P.eyebrow} h1={P.h1} sub={P.sub} cta={P.cta} visual={<PhoneStage lang={lang} names={P.phones} s={0.5} />} />

      {/* 2. P7 Program types + disclaimer */}
      <Section labelledBy="types-h">
        <SectionHead heading={P.typesH} id="types-h" />
        <div className="grid gap-4 md:grid-cols-2">
          {P.types.map(([title, text, st], i) => (
            <PlanCard key={title} featured={i === 0} title={title} top={<Pill status={st} label={d.status[st]} />}>
              <p className="plan-desc text-base">{text}</p>
            </PlanCard>
          ))}
        </div>
        <Note className="mt-6">{P.disc}</Note>
      </Section>

      {/* 3. BIN geography | Issue and top up by API */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6" data-reveal>
            <TwoPartHeading text={P.binH} />
            <p className="section-lead">{P.binP}</p>
            <ul className="flex flex-wrap gap-3">
              {P.bins.map((b) => (
                <li key={b} className="bin">
                  <span>BIN</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6" data-reveal>
            <TwoPartHeading text={P.apiH} />
            <Checks items={P.api} />
          </div>
        </div>
      </Section>

      {/* 4. P4 Card management: what users pay for, requirements, two phones */}
      <Section labelledBy="mgmt-h">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="flex flex-col gap-8" data-reveal>
            <TwoPartHeading text={P.mgmtH} id="mgmt-h" />
            <div className="flex flex-col gap-4">
              <h3 className="font-medium text-foreground">{P.useH}</h3>
              <Tags items={P.uses} />
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-medium text-foreground">{P.reqH}</h3>
              <Checks items={P.req} />
            </div>
          </div>
          <Frame>
            <div className="px-2 py-10 sm:px-6">
              <PhoneStage lang={lang} names={P.mgmtPhones} s={0.55} />
            </div>
          </Frame>
        </div>
      </Section>

      {/* 5. P8 Lead (topic 1) */}
      <LeadSection lang={lang} topic={1} />
    </main>
  );
}
