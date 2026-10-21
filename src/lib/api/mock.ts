// In-browser stand-in for the backend, used when NEXT_PUBLIC_API_URL is not set.
// It follows docs/API.md in motionql-backend and keeps its data in localStorage, so the whole flow
// (register, verify, key, team admin) can be clicked through on a preview deploy.
// Keys it issues are clearly fake and will not activate the app.
import { ApiError } from "./client";
import type { Api } from "./index";
import type { Attribution } from "@/lib/attribution";
import type {
  AcquisitionReport,
  AcquisitionSource,
  AuditEvent,
  Invite,
  License,
  Me,
  Member,
  Release,
  Role,
  Team,
  TeamLicense,
  User,
} from "./types";

interface StoredUser extends User {
  password: string;
  referralCode?: string;
  referredBy?: string;
  heardFrom?: string;
  attribution?: Attribution;
  /** Someone a team admin added by email who has no account: a stand-in record that registering takes over. */
  external?: boolean;
}
interface StoredTeam {
  id: string;
  name: string;
  seatLimit: number;
  seatRequest?: Team["seatRequest"];
  createdAt: string;
}
interface StoredMember {
  teamId: string;
  userId: string;
  role: Role;
  licenseId: string | null;
  joinedAt: string;
  addedBy?: string;
}
interface StoredLicense extends License {
  userId: string;
}
interface DB {
  users: StoredUser[];
  session: string | null;
  licenses: StoredLicense[];
  teams: StoredTeam[];
  members: StoredMember[];
  invites: (Invite & { teamId: string; token: string })[];
  audit: (AuditEvent & { teamId: string })[];
  tokens: { token: string; userId: string; kind: "verify" | "reset" }[];
}

const KEY = "mq-mock-db-v2";
const DAY = 86_400_000;
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
const b64url = (s: string) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

function fail(status: number, code: string, message: string, fields?: Record<string, string>): never {
  throw new ApiError(status, code, message, fields);
}
function publicUser({ password: _pw, referralCode: _c, referredBy: _r, heardFrom: _h, external: _x, ...u }: StoredUser): User {
  void [_pw, _c, _r, _h, _x];
  return u;
}
const referralCode = () => Array.from({ length: 8 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");
const inviterFor = (db: DB, code: string | undefined) => (code ? db.users.find((u) => u.referralCode === code.trim().toUpperCase()) : undefined);
function sessionUser(db: DB): StoredUser {
  const u = db.users.find((x) => x.id === db.session);
  if (!u) fail(401, "unauthorized", "Please sign in.");
  return u;
}
function refreshStatus(l: StoredLicense) {
  if (l.status === "active" && new Date(l.expiresAt) < new Date()) l.status = "expired";
}
function strip({ userId: _u, ...l }: StoredLicense): License {
  void _u;
  return l;
}

function issueKey(db: DB, user: StoredUser, team: StoredTeam | null, expiresAt?: string): StoredLicense {
  const issuedAt = new Date();
  // Someone added by name only has no e-mail; like the backend, their key carries the admin's.
  const email = user.email || db.members.find((m) => m.userId === user.id && m.addedBy)?.addedBy || "";
  const payload = {
    licenseId: id("lic"),
    customer: team?.name ?? user.company ?? user.name,
    email,
    edition: "pro",
    seats: 1,
    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt ?? new Date(issuedAt.getTime() + 365 * DAY).toISOString(),
    features: [],
    demo: true,
  };
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
  const sig = Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * 64)]).join("");
  const lic: StoredLicense = {
    userId: user.id,
    licenseId: payload.licenseId,
    key: `MQL1.${b64url(JSON.stringify(payload))}.${sig}`,
    edition: "pro",
    features: [],
    customer: payload.customer,
    email,
    seats: 1,
    issuedAt: payload.issuedAt,
    expiresAt: payload.expiresAt,
    status: "active",
    source: team ? "team" : "free",
    revokedAt: null,
    team: team ? { id: team.id, name: team.name } : null,
  };
  db.licenses.push(lic);
  return lic;
}
function revoke(db: DB, licenseId: string | null, status: "revoked" | "replaced" = "revoked") {
  const l = db.licenses.find((x) => x.licenseId === licenseId);
  if (l && l.status === "active") {
    l.revokedAt = now();
    l.status = status;
  }
}

