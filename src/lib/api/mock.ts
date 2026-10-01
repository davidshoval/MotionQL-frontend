// In-browser stand-in for the backend, used when NEXT_PUBLIC_API_URL is not set.
// It keeps its data in localStorage so the whole flow (register, verify, key, team admin) can be clicked through
// on a preview deploy. Keys it issues are clearly fake and will not activate the app.
import { ApiError } from "./client";
import type { Api } from "./index";
import type { AuditEvent, Invite, License, Member, Release, Role, Team, User } from "./types";

interface StoredUser extends User {
  password: string;
}
interface StoredTeam {
  id: string;
  name: string;
  seatLimit: number;
  createdAt: string;
}
interface StoredMember {
  teamId: string;
  userId: string | null;
  email: string;
  role: Role;
  seat: boolean;
  licenseId: string | null;
  joinedAt: string;
}
interface DB {
  users: StoredUser[];
  session: string | null;
  licenses: (License & { userId: string })[];
  teams: StoredTeam[];
  members: StoredMember[];
  invites: (Invite & { teamId: string; token: string })[];
  audit: (AuditEvent & { teamId: string })[];
  tokens: { token: string; userId: string; kind: "verify" | "reset" }[];
}

const KEY = "xq-mock-db-v1";
const empty = (): DB => ({ users: [], session: null, licenses: [], teams: [], members: [], invites: [], audit: [], tokens: [] });

function load(): DB {
  if (typeof window === "undefined") return empty();
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...empty(), ...(JSON.parse(raw) as DB) } : empty();
  } catch {
    return empty();
  }
}
function save(db: DB) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* private mode: state lives for this page only */
  }
}

