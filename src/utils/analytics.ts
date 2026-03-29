type EventPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

const normalizePayload = (payload?: EventPayload) => {
  if (!payload) return {};
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
};

export const trackEvent = (eventName: string, payload?: EventPayload) => {
  if (typeof window === 'undefined') return;

  const eventPayload = normalizePayload(payload);

  // Supports both GTM dataLayer and gtag if either is present.
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...eventPayload });
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventPayload);
  }

  // Dev-safe fallback for local visibility while no analytics provider is wired.
  const isLocalHost = typeof window !== 'undefined' && /localhost|127\.0\.0\.1/.test(window.location.hostname);
  if (isLocalHost) {
    console.info('[analytics]', eventName, eventPayload);
  }
};
