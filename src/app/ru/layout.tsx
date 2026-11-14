import type { ReactNode } from 'react';
import { SiteLayout, siteMetadata, siteViewport } from '@/components/layout/SiteLayout';

export const metadata = siteMetadata;
export const viewport = siteViewport;

/** Root layout for the Russian site at "/ru/". */
export default function Layout({ children }: { children: ReactNode }) {
  return <SiteLayout lang="ru">{children}</SiteLayout>;
}
