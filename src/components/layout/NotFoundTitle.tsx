'use client';

import { useEffect } from 'react';

/**
 * 404 is one static page for both languages. Next re-applies the metadata (EN) title after hydration,
 * so on /ru/… keep the RU title by watching <title>.
 */
export function NotFoundTitle({ ru }: { ru: string }) {
  useEffect(() => {
    if (!/^\/ru(\/|$)/.test(window.location.pathname)) return;
    const apply = () => {
      if (document.title !== ru) document.title = ru;
    };
    apply();
    const mo = new MutationObserver(apply);
    mo.observe(document.head, { subtree: true, childList: true, characterData: true });
    return () => mo.disconnect();
  }, [ru]);
  return null;
}
