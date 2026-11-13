import type { ReactNode } from 'react';
import { HERO_MEDIA_ENABLED, heroAsset, HERO_MOBILE_QUERY } from '@/components/hero/media';
import { Button } from '@/components/ui/Button';
import { tgUrl } from '@/lib/i18n';

/**
 * P1b — short hero for inner pages (PRD §6.0): no autoplay video; background is the poster frame
 * under a heavier overlay (Q10 default). Eyebrow, H1, sub, optional Telegram CTA, optional visual.
 */
export function PageHero({
  eyebrow,
  h1,
  sub,
  cta,
  visual,
  children,
}: {
  eyebrow: string;
  h1: string;
  sub?: string;
  cta?: string;
  visual?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="hero-bg" aria-hidden="true">
        {HERO_MEDIA_ENABLED && (
          <picture>
            <source media={HERO_MOBILE_QUERY} srcSet={heroAsset('poster-mobile.avif')} type="image/avif" />
            <source media={HERO_MOBILE_QUERY} srcSet={heroAsset('poster-mobile.webp')} type="image/webp" />
            <source srcSet={heroAsset('poster-desktop.avif')} type="image/avif" />
            <img src={heroAsset('poster-desktop.webp')} alt="" width={1920} height={1280} decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          </picture>
        )}
        <div className="pointer-events-none absolute inset-0 [background:var(--hero-overlay-x)]" />
        <div className="pointer-events-none absolute inset-0 [background:linear-gradient(to_bottom,rgb(0_0_0/0.35),rgb(0_0_0/0.15)_40%,#000)]" />
      </div>
      <div className={`section-inner relative z-10 grid items-center gap-12 pt-36 pb-20 lg:pt-44 lg:pb-28 ${visual ? 'lg:grid-cols-2' : ''}`}>
        <div className="flex max-w-[40rem] flex-col items-start">
          <p className="eyebrow hero-in">{eyebrow}</p>
          <h1 className="heading-page hero-in mt-5 [--hero-in-delay:80ms]">{h1}</h1>
          {sub && <p className="hero-in mt-6 text-base leading-relaxed text-white/75 sm:text-lg [--hero-in-delay:150ms]">{sub}</p>}
          {cta && (
            <div className="hero-in mt-9 [--hero-in-delay:200ms]">
              <Button href={tgUrl()} variant="solid" data-ev="request_demo" data-placement="page_hero">
                {cta}
              </Button>
            </div>
          )}
          {children}
        </div>
        {visual && <div className="hero-in [--hero-in-delay:300ms]">{visual}</div>}
      </div>
    </section>
  );
}
