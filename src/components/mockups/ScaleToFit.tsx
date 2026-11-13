'use client';

import { type CSSProperties, type ReactNode, useEffect, useRef } from 'react';

/**
 * PRD §7.4 — renders children at a fixed design size and scales them down to the container width.
 * Height is reserved by aspect-ratio, so there is no layout shift; ResizeObserver sets the scale.
 */
export function ScaleToFit({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) el.style.setProperty('--fit', String(Math.min(1, entry.contentRect.width / width)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={ref} className="scale-fit" style={{ aspectRatio: `${width} / ${height}`, maxWidth: width } as CSSProperties}>
      <div className="scale-fit-inner" style={{ width, height }}>
        {children}
      </div>
    </div>
  );
}
