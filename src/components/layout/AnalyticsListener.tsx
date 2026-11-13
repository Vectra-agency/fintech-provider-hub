'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { type AnalyticsEvent, track } from '@/lib/analytics';
import { parsePath } from '@/lib/routes';

/**
 * PRD §11. One delegated listener instead of a client wrapper per button:
 * any element with data-ev="<event>" is tracked on click; other data-* attributes become props
 * (placement, topic…), plus page and lang. Also sends page_view on every route.
 */
export function AnalyticsListener() {
  const pathname = usePathname();

  useEffect(() => {
    const { lang, page } = parsePath(pathname);
    track('page_view', { page: page ?? '404', lang });
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-ev]');
      if (!el) return;
      const { ev, ...rest } = el.dataset;
      const { lang, page } = parsePath(window.location.pathname);
      track(ev as AnalyticsEvent, { page: page ?? '404', lang, ...rest });
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
