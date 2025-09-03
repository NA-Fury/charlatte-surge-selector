let recaptchaLoaded = false;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export async function loadRecaptcha(siteKey: string): Promise<void> {
  if (recaptchaLoaded || typeof window === 'undefined') return;
  await new Promise<void>((resolve) => {
    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    s.async = true;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
  recaptchaLoaded = true;
}

export async function getRecaptchaToken(siteKey: string, action: string): Promise<string | undefined> {
  if (typeof window === 'undefined' || !window.grecaptcha) return undefined;
  return new Promise<string | undefined>((resolve) => {
    window.grecaptcha!.ready(async () => {
      try {
        const token = await window.grecaptcha!.execute(siteKey, { action });
        resolve(token);
      } catch {
        resolve(undefined);
      }
    });
  });
}

