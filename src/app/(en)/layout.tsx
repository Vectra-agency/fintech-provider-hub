import type { ReactNode } from 'react';
import { SiteLayout, siteMetadata, siteViewport } from '@/components/layout/SiteLayout';

export const metadata = siteMetadata;
export const viewport = siteViewport;

/** Root layout for the English site at "/" (default locale, no prefix). */
export default function Layout({ children }: { children: ReactNode }) {
  return <SiteLayout lang="en">{children}</SiteLayout>;
}
