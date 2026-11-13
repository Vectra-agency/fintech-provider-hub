import type { ReactNode } from 'react';
import { CheckIcon, InfoIcon } from './icons';
import { TwoPartHeading, type HeadingText } from './TwoPartHeading';

/** Checklist (prototype `checks`). */
export function Checks({ items, className = '' }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={`checks ${className}`}>
      {items.map((t) => (
        <li key={t}>
          <CheckIcon size={16} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

/** Demo-data disclosure next to every mockup and mini-widget (PRD §9.4). */
export function DemoNote({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`demo-note ${className}`}>
      <InfoIcon size={14} />
      <span>{children}</span>
    </p>
  );
}

/** Boxed note (availability, disclaimers) — mandatory texts of PRD §9.3 use it. */
export function Note({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`note ${className}`}>
      <InfoIcon size={16} />
      <p>{children}</p>
    </div>
  );
}

/**
 * Section header of the reference: two-part H2 on the left, lead paragraph on the right (stacked on mobile).
 */
export function SectionHead({
  heading,
  sub,
  id,
  className = '',
  children,
}: {
  heading: HeadingText;
  sub?: string;
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`section-head ${className}`} data-reveal>
      <TwoPartHeading text={heading} id={id} />
      {(sub || children) && (
        <div className="flex flex-col gap-5">
          {sub && <p className="section-lead">{sub}</p>}
          {children}
        </div>
      )}
    </div>
  );
}

/** Numbered row of steps (P3 bottom row: "01 Title / text"). */
export function Steps({ steps, className = '' }: { steps: readonly (readonly [string, string])[]; className?: string }) {
  return (
    <ol className={`steps ${className}`}>
      {steps.map(([t, d], i) => (
        <li key={t} className="step" data-reveal="sm" style={{ ['--reveal-delay' as string]: `${i * 100}ms` }}>
          <span className="step-n">{String(i + 1).padStart(2, '0')}</span>
          <h3 className="step-title">{t}</h3>
          <p className="step-text">{d}</p>
        </li>
      ))}
    </ol>
  );
}

/** Small mono label above titles (reference "01", "MULTI-AGENT PIPELINE · LIVE"). */
export function Kicker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}
