import type { ReactNode } from 'react';

/** Reference "window" frame: hairline outer ring, gradient inner surface, glint on the top edge. */
export function Frame({ children, fade, className = '', innerClassName = '' }: { children: ReactNode; fade?: boolean; className?: string; innerClassName?: string }) {
  return (
    <div className={`ref-frame${fade ? ' fade' : ''} ${className}`}>
      <div className={`ref-frame-inner ${innerClassName}`}>{children}</div>
      <span className="ref-frame-glint" aria-hidden="true" />
    </div>
  );
}
