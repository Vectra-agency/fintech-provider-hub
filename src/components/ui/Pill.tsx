import type { Status } from '@/content/types';

/**
 * Status pill (PRD §4.3.3, §9.2): the four statuses differ by colour AND text. Never remove or change
 * a status without approval — they carry the partner-dependency disclosure.
 */
export function Pill({ status, label }: { status: Status; label: string }) {
  return (
    <span className={`pill pill-${status}`}>
      <span className="pill-dot" aria-hidden="true" />
      {label}
    </span>
  );
}

export function Pills({ statuses, labels }: { statuses: readonly Status[]; labels: Record<Status, string> }) {
  return (
    <span className="flex flex-wrap gap-2">
      {statuses.map((s) => (
        <Pill key={s} status={s} label={labels[s]} />
      ))}
    </span>
  );
}
