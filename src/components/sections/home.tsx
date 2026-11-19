import Link from 'next/link';
import type { Lang } from '@/lib/i18n';
import { tgUrl } from '@/lib/i18n';
import { pagePath } from '@/lib/routes';
import { getDict } from '@/content';
import { HeroProduct } from '@/components/hero/HeroProduct';
import { Button } from '@/components/ui/Button';
import { TwoPartHeading } from '@/components/ui/TwoPartHeading';
import { Checks, Kicker, SectionHead, Steps } from '@/components/ui/Bits';
import { Frame } from '@/components/ui/Frame';
import { ArrowIcon, SolutionIcon } from '@/components/ui/icons';
import { Marquee } from '@/components/patterns/Marquee';
import { ShowcaseTabs } from '@/components/patterns/ShowcaseTabs';
import { Phones } from '@/components/mockups/Phone';
import { BrandSwitcher } from '@/components/mockups/BrandSwitcher';
import { AdminShell } from '@/components/mockups/AdminShell';
import { MiniWidget } from '@/components/mockups/MiniWidget';
import type { WidgetKind } from '@/components/mockups/widgets';

const text = (h: string | readonly [string, string]) => (typeof h === 'string' ? h : h.join(' '));

/** 1. P1 — hero: copy + CTAs on the left, the product (Parus phone over its admin panel) on the right; specs below. */
export function HomeHero({ lang }: { lang: Lang }) {
  const H = getDict(lang).home;
  return (
    <section className="home-hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="section-inner relative z-10 pt-28 pb-10 sm:pt-32 lg:pt-36">
        <div className="hero-grid">
          <div className="flex flex-col items-start">
            <p className="eyebrow hero-in">{H.eyebrow}</p>
            <TwoPartHeading as="h1" text={H.h1} className="heading-1 hero-in mt-6 [--hero-in-delay:60ms]" second="gradient" />
            <p className="hero-sub hero-in [--hero-in-delay:150ms]">{H.sub}</p>
            <div className="hero-in mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row [--hero-in-delay:200ms]">
              <Button href={tgUrl()} variant="solid" data-ev="request_demo" data-placement="hero">
                {H.cta2}
              </Button>
              <Button href={pagePath(lang, 'home', 'solutions')} variant="outline" data-ev="explore_solutions">
                {H.cta1}
              </Button>
            </div>
          </div>
          <div className="hero-in [--hero-in-delay:250ms]">
            <HeroProduct lang={lang} />
          </div>
        </div>
        <dl className="hero-specs hero-in [--hero-in-delay:500ms]">
          {H.specs.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** 2. P2 — text-only strip: USDT networks + feature names (no logos, PRD §6.1). */
export function HomeMarquee({ lang }: { lang: Lang }) {
  const H = getDict(lang).home;
  const items = ['TRC-20', 'TON', 'ERC-20', 'BEP-20', 'Solana', ...H.features.items.map(([name]) => name)];
  return (
    <div className="border-y border-white/[0.09] bg-black py-6">
      <Marquee items={items} />
    </div>
  );
}

/** 3. P4 — showcase: numbered tabs 01–04, phones in a frame, brand switcher. */
export function HomeShowcase({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  const S = d.home.show;
  return (
    <section className="section" aria-labelledby="show-h">
      <div className="section-inner">
        <SectionHead heading={S.h2} sub={S.sub} id="show-h" />
        <ShowcaseTabs
          label={text(S.h2)}
          tabs={S.tabs.map(({ id, label }) => ({ id, label }))}
          panels={S.tabs.map((t) => (
            <div key={t.id} className="flex flex-col gap-6">
              <h3 className="font-display text-3xl tracking-tight text-foreground lg:text-4xl">{t.title}</h3>
              <Checks items={t.pts} />
            </div>
          ))}
          visuals={S.tabs.map((t) => (
            <Frame key={t.id}>
              <div className="phone-stage brandable px-2 py-10 sm:px-6">
                <Phones names={t.phones} lang={lang} s={0.58} />
              </div>
            </Frame>
          ))}
          aside={
            <div className="mt-6 flex flex-col items-center">
              <BrandSwitcher label={d.home.tryBrand} names={d.home.brands} />
            </div>
          }
        />
      </div>
    </section>
  );
}

/** 4. P7 — solution columns; Wallet (Core product) is the highlighted column. */
export function HomeSolutions({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  const S = d.home.solutions;
  return (
    <section id="solutions" className="section" aria-labelledby="solutions-h">
      <div className="section-inner">
        <SectionHead heading={S.h2} sub={S.sub} id="solutions-h" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {d.sol.map((s, i) => {
            const featured = s.id === 'wallet';
            return (
              <article key={s.id} className={`plan${featured ? ' is-featured' : ''}`} data-reveal="sm" style={{ ['--reveal-delay' as string]: `${i * 80}ms` }}>
                <div className="plan-top">
                  <SolutionIcon id={s.id} size={22} className={featured ? 'text-white/80' : 'text-white/50'} />
                  <h3 className="plan-name">{s.name}</h3>
                  <p className="plan-desc">{s.short}</p>
                  <Button href={pagePath(lang, s.id)} variant={featured ? 'outline' : 'ghost'} icon="arrow" className="mt-auto w-full normal-case">
                    {S.more}
                    {/* descriptive link text for AT/SEO without changing the visible copy */}
                    <span className="sr-only">: {s.name}</span>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const WIDGET_FOR: Partial<Record<number, WidgetKind>> = { 0: 'networks', 1: 'freeze', 4: 'quote', 5: 'username' };

/** 5. P5 — bento of the 8 features; 4 large cards carry mini-widgets. */
export function HomeFeatures({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  const F = d.home.features;
  return (
    <section id="features" className="section" aria-labelledby="features-h">
      <div className="section-inner">
        <SectionHead heading={F.h2} sub={F.sub} id="features-h" />
        <div className="bento">
          {F.items.map(([name, desc], i) => {
            const widget = WIDGET_FOR[i];
            return (
              <article key={name} className={`card bento-card${widget ? ' is-large' : ''}`} data-reveal="sm">
                {widget && (
                  <div className="bento-visual brandable">
                    <MiniWidget kind={widget} lang={lang} />
                  </div>
                )}
                <h3 className="card-title">{name}</h3>
                <p className="card-text">{desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** 6. P3 — How it works: heading and a row of 4 numbered steps (no frame: no content for it). */
export function HomeHow({ lang }: { lang: Lang }) {
  const H = getDict(lang).home.how;
  return (
    <section className="section" aria-labelledby="how-h">
      <div className="section-inner">
        <SectionHead heading={H.h2} id="how-h" />
        <Steps steps={H.steps} />
      </div>
    </section>
  );
}

/** 7. P6 — managed model: three flow columns (source-code item highlighted) + admin app shell. */
export function HomeManaged({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  const M = d.home.managed;
  return (
    <section className="section" aria-labelledby="managed-h">
      <div className="section-inner">
        <SectionHead heading={M.h2} sub={M.sub} id="managed-h" />
        <div className="flow">
          {M.cols.map(([title, items], i) => (
            <div key={title} className="contents">
              {i > 0 && (
                <div className="flow-arrow" aria-hidden="true">
                  <ArrowIcon size={18} />
                </div>
              )}
              <div className={`flow-col${i === 1 ? ' is-mid' : ''}`} data-reveal="sm">
                <h3>{title}</h3>
                <ul>
                  {items.map((x, j) => (
                    <li key={x} className={i === 0 && j === 3 ? 'is-keep' : undefined}>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <AdminBlock lang={lang} title={M.adminT} desc={M.adminD} />
      </div>
    </section>
  );
}

export function AdminBlock({ lang, title, desc, className = 'mt-16' }: { lang: Lang; title?: string; desc?: string; className?: string }) {
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {(title || desc) && (
        <div className="flex max-w-2xl flex-col gap-2">
          {title && <h3 className="font-display text-2xl tracking-tight text-foreground">{title}</h3>}
          {desc && <p className="leading-relaxed text-muted-foreground">{desc}</p>}
        </div>
      )}
      <div className="admin-fade">
        <AdminShell lang={lang} />
      </div>
    </div>
  );
}

/** 8. P3 — selected project teaser with fixed-palette phones. */
export function HomeProjects({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  const P = d.home.projects;
  return (
    <section className="section" aria-labelledby="projects-h">
      <div className="section-inner">
        <SectionHead heading={P.h2} id="projects-h" />
        <Frame>
          <div className="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:p-12">
            <div className="flex flex-col items-start gap-5">
              <Kicker>{P.kicker}</Kicker>
              <h3 className="font-display text-3xl leading-tight tracking-tight text-foreground lg:text-4xl">{P.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{P.desc}</p>
              <div className="flex flex-wrap gap-2">
                {P.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-sm text-white/55">{P.note}</p>
              <Link href={pagePath(lang, 'projects')} className="arrow-link mt-2">
                {P.cta}
                <ArrowIcon />
              </Link>
            </div>
            <div className="phone-stage br-ember py-4">
              <Phones names={['cards', 'wallet']} lang={lang} s={0.5} fixed />
            </div>
          </div>
        </Frame>
      </div>
    </section>
  );
}

/** 9. About teaser: heading, paragraph, facts, link. */
export function HomeAbout({ lang }: { lang: Lang }) {
  const A = getDict(lang).home.about;
  return (
    <section className="section" aria-labelledby="about-h">
      <div className="section-inner grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div className="flex flex-col items-start gap-6" data-reveal>
          <TwoPartHeading text={A.h2} id="about-h" />
          <p className="section-lead">{A.p}</p>
          <Link href={pagePath(lang, 'about')} className="arrow-link">
            {A.more}
            <ArrowIcon />
          </Link>
        </div>
        <dl className="facts self-start" data-reveal="sm">
          {A.facts.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