const id = (p: string) => `${p}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
const now = () => new Date().toISOString();
const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms + Math.random() * 250));
const b64url = (s: string) =>
  btoa(unescape(encodeURIComponent(s)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

function fail(status: number, code: string, message: string, fields?: Record<string, string>): never {
  throw new ApiError(status, code, message, fields);
}
function publicUser({ password: _pw, ...u }: StoredUser): User {
  void _pw;
  return u;
}
function sessionUser(db: DB): StoredUser {
  const u = db.users.find((x) => x.id === db.session);
  if (!u) fail(401, "unauthorized", "Please sign in.");
  return u;
}

function issueKey(db: DB, user: StoredUser, team: StoredTeam | null): License & { userId: string } {
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + 365 * 86_400_000);
  const payload = {
    licenseId: id("lic"),
    customer: team?.name ?? user.company ?? user.name,
    email: user.email,
    edition: "pro",
    seats: 1,
    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    features: [],
    demo: true,
  };
  const sig = Array.from(
    { length: 64 },
    () => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"[Math.floor(Math.random() * 64)],
  ).join("");
  const lic = {
    userId: user.id,
    licenseId: payload.licenseId,
    key: `XQ1.${b64url(JSON.stringify(payload))}.${sig}`,
    edition: "pro" as const,
    seats: 1,
    features: [],
    issuedAt: payload.issuedAt,
    expiresAt: payload.expiresAt,
    revokedAt: null,
    status: "active" as const,
    team: team ? { id: team.id, name: team.name } : null,
  };
  db.licenses.push(lic);
  return lic;
}
function revoke(db: DB, licenseId: string | null) {
  const l = db.licenses.find((x) => x.licenseId === licenseId);
  if (l && !l.revokedAt) {
    l.revokedAt = now();
    l.status = "revoked";
  }
}
function strip<T extends { userId?: string }>(l: T): Omit<T, "userId"> {
  const { userId: _u, ...rest } = l;
  void _u;
  return rest;
}

function teamView(db: DB, t: StoredTeam, userId: string): Team {
  const me = db.members.find((m) => m.teamId === t.id && m.userId === userId);
  return {
    id: t.id,
    name: t.name,
    role: me?.role ?? "member",
    seats: { limit: t.seatLimit, used: db.members.filter((m) => m.teamId === t.id && m.seat).length },
    createdAt: t.createdAt,
  };
}
function memberView(db: DB, m: StoredMember): Member {
  const u = db.users.find((x) => x.id === m.userId);
  const lic = db.licenses.find((l) => l.licenseId === m.licenseId);
  const seeded = m.userId?.startsWith("demo_");
  return {
    userId: m.userId,
    email: m.email,
    name: u?.name ?? null,
    role: m.role,
    status: "active",
    seat: m.seat,
    license: lic ? strip(lic) : null,
    lastSeenAt: seeded ? new Date(Date.now() - (1 + (m.email.length % 5)) * 86_400_000).toISOString() : null,
    appVersion: seeded ? "1.0.0" : null,
    os: seeded ? ["macOS 15", "Windows 11", "Ubuntu 24.04"][m.email.length % 3] : null,
    installs: seeded ? 1 + (m.email.length % 2) : null,
    invitedAt: null,
  };
}
function requireAdmin(db: DB, teamId: string) {
  const user = sessionUser(db);
  const team = db.teams.find((t) => t.id === teamId);
  if (!team) fail(404, "not_found", "Team not found.");
  const me = db.members.find((m) => m.teamId === teamId && m.userId === user.id);
  if (!me) fail(403, "forbidden", "You are not a member of this team.");
  if (me.role === "member") fail(403, "forbidden", "Only team admins can do that.");
  return { user, team, me };
}
function log(db: DB, teamId: string, actor: string, action: string, target: string) {
  db.audit.unshift({ id: id("evt"), teamId, actor: { email: actor }, action, target, at: now() });
}
function findMember(db: DB, teamId: string, userId: string) {
  const m = db.members.find((x) => x.teamId === teamId && x.userId === userId);
  if (!m) fail(404, "not_found", "Member not found.");
  return m;
}

const RELEASE: Release = {
  version: "1.0.0",
  releasedAt: "2026-10-01T00:00:00.000Z",
  notesUrl: "/changelog",
  files: [
    { id: "mac-arm64-dmg", name: "XQuery-1.0.0-arm64.dmg", os: "mac", arch: "arm64", kind: "dmg", size: 148_897_792, sha256: "b1f0…demo" },
    { id: "mac-x64-dmg", name: "XQuery-1.0.0-x64.dmg", os: "mac", arch: "x64", kind: "dmg", size: 154_140_672, sha256: "7c2e…demo" },
    { id: "win-x64-exe", name: "XQuery-Setup-1.0.0.exe", os: "windows", arch: "x64", kind: "exe", size: 112_197_632, sha256: "e4a9…demo" },
    { id: "win-x64-msi", name: "XQuery-1.0.0-x64.msi", os: "windows", arch: "x64", kind: "msi", size: 118_489_088, sha256: "09bd…demo" },
    {
      id: "linux-x64-appimage",
      name: "XQuery-1.0.0-x86_64.AppImage",
      os: "linux",
      arch: "x64",
      kind: "AppImage",
      size: 160_432_128,
      sha256: "51aa…demo",
    },
    { id: "linux-x64-deb", name: "xquery_1.0.0_amd64.deb", os: "linux", arch: "x64", kind: "deb", size: 104_857_600, sha256: "c3d7…demo" },
    { id: "linux-x64-rpm", name: "xquery-1.0.0.x86_64.rpm", os: "linux", arch: "x64", kind: "rpm", size: 105_906_176, sha256: "8f12…demo" },
  ],
};

export const mockApi: Api = {
  async register({ email, password, name, company }) {
    await wait();
    const db = load();
    const e = email.trim().toLowerCase();
    if (db.users.some((u) => u.email === e))
      fail(409, "email_taken", "An account with this email already exists.", { email: "Already registered. Sign in instead." });
    const user: StoredUser = { id: id("usr"), email: e, name, company: company || null, emailVerified: false, createdAt: now(), password };
    db.users.push(user);
    const token = id("vt");
    db.tokens.push({ token, userId: user.id, kind: "verify" });
    save(db);
    return { user: publicUser(user), devVerifyToken: token };
  },
  async verifyEmail(token) {
    await wait();
    const db = load();
    const t = db.tokens.find((x) => x.token === token && x.kind === "verify");
    if (!t) fail(400, "invalid_token", "This link is invalid or has already been used.");
    const user = db.users.find((u) => u.id === t.userId)!;
    user.emailVerified = true;
    db.tokens = db.tokens.filter((x) => x !== t);
    if (!db.licenses.some((l) => l.userId === user.id && !l.team)) issueKey(db, user, null);
    db.session = user.id;
    // Accept any invite waiting for this address.
    for (const inv of db.invites.filter((i) => i.email === user.email)) {
      const team = db.teams.find((x) => x.id === inv.teamId)!;
      const lic = inv.assignSeat ? issueKey(db, user, team) : null;
      db.members.push({
        teamId: inv.teamId,
        userId: user.id,
        email: user.email,
        role: inv.role,
        seat: inv.assignSeat,
        licenseId: lic?.licenseId ?? null,
        joinedAt: now(),
      });
      log(db, inv.teamId, user.email, "member.joined", user.email);
    }
    db.invites = db.invites.filter((i) => i.email !== user.email);
    save(db);
    return { user: publicUser(user) };
  },
  async resendVerification() {
    await wait();
  },
  async login(email, password) {
    await wait();
    const db = load();
    const user = db.users.find((u) => u.email === email.trim().toLowerCase());
    if (!user || user.password !== password) fail(401, "invalid_credentials", "That email and password don't match.");
    if (!user.emailVerified) fail(403, "email_not_verified", "Verify your email first. We sent you a link.");
    db.session = user.id;
    save(db);
    return { user: publicUser(user) };
  },
  async logout() {
    const db = load();
    db.session = null;
    save(db);
  },
  async requestPasswordReset(email) {
    await wait();
    const db = load();
    const user = db.users.find((u) => u.email === email.trim().toLowerCase());
    if (!user) return;
    const token = id("rt");
    db.tokens.push({ token, userId: user.id, kind: "reset" });
    save(db);
    return { devResetToken: token };
  },
  async confirmPasswordReset(token, password) {
    await wait();
    const db = load();
    const t = db.tokens.find((x) => x.token === token && x.kind === "reset");
    if (!t) fail(400, "invalid_token", "This link is invalid or has expired.");
    db.users.find((u) => u.id === t.userId)!.password = password;
    db.tokens = db.tokens.filter((x) => x !== t);
    save(db);
  },
  oauthUrl: () => null,

  async me() {
    await wait(120);
    const db = load();
    const user = sessionUser(db);
    const teams = db.teams
      .filter((t) => db.members.some((m) => m.teamId === t.id && m.userId === user.id))
      .map((t) => teamView(db, t, user.id));
    return { user: publicUser(user), teams };
  },
  async updateMe(patch) {
    await wait();
    const db = load();
    const user = sessionUser(db);
    if (patch.name !== undefined) user.name = patch.name;
    if (patch.company !== undefined) user.company = patch.company || null;
    save(db);
    return { user: publicUser(user) };
  },
  async deleteMe() {
    await wait();
    const db = load();
    const user = sessionUser(db);
    db.users = db.users.filter((u) => u.id !== user.id);
    db.members = db.members.filter((m) => m.userId !== user.id);
    db.session = null;
    save(db);
  },
  async myLicenses() {
    await wait(150);
    const db = load();
    const user = sessionUser(db);
    for (const l of db.licenses) if (l.status === "active" && new Date(l.expiresAt) < new Date()) l.status = "expired";
    return {
      licenses: db.licenses
        .filter((l) => l.userId === user.id)
        .map(strip)
        .reverse(),
    };
  },
  async renewLicense() {
    await wait();
    const db = load();
    const user = sessionUser(db);
    const lic = issueKey(db, user, null);
    save(db);
    return { license: strip(lic) };
  },
  async reissueLicense(licenseId) {
    await wait();
    const db = load();
    const user = sessionUser(db);
    const old = db.licenses.find((l) => l.licenseId === licenseId && l.userId === user.id);
    if (!old) fail(404, "not_found", "License not found.");
    revoke(db, licenseId);
    const lic = issueKey(db, user, null);
    save(db);
    return { license: strip(lic) };
  },

  async latestRelease() {
    await wait(100);
    return RELEASE;
  },
  async downloadLink(fileId) {
    await wait(200);
    const file = RELEASE.files.find((f) => f.id === fileId);
    if (!file) fail(404, "not_found", "File not found.");
    return {
      url: `https://github.com/davidshoval/Xquery.io-releases/releases/latest`,
      expiresAt: new Date(Date.now() + 600_000).toISOString(),
    };
  },
  async publicPlans() {
    return { free: { enabled: true, edition: "pro", durationDays: 365 } };
  },

  async createTeam(name) {
    await wait();
    const db = load();
    const user = sessionUser(db);
    const team: StoredTeam = { id: id("team"), name, seatLimit: 25, createdAt: now() };
    db.teams.push(team);
    const lic = issueKey(db, user, team);
    db.members.push({
      teamId: team.id,
      userId: user.id,
      email: user.email,
      role: "owner",
      seat: true,
      licenseId: lic.licenseId,
      joinedAt: now(),
    });
    // A few sample teammates so the admin screens have something to show on a preview deploy.
    const domain = user.email.split("@")[1] ?? "example.com";
    for (const [n, role] of [
      ["maya.cohen", "admin"],
      ["jordan.lee", "member"],
      ["sam.patel", "member"],
    ] as const) {
      const sample: StoredUser = {
        id: id("demo"),
        email: `${n}@${domain}`,
        name: n
          .split(".")
          .map((s) => s[0].toUpperCase() + s.slice(1))
          .join(" "),
        company: name,
        emailVerified: true,
        createdAt: now(),
        password: "",
      };
      db.users.push(sample);
      const l = role === "member" && n.startsWith("sam") ? null : issueKey(db, sample, team);
      db.members.push({
        teamId: team.id,
        userId: sample.id,
        email: sample.email,
        role,
        seat: !!l,
        licenseId: l?.licenseId ?? null,
        joinedAt: now(),
      });
    }
    log(db, team.id, user.email, "team.created", name);
    save(db);
    return { team: teamView(db, team, user.id) };
  },
  async team(teamId) {
    await wait(120);
    const db = load();
    const user = sessionUser(db);
    const t = db.teams.find((x) => x.id === teamId);
    if (!t || !db.members.some((m) => m.teamId === teamId && m.userId === user.id)) fail(404, "not_found", "Team not found.");
    return { team: teamView(db, t, user.id) };
  },
  async renameTeam(teamId, name) {
    await wait();
    const db = load();
    const { user, team } = requireAdmin(db, teamId);
    log(db, teamId, user.email, "team.renamed", `${team.name} → ${name}`);
    team.name = name;
    save(db);
    return { team: teamView(db, team, user.id) };
  },
  async members(teamId) {
    await wait(150);
    const db = load();
    sessionUser(db);
    return { members: db.members.filter((m) => m.teamId === teamId).map((m) => memberView(db, m)) };
  },
  async updateMember(teamId, userId, patch) {
    await wait();
    const db = load();
    const { user, me } = requireAdmin(db, teamId);
    const m = findMember(db, teamId, userId);
    if (patch.role) {
      if (m.role === "owner" || patch.role === "owner") fail(400, "validation", "Ownership is transferred from team settings.");
      if (me.role !== "owner" && patch.role === "admin" && m.role !== "admin") {
        /* admins may promote; only the owner changes owners */
      }
      m.role = patch.role;
      log(db, teamId, user.email, "member.role_changed", `${m.email} → ${patch.role}`);
    }
    save(db);
    return { member: memberView(db, m) };
  },
  async removeMember(teamId, userId) {
    await wait();
    const db = load();
    const { user } = requireAdmin(db, teamId);
    const m = findMember(db, teamId, userId);
    if (m.role === "owner") fail(400, "validation", "The owner can't be removed.");
    revoke(db, m.licenseId);
    db.members = db.members.filter((x) => x !== m);
    log(db, teamId, user.email, "member.removed", m.email);
    save(db);
  },
  async assignSeat(teamId, userId) {
    await wait();
    const db = load();
    const { user, team } = requireAdmin(db, teamId);
    const m = findMember(db, teamId, userId);
    if (db.members.filter((x) => x.teamId === teamId && x.seat).length >= team.seatLimit) fail(400, "seat_limit", "All seats are in use.");
    const holder = db.users.find((u) => u.id === m.userId)!;
    m.seat = true;
    m.licenseId = issueKey(db, holder, team).licenseId;
    log(db, teamId, user.email, "seat.assigned", m.email);
    save(db);
    return { member: memberView(db, m) };
  },
  async freeSeat(teamId, userId) {
    await wait();
    const db = load();
    const { user } = requireAdmin(db, teamId);
    const m = findMember(db, teamId, userId);
    revoke(db, m.licenseId);
    m.seat = false;
    m.licenseId = null;
    log(db, teamId, user.email, "seat.freed", m.email);
    save(db);
    return { member: memberView(db, m) };
  },
  async reissueMemberKey(teamId, userId) {
    await wait();
    const db = load();
    const { user, team } = requireAdmin(db, teamId);
    const m = findMember(db, teamId, userId);
    if (!m.seat) fail(400, "validation", "Assign a seat first.");
    revoke(db, m.licenseId);
    m.licenseId = issueKey(
      db,
      db.users.find((u) => u.id === m.userId)!,
      team,
    ).licenseId;
    log(db, teamId, user.email, "license.reissued", m.email);
    save(db);
    return { member: memberView(db, m) };
  },
  async invites(teamId) {
    await wait(150);
    const db = load();
    sessionUser(db);
    return { invites: db.invites.filter((i) => i.teamId === teamId).map(({ teamId: _t, token: _k, ...i }) => (void _t, void _k, i)) };
  },
  async invite(teamId, { emails, role, assignSeat }) {
    await wait();
    const db = load();
    const { user } = requireAdmin(db, teamId);
    const created: Invite[] = [];
    for (const raw of emails) {
      const email = raw.trim().toLowerCase();
      if (
        !email ||
        db.invites.some((i) => i.teamId === teamId && i.email === email) ||
        db.members.some((m) => m.teamId === teamId && m.email === email)
      )
        continue;
      const inv = {
        id: id("inv"),
        teamId,
        token: id("it"),
        email,
        role,
        assignSeat,
        createdAt: now(),
        expiresAt: new Date(Date.now() + 7 * 86_400_000).toISOString(),
      };
      db.invites.push(inv);
      log(db, teamId, user.email, "invite.sent", email);
      const { teamId: _t, token: _k, ...view } = inv;
      void _t;
      void _k;
      created.push(view);
    }
    save(db);
    return { invites: created };
  },
  async cancelInvite(teamId, inviteId) {
    await wait();
    const db = load();
    const { user } = requireAdmin(db, teamId);
    const inv = db.invites.find((i) => i.id === inviteId);
    db.invites = db.invites.filter((i) => i.id !== inviteId);
    if (inv) log(db, teamId, user.email, "invite.cancelled", inv.email);
    save(db);
  },
  async resendInvite(teamId, inviteId) {
    await wait();
    const db = load();
    const { user } = requireAdmin(db, teamId);
    const inv = db.invites.find((i) => i.id === inviteId);
    if (inv) log(db, teamId, user.email, "invite.resent", inv.email);
    save(db);
  },
  async acceptInvite(token) {
    await wait();
    const db = load();
    const user = sessionUser(db);
    const inv = db.invites.find((i) => i.token === token);
    if (!inv) fail(400, "invalid_token", "This invitation is invalid or has expired.");
    const team = db.teams.find((t) => t.id === inv.teamId)!;
    const lic = inv.assignSeat ? issueKey(db, user, team) : null;
    db.members.push({
      teamId: team.id,
      userId: user.id,
      email: user.email,
      role: inv.role,
      seat: inv.assignSeat,
      licenseId: lic?.licenseId ?? null,
      joinedAt: now(),
    });
    db.invites = db.invites.filter((i) => i !== inv);
    save(db);
    return { team: teamView(db, team, user.id) };
  },
  async audit(teamId) {
    await wait(150);
    const db = load();
    requireAdmin(db, teamId);
    return { events: db.audit.filter((e) => e.teamId === teamId).map(({ teamId: _t, ...e }) => (void _t, e)), nextCursor: null };
  },
};
