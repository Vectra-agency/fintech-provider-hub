import { Google_Sans, Inter } from 'next/font/google';

// Display face of the design reference. Self-hosted by next/font at build time; has Cyrillic (Q11).
// Next ships no metrics for Google Sans → the size-adjusted fallback face lives in globals.css.
export const display = Google_Sans({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-google-sans',
  display: 'swap',
  adjustFontFallback: false,
});

// Font of the product screens inside the phone/admin mockups (prototype). Not preloaded: mockups are decorative.
export const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter', display: 'swap', preload: false });