function teamView(db: DB, t: StoredTeam): Team {
  return {
    id: t.id,
    name: t.name,
    seatLimit: t.seatLimit,
    seatsUsed: db.members.filter((m) => m.teamId === t.id && m.licenseId).length,
    allowedEditions: ["pro"],
    allowedFeatures: [],
    seatRequest: t.seatRequest ?? null,
    createdAt: t.createdAt,
  };
}
function memberView(db: DB, m: StoredMember, withUsage: boolean): Member {
  const u = db.users.find((x) => x.id === m.userId)!;
  const lic = db.licenses.find((l) => l.licenseId === m.licenseId);
  // Sample teammates get made-up usage so the admin view has something to show.
  const sample = m.userId.startsWith("demo_") && lic;
  if (lic) refreshStatus(lic);
  return {
    // The mock keys members by account id; the backend's mem_… ids work the same way in every route.
    memberId: m.userId,
    ...(u.external ? {} : { userId: m.userId }),
    hasAccount: !u.external,
    ...(u.email ? { email: u.email } : {}),
    name: u.name,
    role: m.role,
    hasSeat: !!m.licenseId,
    edition: "pro",
    features: [],
    joinedAt: m.joinedAt,
    ...(withUsage && m.addedBy ? { addedBy: m.addedBy } : {}),
    ...(lic
      ? {
          license: {
            licenseId: lic.licenseId,
            ...(withUsage ? { key: lic.key } : {}),
            edition: lic.edition,
            features: lic.features,
            issuedAt: lic.issuedAt,
            expiresAt: lic.expiresAt,
            status: lic.status,
          },
        }
      : {}),
    ...(withUsage && sample
      ? {
          usage: {
            lastSeen: new Date(Date.now() - (1 + ((u.email || u.name).length % 5)) * DAY).toISOString(),
            appVersion: "1.0.0",
            platform: ["darwin-arm64", "win32-x64", "linux-x64"][(u.email || u.name).length % 3],
            installs: 1 + ((u.email || u.name).length % 2),
          },
        }
      : {}),
  };
}
function access(db: DB, teamId: string, need: "member" | "admin" | "owner" = "member") {
  const user = sessionUser(db);
  const team = db.teams.find((t) => t.id === teamId);
  const me = team && db.members.find((m) => m.teamId === teamId && m.userId === user.id);
  if (!team || !me) fail(404, "not_found", "Team not found.");
  if (need === "admin" && me.role === "member") fail(403, "forbidden", "Only team admins can do that.");
  if (need === "owner" && me.role !== "owner") fail(403, "forbidden", "Only the team owner can do that.");
  return { user, team, me };
}
function log(db: DB, teamId: string, actor: StoredUser, action: string, target: AuditEvent["target"], details: Record<string, unknown> = {}) {
  db.audit.unshift({ id: id("evt"), teamId, at: now(), actor: { id: actor.id, email: actor.email }, action, target, details });
}
function findMember(db: DB, teamId: string, userId: string) {
  const m = db.members.find((x) => x.teamId === teamId && x.userId === userId);
  if (!m) fail(404, "not_found", "Member not found.");
  return m;
}
const userTarget = (db: DB, userId: string) => {
  const u = db.users.find((x) => x.id === userId);
  return { type: "user", id: userId, email: u?.email };
};
function seat(db: DB, team: StoredTeam, m: StoredMember) {
  if (db.members.filter((x) => x.teamId === team.id && x.licenseId).length >= team.seatLimit) fail(409, "seat_limit_reached", "Every seat of the team is in use.");
  const lic = issueKey(db, db.users.find((u) => u.id === m.userId)!, team);
  m.licenseId = lic.licenseId;
  return lic;
}

const RELEASE: Release = {
  version: "1.0.0",
  publishedAt: "2026-10-01T00:00:00.000Z",
  releaseNotesUrl: "/changelog",
  files: [
    ["MotionQL-1.0.0-arm64.dmg", "macos", "arm64", "dmg", 148_897_792],
    ["MotionQL-1.0.0-x64.dmg", "macos", "x64", "dmg", 154_140_672],
    ["MotionQL-Setup-1.0.0.exe", "windows", "x64", "exe", 112_197_632],
    ["MotionQL-1.0.0-x64.msi", "windows", "x64", "msi", 118_489_088],
    ["MotionQL-1.0.0-x86_64.AppImage", "linux", "x64", "appimage", 160_432_128],
    ["motionql_1.0.0_amd64.deb", "linux", "x64", "deb", 104_857_600],
    ["motionql-1.0.0.x86_64.rpm", "linux", "x64", "rpm", 105_906_176],
  ].map(([name, os, arch, kind, size]) => ({
    name,
    os,
    arch,
    kind,
    size,
    url: "https://github.com/davidshoval/motionql-releases/releases/latest",
  })) as Release["files"],
};

