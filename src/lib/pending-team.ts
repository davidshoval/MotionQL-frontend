// The team someone asked for while signing up. Their session only starts once they verify their
// e-mail, so the team is created then (see verify-email). Kept in localStorage because the
// verification link usually opens in a new tab.

const KEY = "mq-pending-team";

export function savePendingTeam(email: string, name: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ email: email.toLowerCase(), name }));
  } catch {}
}

/** Returns the pending team name for this user and forgets it. */
export function takePendingTeam(email: string): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    localStorage.removeItem(KEY);
    const v = JSON.parse(raw) as { email?: string; name?: string };
    return v.email === email.toLowerCase() && v.name ? v.name : null;
  } catch {
    return null;
  }
}
