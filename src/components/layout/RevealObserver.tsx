'use client';

import { useEffect } from 'react';

/**
 * PRD §7.9 — one observer for every [data-reveal] element on the page (no wrapper islands).
 * Hidden state is CSS-only and applies only under `html.js` + no reduced motion, so content is
 * visible without JS. Elements added later (client navigation) are picked up by a MutationObserver.
 */
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    const scan = (root: ParentNode) => root.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));
    scan(document);
    const mo = new MutationObserver((recs) => {
      for (const r of recs) r.addedNodes.forEach((n) => n instanceof Element && scan(n.parentElement ?? n));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
