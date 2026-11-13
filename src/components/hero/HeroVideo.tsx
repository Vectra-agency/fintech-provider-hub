'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { readLS, writeLS } from '@/lib/storage';
import { track } from '@/lib/analytics';
import { HERO_MOBILE_QUERY, heroAsset } from './media';

/**
 * PRD §7.1 — background loop for the hero. Client island.
 *
 * - The poster (in <HeroBackground>, server-rendered) is always there; the <video> mounts on top only
 *   when it should play and fades in on the first `playing` event, so a refused autoplay leaves the poster.
 * - No autoplay with prefers-reduced-motion, Save-Data, or 2g/slow-2g. The user can still press Play.
 * - Paused while the hero is off-screen or the tab is hidden.
 * - WCAG 2.2.2: visible, keyboard-reachable Pause/Play; explicit choice persisted in localStorage.
 */

const STORAGE_KEY = 'fph-hero-video';

type Variant = 'desktop' | 'mobile';
type Labels = { pause: string; play: string };

// ── variant: follows the breakpoint
function subscribeVariant(cb: () => void) {
  const mq = window.matchMedia(HERO_MOBILE_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}
const getVariant = (): Variant => (window.matchMedia(HERO_MOBILE_QUERY).matches ? 'mobile' : 'desktop');
const getServerVariant = (): Variant | null => null;

// ── autoplay policy: computed once per page load, updated by explicit user choice
let autoplayPolicy: boolean | undefined;
function getAutoplayPolicy(): boolean {
  if (autoplayPolicy === undefined) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slow = !!c && (c.saveData === true || c.effectiveType === '2g' || c.effectiveType === 'slow-2g');
    autoplayPolicy = !reduced && !slow && readLS(STORAGE_KEY) !== 'paused';
  }
  return autoplayPolicy;
}
const noSubscribe = () => () => {};
const getServerPolicy = () => false;

export function HeroVideo({ labels }: { labels: Labels }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const variant = useSyncExternalStore(subscribeVariant, getVariant, getServerVariant);
  const policy = useSyncExternalStore(noSubscribe, getAutoplayPolicy, getServerPolicy);
  /** null = follow policy; boolean = explicit user choice or refused autoplay in this session */
  const [override, setOverride] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  const wantPlay = override ?? policy;
  const mounted = wantPlay || loaded;

  // Off-screen / hidden tab
  useEffect(() => {
    const hero = boxRef.current?.closest('section') ?? boxRef.current;
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), { threshold: 0.01 });
    io.observe(hero);
    const onVis = () => setPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  // Drive the element
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (wantPlay && inView && pageVisible) {
      v.play().catch((e: unknown) => {
        // Autoplay refused (iOS Low Power Mode, webview policy…): keep the poster, show "Play".
        // AbortError only means a pending play() was interrupted by pause() — not a refusal.
        if (e instanceof DOMException && e.name === 'NotAllowedError') setOverride(false);
      });
    } else {
      v.pause();
    }
  }, [wantPlay, inView, pageVisible, mounted, variant]);

  const toggle = useCallback(() => {
    const next = !wantPlay;
    setOverride(next);
    autoplayPolicy = next;
    writeLS(STORAGE_KEY, next ? 'playing' : 'paused');
    track('hero_video_toggle', { state: next ? 'play' : 'pause' });
  }, [wantPlay]);

  return (
    <>
      <div ref={boxRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
        {mounted && variant && (
          <video
            key={variant}
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            autoPlay={wantPlay}
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroAsset(`poster-${variant}.webp`)}
            disablePictureInPicture
            disableRemotePlayback
            tabIndex={-1}
            onPlaying={() => setLoaded(true)}
          >
            <source src={heroAsset(`hero-${variant}.webm`)} type='video/webm; codecs="vp9"' />
            <source src={heroAsset(`hero-${variant}.mp4`)} type="video/mp4" />
          </video>
        )}
      </div>
      {variant && (
        <button type="button" onClick={toggle} aria-label={wantPlay ? labels.pause : labels.play} className="hero-video-toggle">
          {wantPlay ? (
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor">
              <rect x="3.5" y="2.5" width="3" height="11" rx="0.75" />
              <rect x="9.5" y="2.5" width="3" height="11" rx="0.75" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor">
              <path d="M4.5 2.9v10.2a.6.6 0 0 0 .9.52l8.2-5.1a.6.6 0 0 0 0-1.03l-8.2-5.1a.6.6 0 0 0-.9.51Z" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
