/**
 * Privacy-friendly analytics with Umami (https://umami.is): no cookies, no personal data, so no consent banner.
 * Off unless NEXT_PUBLIC_UMAMI_WEBSITE_ID is set at build time. Page views are counted by the script itself,
 * including client-side navigations; `track` adds the few events we care about.
 */
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? "";
export const UMAMI_SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || "https://cloud.umami.is/script.js";

export type AnalyticsEvent = "download" | "register" | "sign-in";

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string | number>) => void };
  }
}

/** Records an event. Never throws: a blocked or missing script must not break the page. */
export function track(event: AnalyticsEvent, data?: Record<string, string | number>) {
  try {
    window.umami?.track(event, data);
  } catch {
    // Analytics is best effort.
  }
}
