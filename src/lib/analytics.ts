/**
 * PRD §11. Pushes to window.dataLayer and forwards to the provider adapter (see analytics-providers.ts).
 * Never pass personal data.
 */
import { providerAdapter } from './analytics-providers';

export type AnalyticsEvent =
  | 'page_view'
  | 'explore_solutions'
  | 'request_demo'
  | 'submit_lead'
  | 'copy_message'
  | 'contact_click'
  | 'lang_switch'
  | 'brand_preview'
  | 'tab_select';

type Props = Record<string, string | number | boolean | undefined>;
type Adapter = (event: AnalyticsEvent, props: Props) => void;

let adapter: Adapter | null = typeof window === 'undefined' ? null : providerAdapter();
export function setAnalyticsAdapter(a: Adapter) {
  adapter = a;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === 'undefined') return;
  (window.dataLayer ??= []).push({ event, ...props });
  try {
    adapter?.(event, props);
  } catch {
    /* analytics must never break the page */
  }
}
