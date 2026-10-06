// The invite code from a /r/CODE link (refer a friend). Kept for 30 days in localStorage so it still counts when the
// visitor looks around the site first and signs up later.

const KEY = "mq-referral";
const TTL_MS = 30 * 86_400_000;

export const cleanReferralCode = (raw: string | null | undefined) => {
  const code = raw?.trim().toUpperCase();
  return code && /^[A-Z0-9]{4,16}$/.test(code) ? code : null;
};

export function saveReferral(code: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ code, at: Date.now() }));
  } catch {}
}

export function loadReferral(): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as { code?: string; at?: number };
    if (!v.at || Date.now() - v.at > TTL_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return cleanReferralCode(v.code);
  } catch {
    return null;
  }
}

export function clearReferral() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

/** Answers for "How did you hear about us?". "other" shows a text box. */
export const heardFromOptions = [
  { value: "search", label: "Search engine" },
  { value: "friend", label: "A friend or colleague" },
  { value: "reddit", label: "Reddit" },
  { value: "hacker-news", label: "Hacker News" },
  { value: "youtube", label: "YouTube" },
  { value: "social", label: "X, LinkedIn or other social media" },
  { value: "blog", label: "A blog post or article" },
  { value: "ai", label: "An AI assistant (ChatGPT, Claude, Gemini…)" },
  { value: "other", label: "Something else" },
] as const;
