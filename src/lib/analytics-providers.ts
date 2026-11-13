/**
 * TODO(Q2): provider is not chosen yet. Both candidates (cookie-free) are supported through their
 * HTTP APIs — no third-party script is loaded, so CSP stays `script-src 'self'` and only `connect-src`
 * gets the analytics origin (added to out/_headers by scripts/finalize-headers.ts).
 *
 *   NEXT_PUBLIC_ANALYTICS_PROVIDER = plausible | umami        (unset → dataLayer only)
 *   NEXT_PUBLIC_ANALYTICS_ENDPOINT = https://plausible.io | https://<umami-host>
 *   NEXT_PUBLIC_ANALYTICS_SITE     = site domain (Plausible) | website id (Umami)
 *
 * No personal data is sent (PRD §11): event name, page/lang props, URL without query string.
 */
import type { AnalyticsEvent } from './analytics';

type Props = Record<string, string | number | boolean | undefined>;

const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;
const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT?.replace(/\/$/, '');
const site = process.env.NEXT_PUBLIC_ANALYTICS_SITE;

const clean = (p: Props) => Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) as Record<string, string | number | boolean>;
const pageUrl = () => location.origin + location.pathname;

function post(url: string, body: unknown) {
  const data = JSON.stringify(body);
  // keepalive so events fired right before navigation (Telegram links) still go out
  fetch(url, { method: 'POST', body: data, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {});
}

export function providerAdapter(): ((event: AnalyticsEvent, props: Props) => void) | null {
  if (!provider || !endpoint || !site) return null;
  if (provider === 'plausible') {
    return (event, props) =>
      post(`${endpoint}/api/event`, {
        name: event === 'page_view' ? 'pageview' : event,
        url: pageUrl(),
        domain: site,
        referrer: document.referrer || null,
        props: clean(props),
      });
  }
  if (provider === 'umami') {
    return (event, props) =>
      post(`${endpoint}/api/send`, {
        type: 'event',
        payload: {
          website: site,
          hostname: location.hostname,
          url: location.pathname,
          language: document.documentElement.lang,
          referrer: document.referrer,
          title: document.title,
          screen: `${screen.width}x${screen.height}`,
          ...(event === 'page_view' ? {} : { name: event, data: clean(props) }),
        },
      });
  }
  return null;
}
