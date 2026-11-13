'use client';

import { useId, useSyncExternalStore } from 'react';
import { BRANDS, BRAND_KEY, DEFAULT_BRAND, type Brand } from '@/lib/brand';
import { writeLS } from '@/lib/storage';
import { track } from '@/lib/analytics';

const SWATCH: Record<Brand, string> = { ember: '#F04800', ocean: '#2F6BFF', mint: '#0E9F6E', iris: '#7C3AED' };

// <html data-brand> is the single source of truth (set before paint by the head script), so several
// switchers on one page stay in sync.
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-brand'] });
  return () => mo.disconnect();
}
const getBrand = () => (document.documentElement.getAttribute('data-brand') as Brand | null) ?? DEFAULT_BRAND;
const getServerBrand = (): Brand => DEFAULT_BRAND;

/** PRD §7.5 — palette preview for the mockups only. Client island. */
export function BrandSwitcher({ label, names, align = 'center' }: { label: string; names: Record<Brand, string>; align?: 'center' | 'start' }) {
  const brand = useSyncExternalStore(subscribe, getBrand, getServerBrand);
  const labelId = useId();

  const choose = (b: Brand) => {
    if (b === brand) return;
    document.documentElement.setAttribute('data-brand', b);
    writeLS(BRAND_KEY, b);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll<HTMLElement>('.phone.brandable').forEach((el) => {
        el.classList.remove('swap');
        void el.offsetWidth; // restart the animation
        el.classList.add('swap');
      });
    }
    track('brand_preview', { brand: b });
  };

  return (
    <div className={`brand-switch ${align === 'start' ? 'items-start' : 'items-center'}`}>
      <p id={labelId}>{label}</p>
      <div role="group" aria-labelledby={labelId} className="sw-row">
        {BRANDS.map((b) => (
          <button key={b} type="button" className="sw" aria-pressed={brand === b} onClick={() => choose(b)}>
            <i style={{ background: SWATCH[b] }} aria-hidden="true" />
            {names[b]}
          </button>
        ))}
      </div>
    </div>
  );
}
