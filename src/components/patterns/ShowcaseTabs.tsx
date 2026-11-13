'use client';

import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from 'react';
import { track } from '@/lib/analytics';

/**
 * PRD §7.7 — WAI-ARIA Tabs shown as a numbered 01–04 list (P4). All panels are in the HTML; inactive
 * ones are `hidden`. Arrows/Home/End move focus and select (automatic activation), roving tabindex.
 * The phones for each tab are a separate visual region switched together with the panel.
 */
export function ShowcaseTabs({
  label,
  tabs,
  panels,
  visuals,
  aside,
}: {
  label: string;
  tabs: readonly { id: string; label: string }[];
  panels: readonly ReactNode[];
  visuals: readonly ReactNode[];
  aside?: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();

  const select = (i: number, focus = false) => {
    setActive(i);
    if (focus) refs.current[i]?.focus();
    track('tab_select', { tab: tabs[i]?.id });
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = tabs.length - 1;
    const next = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select((next + tabs.length) % tabs.length, true);
  };

  return (
    <div className="showcase">
      <div className="showcase-left">
        <div role="tablist" aria-label={label} aria-orientation="vertical" className="showcase-tabs">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${t.id}`}
              aria-selected={i === active}
              aria-controls={`${base}-panel-${t.id}`}
              tabIndex={i === active ? 0 : -1}
              className="showcase-tab"
              onClick={() => select(i)}
              onKeyDown={(e) => onKey(e, i)}
            >
              <span className="showcase-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="showcase-label">{t.label}</span>
            </button>
          ))}
        </div>
        {panels.map((p, i) => (
          <div
            key={tabs[i]?.id}
            role="tabpanel"
            id={`${base}-panel-${tabs[i]?.id}`}
            aria-labelledby={`${base}-tab-${tabs[i]?.id}`}
            hidden={i !== active}
            tabIndex={0}
            className="showcase-panel"
          >
            {p}
          </div>
        ))}
      </div>
      <div className="showcase-right">
        {visuals.map((v, i) => (
          <div key={tabs[i]?.id} hidden={i !== active} className="showcase-visual">
            {v}
          </div>
        ))}
        {aside}
      </div>
    </div>
  );
}
