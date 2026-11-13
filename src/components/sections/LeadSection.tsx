import type { Lang } from '@/lib/i18n';
import { getDict } from '@/content';
import { TwoPartHeading } from '@/components/ui/TwoPartHeading';
import { Frame } from '@/components/ui/Frame';
import { LeadBlock } from '@/components/patterns/LeadBlock';

/**
 * P8 — final CTA band with the lead block (PRD §7.6). Topic is preselected per page:
 * wallet 0, cards 1, payments 2, development 3, others 0. `big` = the Contact page variant.
 */
export function LeadSection({ lang, topic = 0, big = false }: { lang: Lang; topic?: number; big?: boolean }) {
  const ld = getDict(lang).lead;
  const labels = {
    topicL: ld.topicL,
    topics: ld.topics,
    messages: ld.topics.map((t) => ld.tpl(t)),
    msgL: ld.msgL,
    copy: ld.copy,
    copied: ld.copied,
    copyFail: ld.copyFail,
    open: ld.open,
    direct: ld.direct,
  };
  return (
    <section id="lead" aria-labelledby="lead-h" className={`section lead-section${big ? ' is-big' : ''}`}>
      <div className="lead-glow" aria-hidden="true" />
      <div className="section-inner relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center" data-reveal>
          <TwoPartHeading text={ld.h2} id="lead-h" className="heading-cta" second="gradient" />
          <p className="section-lead max-w-xl">{ld.sub}</p>
        </div>
        <Frame className={`mx-auto mt-12 ${big ? 'max-w-4xl' : 'max-w-3xl'}`}>
          <div className="p-5 sm:p-8">
            <LeadBlock labels={labels} initialTopic={topic} />
          </div>
        </Frame>
      </div>
    </section>
  );
}
