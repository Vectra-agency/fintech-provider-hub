/** Brand palettes for mockups only (PRD §4.3.3, §7.5). */
export const BRANDS = ['ember', 'ocean', 'mint', 'iris'] as const;
export type Brand = (typeof BRANDS)[number];
export const DEFAULT_BRAND: Brand = 'ember';
export const BRAND_KEY = 'fph-brand';

/** Inline <head> script: applies the stored palette before first paint (no colour flash). */
export const BRAND_BOOT = `try{var b=localStorage.getItem('${BRAND_KEY}');if(b&&/^(${BRANDS.join('|')})$/.test(b))document.documentElement.setAttribute('data-brand',b)}catch(e){}`;

/** Everything that must run before first paint: `js` class (enables reveal styles) + stored palette. */
export const HEAD_BOOT = `document.documentElement.classList.add('js');${BRAND_BOOT}`;
