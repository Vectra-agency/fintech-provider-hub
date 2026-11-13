/** Shared between the server poster and the client video island — keep both on the same breakpoint. */
export const HERO_MOBILE_QUERY = '(max-width: 47.99rem)';

/**
 * TODO(Q9): footage and poster are renders of the reference template; until the licence is confirmed
 * they ship on preview deploys only. Production builds set NEXT_PUBLIC_HERO_MEDIA=off (see CI), which
 * leaves the plain black hero background of the reference.
 */
export const HERO_MEDIA_ENABLED = process.env.NEXT_PUBLIC_HERO_MEDIA !== 'off';

/** Bump when the media files change (they are cached for 30 days by _headers). */
const HERO_MEDIA_VERSION = '1';
export const heroAsset = (file: string) => `/media/hero/${file}?v=${HERO_MEDIA_VERSION}`;
