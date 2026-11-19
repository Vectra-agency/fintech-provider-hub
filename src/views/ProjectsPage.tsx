import type { Lang } from '@/lib/i18n';
import { getDict } from '@/content';
import { PageHero } from '@/components/patterns/PageHero';
import { Frame } from '@/components/ui/Frame';
import { Phone } from '@/components/mockups/Phone';
import { Section } from '@/components/sections/blocks';
import { LeadSection } from '@/components/sections/LeadSection';

/** PRD §6.6 — Projects: P4 gallery 01 Wallet / 02 Cards / 03 Payouts, fixed palette, captions per screen. */
export function ProjectsPage({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  const P = d.pages.projects;
  return (
    <main id="main" tabIndex={-1} data-page="projects">
      <PageHero eyebrow={P.eyebrow} h1={P.h1} sub={P.sub} />

      <Section>
        <ol className="flex flex-col gap-6">
          {P.groups.map(([name, desc, screens], i) => (
            <li key={name}>
              <Frame>
                <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12">
                  <div className="flex flex-col gap-3" data-reveal>
                    <span className="showcase-num">{String(i + 1).padStart(2, '0')}</span>
                    <h2 className="font-display text-3xl tracking-tight text-foreground lg:text-4xl">{name}</h2>
                    <p className="leading-relaxed text-muted-foreground">{desc}</p>
                  </div>
                  <div className="gallery-phones br-ember">
                    {screens.map((n) => (
                      <figure key={n} className="flex flex-col items-center gap-3">
                        <Phone name={n} lang={lang} s={0.46} fixed label={d.screens[n]} />
                        <figcaption className="text-sm text-white/70">{d.screens[n]}</figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              </Frame>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-white/55">{P.note}</p>
      </Section>

      <LeadSection lang={lang} topic={0} />
    </main>
  );
}
