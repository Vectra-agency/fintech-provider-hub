import type { ReactNode } from 'react';
import type { Lang } from '@/lib/i18n';
import type { ScreenKey } from '@/content/types';
import { SectionDivider } from '@/components/layout/FrameLines';
import { Phones } from '@/components/mockups/Phone';

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

/** P7 column card (reference pricing card): optional top slot, title, body. `featured` = highlighted column. */
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

/** Feature card for grids (P5): title, text. */
export function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="card" data-reveal="sm">
      <h3 className="card-title">{title}</h3>
      <p className="card-text">{text}</p>
    </article>
  );
}

/** Brand-recolourable phones on a halo stage. */
export function PhoneStage({ lang, names, s = 0.56, fixed }: { lang: Lang; names: readonly ScreenKey[]; s?: number; fixed?: boolean }) {
  return (
    <div className={`phone-stage ${fixed ? 'br-ember' : 'brandable'}`}>
      <Phones names={names} lang={lang} s={s} fixed={fixed} />
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
