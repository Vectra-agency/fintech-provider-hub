import type { ReactNode } from 'react';
import type { Lang } from '@/lib/i18n';
import type { ScreenKey, Status } from '@/content/types';
import { SectionDivider } from '@/components/layout/FrameLines';
import { Pill } from '@/components/ui/Pill';
import { Phones } from '@/components/mockups/Phone';
import { DemoNote } from '@/components/ui/Bits';
import { getDict } from '@/content';

/** Section shell with the reference rhythm; `divider` draws the 40px band above it. */
export function Section({
  id,
  labelledBy,
  children,
  divider = true,
  className = '',
}: {
  id?: string;
  labelledBy?: string;
  children: ReactNode;
  divider?: boolean;
  className?: string;
}) {
  return (
    <>
      {divider && <SectionDivider />}
      <section id={id} aria-labelledby={labelledBy} className={`section ${className}`}>
        <div className="section-inner">{children}</div>
      </section>
    </>
  );
}

/** P7 column card (reference pricing card): optional pills, title, body. `featured` = highlighted column. */
export function PlanCard({
  featured,
  top,
  title,
  children,
  as: Tag = 'h3',
}: {
  featured?: boolean;
  top?: ReactNode;
  title: string;
  children?: ReactNode;
  as?: 'h2' | 'h3';
}) {
  return (
    <article className={`plan${featured ? ' is-featured' : ''}`} data-reveal="sm">
      <div className="plan-top !min-h-0 gap-5">
        {top}
        <Tag className="plan-name">{title}</Tag>
        {children}
      </div>
    </article>
  );
}

/** Feature card for grids (P5): optional status pill, title, text. */
export function FeatureCard({ status, statusLabel, title, text }: { status?: Status; statusLabel?: string; title: string; text: string }) {
  return (
    <article className="card" data-reveal="sm">
      {status && statusLabel && <Pill status={status} label={statusLabel} />}
      <h3 className="card-title">{title}</h3>
      <p className="card-text">{text}</p>
    </article>
  );
}

/** Brand-recolourable phones on a halo stage + demo-data note (PRD §9.4). */
export function PhoneStage({ lang, names, s = 0.56, fixed, note = true }: { lang: Lang; names: readonly ScreenKey[]; s?: number; fixed?: boolean; note?: boolean }) {
  return (
    <div className={`phone-stage ${fixed ? 'br-ember' : 'brandable'}`}>
      <Phones names={names} lang={lang} s={s} fixed={fixed} />
      {note && <DemoNote>{getDict(lang).demoNote}</DemoNote>}
    </div>
  );
}

export function Tags({ items, className = '' }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((t) => (
        <li key={t} className="tag">
          {t}
        </li>
      ))}
    </ul>
  );
}
