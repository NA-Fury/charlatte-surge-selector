export type AnalyticsProvider = 'ga' | 'plausible';

type GtagFn = (...args: unknown[]) => void;
type PlausibleFn = (event: string, opts?: { u?: string; props?: Record<string, unknown> }) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
    plausible?: PlausibleFn;
  }
}

let initialized = false;

export function initAnalytics(): void {
  if (initialized || typeof window === 'undefined') return;
  const provider = import.meta.env.VITE_ANALYTICS_PROVIDER as AnalyticsProvider | undefined;
  if (provider === 'ga') {
    const id = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
    if (!id) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    const gtag: GtagFn = (...args) => {
      window.dataLayer!.push(args);
    };
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', id);
    initialized = true;
  } else if (provider === 'plausible') {
    const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
    if (!domain) return;
    const s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', domain);
    s.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(s);
    initialized = true;
  }
}

export function trackPageview(path: string): void {
  const provider = import.meta.env.VITE_ANALYTICS_PROVIDER as AnalyticsProvider | undefined;
  if (provider === 'ga' && window.gtag) {
    window.gtag('event', 'page_view', { page_path: path });
  } else if (provider === 'plausible' && window.plausible) {
    window.plausible('pageview', { u: path });
  }
}

export function trackEvent(name: string, props?: Record<string, unknown>): void {
  const provider = import.meta.env.VITE_ANALYTICS_PROVIDER as AnalyticsProvider | undefined;
  if (provider === 'ga' && window.gtag) {
    window.gtag('event', name, props || {});
  } else if (provider === 'plausible' && window.plausible) {
    window.plausible(name, { props });
  }
}
