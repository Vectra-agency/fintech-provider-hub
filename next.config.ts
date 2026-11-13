import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  experimental: {
    // Root layout lives in app/[lang]/, so the site-wide 404 is app/global-not-found.tsx.
    globalNotFound: true,
  },
};

export default nextConfig;
