import type { LicenseStatus, NewMember } from "@/lib/api";
import { daysUntil } from "@/lib/utils";

/** Keys this close to their end count as expiring: the admin is warned and "Renew expiring" picks them up. */
export const EXPIRING_DAYS = 30;

export type KeyState = "active" | "expiring" | "expired" | "revoked" | "replaced";

export function keyState(license: { status: LicenseStatus; expiresAt: string }): KeyState {
  if (license.status !== "active") return license.status;
  return daysUntil(license.expiresAt) <= EXPIRING_DAYS ? "expiring" : "active";
}

export const keyStateBadge: Record<KeyState, { label: string; variant: "success" | "warning" | "destructive" | "secondary" }> = {
  active: { label: "Active", variant: "success" },
  expiring: { label: "Expiring soon", variant: "warning" },
  expired: { label: "Expired", variant: "destructive" },
  revoked: { label: "Revoked", variant: "secondary" },
  replaced: { label: "Replaced", variant: "secondary" },
};

/** "345 days left", "Ends today", "Ended 3 days ago". */
export function daysLeftText(expiresAt: string) {
  const d = daysUntil(expiresAt);
  if (d > 1) return `${d} days left`;
  if (d === 1) return "1 day left";
  if (d === 0) return "Ends today";
  return `Ended ${-d} day${d === -1 ? "" : "s"} ago`;
}

/** How to name a member: their name, else their email (someone added by name only has no email). */
export const who = (m: { name?: string; email?: string }) => m.name || m.email || "This person";

export function maskKey(key: string) {
  return key.length > 24 ? `${key.slice(0, 10)}…${key.slice(-6)}` : key;
}

const EMAIL = /[^\s<>,;"'()]+@[^\s<>,;"'()]+\.[^\s<>,;"'()]+/g;

/**
 * Reads what an admin pastes: one person per line, as "maya@acme.io", "Maya Cohen <maya@acme.io>",
 * "Maya Cohen, maya@acme.io" (a spreadsheet row), just a name, or several bare emails on one line.
 */
export function parsePeople(text: string): { people: NewMember[]; invalid: string[] } {
  const people: NewMember[] = [];
  const invalid: string[] = [];
  for (const raw of text.split(/[\n;]+/)) {
    const line = raw.trim();
    if (!line) continue;
    const emails = line.match(EMAIL) ?? [];
    if (!emails.length) {
      // A line with no email is a name: that person is added without one.
      if (line.includes("@")) invalid.push(line);
      else
        people.push({
          name: line
            .replace(/[<>"'\t,]+/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
        });
      continue;
    }
    if (emails.length > 1) {
      for (const email of emails) people.push({ email: email.toLowerCase() });
      continue;
    }
    const email = emails[0]!;
    const name = line
      .replace(email, "")
      .replace(/[<>"'\t,]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    people.push({ email: email.toLowerCase(), ...(name ? { name } : {}) });
  }
  const seen = new Set<string>();
  return { people: people.filter((p) => !p.email || (!seen.has(p.email) && seen.add(p.email))), invalid };
}

/** CSV for keys handed out by hand (e.g. to device management). */
export function keysCsv(rows: { email?: string; name: string; expiresAt?: string; key?: string }[]) {
  const cell = (v: string) => {
    const s = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [["email", "name", "expires_at", "key"], ...rows.map((r) => [r.email ?? "", r.name, r.expiresAt ?? "", r.key ?? ""])]
    .map((r) => r.map(cell).join(","))
    .join("\n");
}

export function downloadText(filename: string, text: string, type = "text/csv") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
