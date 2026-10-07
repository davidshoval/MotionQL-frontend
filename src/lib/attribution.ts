// First-touch marketing attribution: the utm_* tags of the visitor's first page in this tab, that page's path and the
// host that sent them. Kept in sessionStorage (never a cookie, nothing leaves the browser until sign-up) and sent with
// sign-up as `attribution`. Later pages never overwrite it. Limits match the backend (docs/API.md).

const KEY = "mq-attribution";

export interface Attribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  landingPath?: string;
  referrerHost?: string;
}

const UTM = [
  ["utm_source", "utmSource"],
  ["utm_medium", "utmMedium"],
  ["utm_campaign", "utmCampaign"],
  ["utm_content", "utmContent"],
] as const;

const LIMITS = { utm: 100, landingPath: 300, referrerHost: 253 };

const clean = (raw: string | null | undefined, max: number) => raw?.replace(/[\u0000-\u001f\u007f-\u009f]/g, "").trim().slice(0, max) || undefined;

/** The host of an external referrer, or undefined for none, our own site, or anything that is not a plain host. */
function referrerHost(referrer: string, ownHost: string): string | undefined {
  if (!referrer) return undefined;
  try {
    const host = new URL(referrer).host.toLowerCase();
    if (!host || host === ownHost.toLowerCase()) return undefined;
    return host.length <= LIMITS.referrerHost && /^[a-z0-9.-]+(:\d{1,5})?$/.test(host) ? host : undefined;
  } catch {
    return undefined;
  }
}

/** What the current page says about where the visitor came from. Exported for tests. */
export function attributionFrom(loc: { pathname: string; search: string; host: string }, referrer: string): Attribution {
  const params = new URLSearchParams(loc.search);
  const out: Attribution = {};
  for (const [param, field] of UTM) {
    const v = clean(params.get(param), LIMITS.utm);
    if (v) out[field] = v;
  }
  const path = clean(loc.pathname, LIMITS.landingPath);
  if (path?.startsWith("/")) out.landingPath = path;
  const host = referrerHost(referrer, loc.host);
  if (host) out.referrerHost = host;
  return out;
}

/** Records the first page of the visit. Does nothing once something is stored, or when storage is unavailable. */
export function captureFirstTouch() {
  try {
    if (sessionStorage.getItem(KEY) !== null) return;
    sessionStorage.setItem(KEY, JSON.stringify(attributionFrom(window.location, document.referrer)));
  } catch {
    // Private mode or blocked storage: no attribution, sign-up still works.
  }
}

/** The stored first touch, or undefined when there is none or nothing in it. */
export function loadAttribution(): Attribution | undefined {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return undefined;
    const v = JSON.parse(raw) as Record<string, unknown>;
    if (!v || typeof v !== "object") return undefined;
    const out: Attribution = {};
    for (const field of ["utmSource", "utmMedium", "utmCampaign", "utmContent"] as const) {
      const s = typeof v[field] === "string" ? clean(v[field] as string, LIMITS.utm) : undefined;
      if (s) out[field] = s;
    }
    if (typeof v.landingPath === "string" && v.landingPath.startsWith("/")) out.landingPath = clean(v.landingPath, LIMITS.landingPath);
    if (typeof v.referrerHost === "string" && /^[a-z0-9.-]+(:\d{1,5})?$/.test(v.referrerHost) && v.referrerHost.length <= LIMITS.referrerHost) {
      out.referrerHost = v.referrerHost;
    }
    return Object.keys(out).length ? out : undefined;
  } catch {
    return undefined;
  }
}