export const mockApi: Api = {
  async register({ email, password, name, company, referralCode: code, heardFrom, attribution }) {
    await wait();
    const db = load();
    const e = email.trim().toLowerCase();
    if (db.users.some((u) => u.email === e && !u.external)) fail(409, "email_taken", "An account with this e-mail already exists.", { email: "Already registered. Sign in instead." });
    // A team admin added this address before it had an account: the new account takes over that record, seat and key.
    const stand = db.users.find((u) => u.email === e && u.external);
    if (stand) db.users = db.users.filter((u) => u !== stand);
    const user: StoredUser = {
      id: stand?.id ?? id("usr"),
      email: e,
      name,
      company: company || null,
      emailVerified: false,
      isStaff: false,
      createdAt: now(),
      password,
      referralCode: referralCode(),
      referredBy: inviterFor(db, code)?.id,
      heardFrom: heardFrom || undefined,
      attribution,
    };
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
    if (!db.licenses.some((l) => l.userId === user.id && l.source === "free")) issueKey(db, user, null);
    db.session = user.id;
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
    if (!user || user.password !== password) fail(401, "unauthorized", "That e-mail and password don't match.");
    if (!user.emailVerified) fail(403, "email_not_verified", "Confirm your e-mail first. We sent you a link.");
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
  async changePassword(currentPassword, newPassword) {
    await wait();
    const db = load();
    const user = sessionUser(db);
    if (user.password !== currentPassword) fail(400, "validation_failed", "Some fields are not valid.", { currentPassword: "That's not your current password." });
    user.password = newPassword;
    save(db);
  },

  async me(): Promise<Me> {
    await wait(120);
    const db = load();
    const user = sessionUser(db);
    const teams = db.members
      .filter((m) => m.userId === user.id)
      .flatMap((m) => {
        const t = db.teams.find((x) => x.id === m.teamId);
        return t ? [{ id: t.id, name: t.name, role: m.role, hasSeat: !!m.licenseId }] : [];
      });
    const pendingInvites = db.invites
      .filter((i) => i.email === user.email)
      .map((i) => ({ id: i.id, teamName: db.teams.find((t) => t.id === i.teamId)?.name ?? "", role: i.role, invitedBy: i.invitedBy }));
    return { user: publicUser(user), teams, pendingInvites };
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
  async deleteMe(password) {
    await wait();
    const db = load();
    const user = sessionUser(db);
    if (user.password !== password) fail(400, "validation_failed", "Some fields are not valid.", { password: "That's not your password." });
    const owned = db.members.filter((m) => m.userId === user.id && m.role === "owner");
    if (owned.some((o) => db.members.some((m) => m.teamId === o.teamId && m.userId !== user.id)))
      fail(409, "owns_team", "Transfer or delete the teams you own before deleting your account.");
    for (const l of db.licenses.filter((x) => x.userId === user.id)) revoke(db, l.licenseId);
    db.users = db.users.filter((u) => u.id !== user.id);
    db.members = db.members.filter((m) => m.userId !== user.id);
    db.session = null;
    save(db);
  },
  async myLicenses() {
    await wait(150);
    const db = load();
    const user = sessionUser(db);
    db.licenses.forEach(refreshStatus);
    return { licenses: db.licenses.filter((l) => l.userId === user.id).map(strip).reverse() };
  },
  // The mock has the reward switched off, like the backend's default.
  async referral() {
    await wait(150);
    const db = load();
    const user = sessionUser(db);
    user.referralCode ??= referralCode();
    save(db);
    const invited = db.users.filter((u) => u.referredBy === user.id);
    return {
      code: user.referralCode,
      url: `${window.location.origin}/r/${user.referralCode}`,
      signups: invited.length,
      confirmed: invited.filter((u) => u.emailVerified).length,
      rewarded: 0,
      reward: null,
    };
  },
  async referralPreview(code) {
    await wait(150);
    const inviter = inviterFor(load(), code);
    if (!inviter) fail(404, "not_found", "This invite link is not valid.");
    return { code: inviter.referralCode!, inviterName: inviter.name.trim().split(/\s+/)[0] ?? "", reward: null };
  },
  async renewLicense() {
    await wait();
    const db = load();
    const user = sessionUser(db);
    const current = db.licenses.filter((l) => l.userId === user.id && l.source === "free" && l.status === "active");
    if (current.some((l) => new Date(l.expiresAt).getTime() - Date.now() > 30 * DAY))
      fail(409, "not_renewable", "You can renew from 30 days before your key expires.");
    const lic = issueKey(db, user, null);
    save(db);
    return { license: strip(lic) };
  },
  async reissueLicense(licenseId) {
    await wait();
    const db = load();
    const user = sessionUser(db);
    const old = db.licenses.find((l) => l.licenseId === licenseId && l.userId === user.id && l.source === "free");
    if (!old) fail(404, "not_found", "License not found.");
    revoke(db, licenseId, "replaced");
    const lic = issueKey(db, user, null, old.expiresAt);
    save(db);
    return { license: strip(lic) };
  },

  async latestRelease() {
    await wait(100);
    return RELEASE;
  },
  async freePlan() {
    return { enabled: true, edition: "pro", features: [], durationDays: 365, renewable: true };
  },

  async createTeam(name) {
    await wait();
    const db = load();
    const user = sessionUser(db);
    const team: StoredTeam = { id: id("team"), name, seatLimit: 25, createdAt: now() };
    db.teams.push(team);
    const owner: StoredMember = { teamId: team.id, userId: user.id, role: "owner", licenseId: null, joinedAt: now() };
    db.members.push(owner);
    seat(db, team, owner);
    // A few sample teammates so the admin screens have something to show on a preview deploy.
    const domain = user.email.split("@")[1] ?? "example.com";
    for (const [n, role, withSeat, external] of [
      ["maya.cohen", "admin", true, false],
      ["jordan.lee", "member", true, false],
      ["sam.patel", "member", false, false],
      ["alex.kim", "member", true, true],
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
        isStaff: false,
        createdAt: now(),
        password: "",
        ...(external ? { external: true, emailVerified: false } : {}),
      };
      db.users.push(sample);
      const m: StoredMember = {
        teamId: team.id,
        userId: sample.id,
        role,
        licenseId: null,
        joinedAt: now(),
        ...(external ? { addedBy: user.email } : {}),
      };
      db.members.push(m);
      if (withSeat) {
        const lic = seat(db, team, m);
        // One key close to its end, so the expiry warnings and "Renew" have something to show.
        if (n === "jordan.lee") lic.expiresAt = new Date(Date.now() + 12 * DAY).toISOString();
      }
    }
    log(db, team.id, user, "team.create", { type: "team", id: team.id, name });
    save(db);
    return { team: teamView(db, team) };
  },
  async team(teamId) {
    await wait(120);
    const db = load();
    const { team, me } = access(db, teamId);
    return { team: teamView(db, team), role: me.role };
  },
  async renameTeam(teamId, name) {
    await wait();
    const db = load();
    const { user, team } = access(db, teamId, "admin");
    log(db, teamId, user, "team.rename", { type: "team", id: team.id, name }, { from: team.name });
    team.name = name;
    save(db);
    return { team: teamView(db, team) };
  },
  async deleteTeam(teamId) {
    await wait();
    const db = load();
    access(db, teamId, "owner");
    for (const m of db.members.filter((x) => x.teamId === teamId)) revoke(db, m.licenseId);
    db.members = db.members.filter((m) => m.teamId !== teamId);
    db.invites = db.invites.filter((i) => i.teamId !== teamId);
    db.teams = db.teams.filter((t) => t.id !== teamId);
    save(db);
  },
  async transferOwnership(teamId, userId) {
    await wait();
    const db = load();
    const { user, me } = access(db, teamId, "owner");
    const m = findMember(db, teamId, userId);
    m.role = "owner";
    me.role = "admin";
    log(db, teamId, user, "team.transfer_ownership", userTarget(db, userId));
    save(db);
  },
  async members(teamId) {
    await wait(150);
    const db = load();
    const { me } = access(db, teamId);
    return { members: db.members.filter((m) => m.teamId === teamId).map((m) => memberView(db, m, me.role !== "member")) };
  },
  async updateMember(teamId, userId, patch) {
    await wait();
    const db = load();
    const { user } = access(db, teamId, patch.role ? "owner" : "admin");
    const m = findMember(db, teamId, userId);
    if (patch.name !== undefined || patch.email !== undefined) {
      const u = db.users.find((x) => x.id === m.userId)!;
      const email = patch.email === undefined ? u.email : (patch.email ?? "").trim().toLowerCase();
      const name = patch.name === undefined ? u.name : patch.name.trim();
      if (email !== u.email && !u.external) fail(400, "has_account", `${u.email} has a MotionQL account; their e-mail comes from it.`);
      if (!email && !name) fail(400, "validation_failed", "Give a name or an e-mail.", { name: "Enter a name or an e-mail." });
      if (email && email !== u.email && db.members.some((x) => x.teamId === teamId && db.users.find((y) => y.id === x.userId)?.email === email))
        fail(409, "already_member", `${email} is already on this team.`);
      const emailChanged = email !== u.email;
      u.email = email;
      u.name = name;
      log(db, teamId, user, "team.member.contact", userTarget(db, userId), { email: email || null, name: name || null });
      if (emailChanged && m.licenseId) {
        const old = db.licenses.find((l) => l.licenseId === m.licenseId)!;
        revoke(db, old.licenseId, "replaced");
        m.licenseId = issueKey(db, u, db.teams.find((t) => t.id === teamId)!, old.expiresAt).licenseId;
      }
    }
    if (patch.role && m.role === "owner") fail(400, "validation_failed", "Use transfer ownership to change the owner.");
    if (patch.role) {
      m.role = patch.role;
      log(db, teamId, user, "team.member.role", userTarget(db, userId), { role: patch.role });
    }
    save(db);
    return { member: memberView(db, m, true) };
  },
  async removeMember(teamId, userId) {
    await wait();
    const db = load();
    const user = sessionUser(db);
    const self = userId === user.id;
    access(db, teamId, self ? "member" : "admin");
    const m = findMember(db, teamId, userId);
    if (m.role === "owner") fail(400, "validation_failed", "The owner can't leave or be removed. Transfer ownership first.");
    revoke(db, m.licenseId);
    db.members = db.members.filter((x) => x !== m);
    log(db, teamId, user, "team.member.remove", userTarget(db, userId));
    save(db);
  },
  async assignSeat(teamId, userId) {
    await wait();
    const db = load();
    const { user, team } = access(db, teamId, "admin");
    const m = findMember(db, teamId, userId);
    const lic = m.licenseId ? db.licenses.find((l) => l.licenseId === m.licenseId)! : seat(db, team, m);
    log(db, teamId, user, "team.seat.assign", userTarget(db, userId));
    save(db);
    return { license: strip(lic) };
  },
  async freeSeat(teamId, userId) {
    await wait();
    const db = load();
    const { user } = access(db, teamId, "admin");
    const m = findMember(db, teamId, userId);
    revoke(db, m.licenseId);
    m.licenseId = null;
    log(db, teamId, user, "team.seat.free", userTarget(db, userId));
    save(db);
  },
  async reissueMemberKey(teamId, userId) {
    await wait();
    const db = load();
    const { user, team } = access(db, teamId, "admin");
    const m = findMember(db, teamId, userId);
    const old = db.licenses.find((l) => l.licenseId === m.licenseId);
    if (!old) fail(409, "validation_failed", "Assign a seat first.");
    revoke(db, old.licenseId, "replaced");
    const lic = issueKey(db, db.users.find((u) => u.id === m.userId)!, team, old.expiresAt);
    m.licenseId = lic.licenseId;
    log(db, teamId, user, "license.issue", userTarget(db, userId), { reason: "reissue" });
    save(db);
    return { license: strip(lic) };
  },
  async addMembers(teamId, { members, role, assignSeat, sendEmail }) {
    await wait();
    const db = load();
    const { user, team, me } = access(db, teamId, "admin");
    if (role === "admin" && me.role !== "owner") fail(403, "forbidden", "Only the team owner can add admins.");
    const emailOf = (m: StoredMember) => db.users.find((u) => u.id === m.userId)?.email;
    const people: [string, string | undefined][] = [];
    for (const p of members) {
      const email = p.email?.trim().toLowerCase() ?? "";
      const name = p.name?.trim() || undefined;
      if (!email && !name) fail(400, "validation_failed", "Give each person a name or an e-mail.");
      if (email && people.some(([e]) => e === email)) continue;
      people.push([email, name]);
    }
    const skipped = people
      .filter(([e]) => e && db.members.some((m) => m.teamId === teamId && emailOf(m) === e))
      .map(([email]) => ({ email, reason: "already_member" }));
    const fresh = people.filter(([e]) => !e || !skipped.some((s) => s.email === e));
    const free = team.seatLimit - teamView(db, team).seatsUsed;
    if (assignSeat && fresh.length > free)
      fail(
        409,
        "seat_limit_reached",
        `You are adding ${fresh.length} people but ${free <= 0 ? "no seats are" : `only ${free} seat${free === 1 ? " is" : "s are"}`} free. Free some seats or ask us for more.`,
      );
    const added: Member[] = [];
    for (const [email, name] of fresh) {
      let account = email ? db.users.find((u) => u.email === email) : undefined;
      if (!account) {
        account = {
          id: id("ext"),
          email,
          name: name ?? "",
          company: null,
          emailVerified: false,
          isStaff: false,
          createdAt: now(),
          password: "",
          external: true,
        };
        db.users.push(account);
      }
      const m: StoredMember = { teamId, userId: account.id, role, licenseId: null, joinedAt: now(), addedBy: user.email };
      db.members.push(m);
      if (email) db.invites = db.invites.filter((i) => !(i.teamId === teamId && i.email === email));
      log(db, teamId, user, "team.member.add", { type: "user", id: account.id, ...(email ? { email } : { name }) });
      if (assignSeat) {
        seat(db, team, m);
        log(db, teamId, user, "team.seat.assign", { type: "user", id: account.id, ...(email ? { email } : { name }) });
      }
      added.push(memberView(db, m, true));
    }
    void sendEmail; // Preview mode sends no e-mail either way.
    save(db);
    return { members: added, skipped, team: teamView(db, team) };
  },
  async renewMemberKey(teamId, memberId) {
    await wait();
    const db = load();
    const { user, team } = access(db, teamId, "admin");
    const m = findMember(db, teamId, memberId);
    const old = db.licenses.find((l) => l.licenseId === m.licenseId);
    if (!old) fail(409, "no_seat", "Assign a seat first.");
    revoke(db, old.licenseId, "replaced");
    const lic = issueKey(
      db,
      db.users.find((u) => u.id === m.userId)!,
      team,
    );
    m.licenseId = lic.licenseId;
    log(db, teamId, user, "team.seat.renew", userTarget(db, memberId), { to: lic.expiresAt });
    save(db);
    return { license: strip(lic) };
  },
  async sendMemberKey(teamId, memberId) {
    await wait();
    const db = load();
    const { user } = access(db, teamId, "admin");
    const m = findMember(db, teamId, memberId);
    if (!m.licenseId) fail(409, "no_seat", "Assign a seat first.");
    const u = db.users.find((x) => x.id === m.userId)!;
    if (!u.email) fail(400, "no_email", `Add an e-mail for ${u.name} to send them their key.`);
    log(db, teamId, user, "team.key.send", userTarget(db, memberId));
    save(db);
  },
  async reassignSeat(teamId, memberId, to) {
    const db = load();
    const { user } = access(db, teamId, "admin");
    const from = findMember(db, teamId, memberId);
    if (!from.licenseId) fail(409, "no_seat", "They have no seat to give away.");
    const email = to.email?.trim().toLowerCase() ?? "";
    if (!email && !to.name?.trim()) fail(400, "validation_failed", "Give a name or an e-mail.");
    if (email && userTarget(db, memberId).email === email) fail(400, "same_member", "Pick someone else to give the seat to.");
    const existing = email ? db.members.find((m) => m.teamId === teamId && db.users.find((u) => u.id === m.userId)?.email === email) : undefined;
    if (existing?.licenseId) fail(409, "already_has_seat", `${email} already has a seat.`);
    revoke(db, from.licenseId);
    from.licenseId = null;
    log(db, teamId, user, "team.seat.reassign", userTarget(db, memberId), { to: email || to.name });
    save(db);
    if (existing) {
      await mockApi.assignSeat(teamId, existing.userId);
      const after = load();
      return {
        member: memberView(
          after,
          after.members.find((m) => m.teamId === teamId && m.userId === existing.userId)!,
          true,
        ),
      };
    }
    const { members } = await mockApi.addMembers(teamId, {
      members: [{ ...(email ? { email } : {}), name: to.name }],
      role: "member",
      assignSeat: true,
      sendEmail: to.sendEmail,
    });
    return { member: members[0] };
  },
  async teamLicenses(teamId) {
    await wait(150);
    const db = load();
    access(db, teamId, "admin");
    const current = new Set(db.members.filter((m) => m.teamId === teamId).map((m) => m.licenseId));
    const licenses: TeamLicense[] = db.licenses
      .filter((l) => l.team?.id === teamId)
      .map((l) => {
        refreshStatus(l);
        const holder = db.users.find((u) => u.id === l.userId);
        const { key, team: _t, userId: _u, ...rest } = l;
        void _t;
        void _u;
        return {
          ...rest,
          ...(l.status === "active" ? { key } : {}),
          current: current.has(l.licenseId),
          assignee: { ...(holder ? { memberId: holder.id } : {}), email: holder ? holder.email : l.email, name: holder?.name ?? "" },
          ...(l.status === "revoked" ? { revokeReason: "seat freed" } : {}),
        };
      })
      .reverse();
    return { licenses };
  },
  licensesCsvUrl: () => null,
  async requestSeats(teamId, { seats, note }) {
    await wait();
    const db = load();
    const { user, team } = access(db, teamId, "admin");
    if (seats <= team.seatLimit) fail(400, "validation_failed", `The team already has ${team.seatLimit} seats.`, { seats: `Ask for more than ${team.seatLimit}.` });
    team.seatRequest = { seats, note: note?.trim() || null, by: user.email, at: now() };
    log(db, teamId, user, "team.seat.request", { type: "team", id: teamId }, { to: seats });
    save(db);
    return { team: teamView(db, team) };
  },
  async renewExpiring(teamId, { withinDays }) {
    const db = load();
    access(db, teamId, "admin");
    const cutoff = Date.now() + withinDays * DAY;
    const due = db.members.filter(
      (m) => m.teamId === teamId && db.licenses.some((l) => l.licenseId === m.licenseId && new Date(l.expiresAt).getTime() <= cutoff),
    );
    for (const m of due) await mockApi.renewMemberKey(teamId, m.userId);
    return { renewed: due.length };
  },
  async invites(teamId) {
    await wait(150);
    const db = load();
    access(db, teamId, "admin");
    return { invites: db.invites.filter((i) => i.teamId === teamId).map(({ teamId: _t, token: _k, ...i }) => (void _t, void _k, i)) };
  },
  async invite(teamId, { emails, role, assignSeat }) {
    await wait();
    const db = load();
    const { user } = access(db, teamId, "admin");
    const invites: Invite[] = [];
    const skipped: { email: string; reason: string }[] = [];
    for (const raw of emails) {
      const email = raw.trim().toLowerCase();
      if (db.invites.some((i) => i.teamId === teamId && i.email === email)) {
        skipped.push({ email, reason: "already_invited" });
        continue;
      }
      if (db.members.some((m) => m.teamId === teamId && db.users.find((u) => u.id === m.userId)?.email === email)) {
        skipped.push({ email, reason: "already_member" });
        continue;
      }
      const inv = { id: id("inv"), teamId, token: id("it"), email, role, assignSeat, invitedBy: user.email, createdAt: now(), expiresAt: new Date(Date.now() + 14 * DAY).toISOString() };
      db.invites.push(inv);
      log(db, teamId, user, "team.invite.create", { type: "invite", id: inv.id, email });
      const { teamId: _t, token: _k, ...view } = inv;
      void _t;
      void _k;
      invites.push(view);
    }
    save(db);
    return { invites, skipped };
  },
  async cancelInvite(teamId, inviteId) {
    await wait();
    const db = load();
    const { user } = access(db, teamId, "admin");
    const inv = db.invites.find((i) => i.id === inviteId);
    db.invites = db.invites.filter((i) => i.id !== inviteId);
    if (inv) log(db, teamId, user, "team.invite.cancel", { type: "invite", id: inv.id, email: inv.email });
    save(db);
  },
  async resendInvite(teamId, inviteId) {
    await wait();
    const db = load();
    const { user } = access(db, teamId, "admin");
    const inv = db.invites.find((i) => i.id === inviteId);
    if (inv) log(db, teamId, user, "team.invite.resend", { type: "invite", id: inv.id, email: inv.email });
    save(db);
  },
  async previewInvite(token) {
    await wait(150);
    const db = load();
    const inv = db.invites.find((i) => i.token === token);
    if (!inv) fail(400, "invalid_token", "This invitation is invalid or has expired.");
    return { teamName: db.teams.find((t) => t.id === inv.teamId)?.name ?? "", email: inv.email, role: inv.role, invitedBy: inv.invitedBy, assignSeat: inv.assignSeat };
  },
  async acceptInvite(token) {
    await wait();
    const db = load();
    const user = sessionUser(db);
    const inv = db.invites.find((i) => i.token === token);
    if (!inv) fail(400, "invalid_token", "This invitation is invalid or has expired.");
    if (inv.email !== user.email) fail(403, "invite_email_mismatch", `This invitation was sent to ${inv.email}. Sign in with that e-mail to accept it.`);
    const team = db.teams.find((t) => t.id === inv.teamId)!;
    const m: StoredMember = { teamId: team.id, userId: user.id, role: inv.role, licenseId: null, joinedAt: now() };
    db.members.push(m);
    let seatAssigned = false;
    if (inv.assignSeat) {
      try {
        seat(db, team, m);
        seatAssigned = true;
      } catch {
        /* team is full: join without a seat */
      }
    }
    db.invites = db.invites.filter((i) => i !== inv);
    log(db, team.id, user, "team.invite.accept", userTarget(db, user.id), { role: inv.role });
    save(db);
    return { team: teamView(db, team), seatAssigned };
  },
  async audit(teamId) {
    await wait(150);
    const db = load();
    access(db, teamId, "admin");
    return { events: db.audit.filter((e) => e.teamId === teamId).map(({ teamId: _t, ...e }) => (void _t, e)), nextCursor: null };
  },
  auditCsvUrl: () => null,

  // A rough version of the backend report; the backend has the full personal-mailbox list and activation data.
  async acquisition({ from, to }) {
    await wait(150);
    const db = load();
    const user = sessionUser(db);
    if (!user.isStaff) fail(403, "forbidden", "Staff only.");
    const inRange = db.users.filter((u) => (!from || u.createdAt >= from) && (!to || u.createdAt < to));
    const personal = /^(gmail|googlemail|outlook|hotmail|yahoo|icloud|proton|protonmail|aol|gmx|live|me|yandex|mail|qq|163)\./;
    const domainOf = (e: string) => e.slice(e.lastIndexOf("@") + 1);
    const size = (d: string) => db.users.filter((u) => domainOf(u.email) === d).length;
    const groups = new Map<string | null, typeof inRange>();
    for (const u of inRange) {
      const k = u.attribution?.utmSource?.toLowerCase() || null;
      groups.set(k, [...(groups.get(k) ?? []), u]);
    }
    const companiesOf = (list: typeof inRange) => [...new Set(list.map((u) => domainOf(u.email)).filter((d) => !personal.test(d)))];
    const sources: AcquisitionSource[] = [...groups.entries()]
      .map(([utmSource, list]) => {
        const companies = companiesOf(list);
        return {
          utmSource,
          signups: list.length,
          confirmed: list.filter((u) => u.emailVerified).length,
          companies: companies.length,
          companies2Plus: companies.filter((d) => size(d) >= 2).length,
          companies3Plus: companies.filter((d) => size(d) >= 3).length,
          activated: 0,
        };
      })
      .sort((a, b) => b.signups - a.signups);
    const report: AcquisitionReport = {
      from: from ? new Date(from).toISOString() : null,
      to: to ? new Date(to).toISOString() : null,
      totals: { signups: inRange.length, confirmed: inRange.filter((u) => u.emailVerified).length, companies: companiesOf(inRange).length, activated: 0 },
      sources,
    };
    return report;
  },
  // Staff console: in preview mode the signed-in user counts as staff when their account says so.
  async adminTeams(q) {
    await wait(150);
    const db = load();
    if (!sessionUser(db).isStaff) fail(403, "forbidden", "Staff only.");
    const s = q?.trim().toLowerCase();
    const teams = db.teams.filter((t) => !s || t.id === q || t.name.toLowerCase().includes(s)).map((t) => teamView(db, t));
    return { teams: teams.sort((a, b) => Number(!!b.seatRequest) - Number(!!a.seatRequest)) };
  },
  async updateTeamLimits(teamId, { seatLimit }) {
    await wait();
    const db = load();
    if (!sessionUser(db).isStaff) fail(403, "forbidden", "Staff only.");
    const team = db.teams.find((t) => t.id === teamId);
    if (!team) fail(404, "not_found", "Team not found.");
    if (seatLimit < teamView(db, team).seatsUsed) fail(409, "seat_limit_below_used", "Free some seats before lowering the limit.");
    team.seatLimit = seatLimit;
    if (team.seatRequest && seatLimit >= team.seatRequest.seats) team.seatRequest = null;
    save(db);
    return { team: teamView(db, team) };
  },
};

/** Preview mode only: the invite link the backend would have e-mailed, so it can be opened by hand. */
export function mockInviteLink(inviteId: string) {
  const inv = load().invites.find((i) => i.id === inviteId);
  return inv ? `/invite?token=${encodeURIComponent(inv.token)}` : null;
}
