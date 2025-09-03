export type AnalyticsProvider = 'ga' | 'plausible';

let initialized = false;

export function initAnalytics() {
  if (initialized) return;
  const provider = import.meta.env.VITE_ANALYTICS_PROVIDER as AnalyticsProvider | undefined;
  if (provider === 'ga') {
    const id = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
    if (!id) return;
    // gtag script
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s);
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: unknown[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;
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

export function trackPageview(path: string) {
  const provider = import.meta.env.VITE_ANALYTICS_PROVIDER as AnalyticsProvider | undefined;
  if (provider === 'ga' && (window as any).gtag) {
    (window as any).gtag('event', 'page_view', { page_path: path });
  } else if (provider === 'plausible' && (window as any).plausible) {
    (window as any).plausible('pageview', { u: path });
  }
}

