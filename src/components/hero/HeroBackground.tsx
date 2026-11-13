import { HeroVideo } from './HeroVideo';
import { HERO_MEDIA_ENABLED, HERO_MOBILE_QUERY, heroAsset } from './media';

/**
 * Hero background: canvas-sized box of the reference (max-w 1344, full hero height) with
 * poster → video → the two gradient overlays of the reference. Server component; the video is an island.
 * The poster <img> is in the static HTML (preload scanner finds it) and is the LCP candidate.
 */
export function HeroBackground({ labels }: { labels: { pause: string; play: string } }) {
  return (
    <div className="hero-bg">
      {HERO_MEDIA_ENABLED && (
        <>
          <link rel="preload" as="image" href={heroAsset('poster-mobile.avif')} type="image/avif" media={HERO_MOBILE_QUERY} fetchPriority="high" />
          <link rel="preload" as="image" href={heroAsset('poster-desktop.avif')} type="image/avif" media={`not all and ${HERO_MOBILE_QUERY}`} fetchPriority="high" />
          <picture>
            <source media={HERO_MOBILE_QUERY} srcSet={heroAsset('poster-mobile.avif')} type="image/avif" />
            <source media={HERO_MOBILE_QUERY} srcSet={heroAsset('poster-mobile.webp')} type="image/webp" />
            <source srcSet={heroAsset('poster-desktop.avif')} type="image/avif" />
            <img
              src={heroAsset('poster-desktop.webp')}
              alt=""
              width={1920}
              height={1280}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
          <HeroVideo labels={labels} />
        </>
      )}
      <div className="pointer-events-none absolute inset-0 [background:var(--hero-overlay-x)]" />
      <div className="pointer-events-none absolute inset-0 [background:var(--hero-overlay-y)]" />
    </div>
  );
}
