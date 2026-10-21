import { API_URL, http, USE_MOCK } from "./client";
import { mockApi } from "./mock";
import type { Attribution } from "@/lib/attribution";
import type {
  AcquisitionReport,
  AuditEvent,
  FreePlan,
  Invite,
  InvitePreview,
  License,
  Me,
  Member,
  NewMember,
  Referral,
  ReferralPreview,
  Release,
  Role,
  Team,
  TeamLicense,
  User,
} from "./types";

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  company?: string;
  /** Code from an invite link (/r/CODE). */
  referralCode?: string;
  /** "How did you hear about us?" */
  heardFrom?: string;
  /** First-touch utm_* tags, landing path and referring host (lib/attribution.ts). */
  attribution?: Attribution;
}

/** Every call the website makes to the backend (docs/API.md in motionql-backend). The mock implements the same interface. */
export interface Api {
  register(input: RegisterInput): Promise<{ user: User; devVerifyToken?: string }>;
  verifyEmail(token: string): Promise<{ user: User }>;
  resendVerification(email: string): Promise<void>;
  login(email: string, password: string): Promise<{ user: User }>;
  logout(): Promise<void>;
  requestPasswordReset(email: string): Promise<{ devResetToken?: string } | void>;
  confirmPasswordReset(token: string, password: string): Promise<void>;
  changePassword(currentPassword: string, newPassword: string): Promise<void>;

  me(): Promise<Me>;
  updateMe(patch: { name?: string; company?: string | null }): Promise<{ user: User }>;
  deleteMe(password: string): Promise<void>;
  myLicenses(): Promise<{ licenses: License[] }>;
  renewLicense(): Promise<{ license: License }>;
  reissueLicense(licenseId: string): Promise<{ license: License }>;
  referral(): Promise<Referral>;
  referralPreview(code: string): Promise<ReferralPreview>;

  latestRelease(): Promise<Release>;
  freePlan(): Promise<FreePlan>;

  createTeam(name: string): Promise<{ team: Team }>;
  team(id: string): Promise<{ team: Team; role: Role }>;
  renameTeam(id: string, name: string): Promise<{ team: Team }>;
  deleteTeam(id: string): Promise<void>;
  transferOwnership(id: string, userId: string): Promise<void>;
  members(teamId: string): Promise<{ members: Member[] }>;
  // Member routes take a member id (mem_…) or an account id.
  /** Adds people directly: each gets a seat and a key at once, no invitation to accept. */
  addMembers(
    teamId: string,
    input: { members: NewMember[]; role: "admin" | "member"; assignSeat: boolean; sendEmail: boolean },
  ): Promise<{ members: Member[]; skipped: { email: string; reason: string }[]; team: Team }>;
  updateMember(teamId: string, memberId: string, patch: { role?: "admin" | "member" }): Promise<unknown>;
  removeMember(teamId: string, memberId: string): Promise<void>;
  assignSeat(teamId: string, memberId: string): Promise<{ license: License }>;
  freeSeat(teamId: string, memberId: string): Promise<void>;
  reissueMemberKey(teamId: string, memberId: string): Promise<{ license: License }>;
  /** A new key for a full term from today; the old one stops working. */
  renewMemberKey(teamId: string, memberId: string): Promise<{ license: License }>;
  sendMemberKey(teamId: string, memberId: string): Promise<void>;
  /** Moves the seat to someone else (added to the team if new); the old holder's key is revoked. */
  reassignSeat(teamId: string, memberId: string, to: NewMember & { sendEmail: boolean }): Promise<{ member: Member }>;
  teamLicenses(teamId: string): Promise<{ licenses: TeamLicense[] }>;
  /** URL of the CSV of current keys, or null when the export happens in the browser (mock). */
  licensesCsvUrl(teamId: string): string | null;
  renewExpiring(teamId: string, input: { withinDays: number; sendEmail: boolean }): Promise<{ renewed: number }>;
  invites(teamId: string): Promise<{ invites: Invite[] }>;
  invite(
    teamId: string,
    input: { emails: string[]; role: Role; assignSeat: boolean },
  ): Promise<{ invites: Invite[]; skipped: { email: string; reason: string }[] }>;
  cancelInvite(teamId: string, inviteId: string): Promise<void>;
  resendInvite(teamId: string, inviteId: string): Promise<void>;
  previewInvite(token: string): Promise<InvitePreview>;
  acceptInvite(token: string): Promise<{ team: Team; seatAssigned: boolean }>;
  audit(teamId: string, before?: string): Promise<{ events: AuditEvent[]; nextCursor: string | null }>;
  /** URL of the CSV export, or null when the export happens in the browser (mock). */
  auditCsvUrl(teamId: string): string | null;

  /** Staff only: sign-ups per first-touch utm_source. `from` inclusive, `to` exclusive (YYYY-MM-DD). */
  acquisition(range: { from?: string; to?: string }): Promise<AcquisitionReport>;
}

const enc = encodeURIComponent;

const httpApi: Api = {
  register: (input) => http("POST", "/auth/register", input),
  verifyEmail: (token) => http("POST", "/auth/verify-email", { token }),
  resendVerification: (email) => http("POST", "/auth/resend-verification", { email }),
  login: (email, password) => http("POST", "/auth/login", { email, password }),
  logout: () => http("POST", "/auth/logout"),
  requestPasswordReset: (email) => http("POST", "/auth/password-reset/request", { email }),
  confirmPasswordReset: (token, password) => http("POST", "/auth/password-reset/confirm", { token, password }),
  changePassword: (currentPassword, newPassword) => http("POST", "/auth/change-password", { currentPassword, newPassword }),

  me: () => http("GET", "/me"),
  updateMe: (patch) => http("PATCH", "/me", patch),
  deleteMe: (password) => http("DELETE", "/me", { password }),
  myLicenses: () => http("GET", "/me/licenses"),
  renewLicense: () => http("POST", "/me/licenses/renew"),
  reissueLicense: (id) => http("POST", `/me/licenses/${enc(id)}/reissue`),
  referral: () => http("GET", "/me/referral"),
  referralPreview: (code) => http("GET", `/referrals/${enc(code)}`),

  latestRelease: () => http("GET", "/downloads/latest"),
  freePlan: () => http("GET", "/plans/free"),

  createTeam: (name) => http("POST", "/teams", { name }),
  team: (id) => http("GET", `/teams/${enc(id)}`),
  renameTeam: (id, name) => http("PATCH", `/teams/${enc(id)}`, { name }),
  deleteTeam: (id) => http("DELETE", `/teams/${enc(id)}`),
  transferOwnership: (id, userId) => http("POST", `/teams/${enc(id)}/transfer-ownership`, { userId }),
  members: (id) => http("GET", `/teams/${enc(id)}/members`),
  addMembers: (id, input) => http("POST", `/teams/${enc(id)}/members`, input),
  updateMember: (id, memberId, patch) => http("PATCH", `/teams/${enc(id)}/members/${enc(memberId)}`, patch),
  removeMember: (id, memberId) => http("DELETE", `/teams/${enc(id)}/members/${enc(memberId)}`),
  assignSeat: (id, memberId) => http("POST", `/teams/${enc(id)}/seats/${enc(memberId)}`),
  freeSeat: (id, memberId) => http("DELETE", `/teams/${enc(id)}/seats/${enc(memberId)}`),
  reissueMemberKey: (id, memberId) => http("POST", `/teams/${enc(id)}/members/${enc(memberId)}/reissue`),
  renewMemberKey: (id, memberId) => http("POST", `/teams/${enc(id)}/members/${enc(memberId)}/renew`),
  sendMemberKey: (id, memberId) => http("POST", `/teams/${enc(id)}/members/${enc(memberId)}/send-key`),
  reassignSeat: (id, memberId, to) => http("POST", `/teams/${enc(id)}/members/${enc(memberId)}/reassign`, to),
  teamLicenses: (id) => http("GET", `/teams/${enc(id)}/licenses`),
  licensesCsvUrl: (id) => `${API_URL}/teams/${enc(id)}/licenses.csv`,
  renewExpiring: (id, input) => http("POST", `/teams/${enc(id)}/licenses/renew-expiring`, input),
  invites: (id) => http("GET", `/teams/${enc(id)}/invites`),
  invite: (id, input) => http("POST", `/teams/${enc(id)}/invites`, input),
  cancelInvite: (id, inviteId) => http("DELETE", `/teams/${enc(id)}/invites/${enc(inviteId)}`),
  resendInvite: (id, inviteId) => http("POST", `/teams/${enc(id)}/invites/${enc(inviteId)}/resend`),
  previewInvite: (token) => http("POST", "/invites/preview", { token }),
  acceptInvite: (token) => http("POST", "/invites/accept", { token }),
  audit: (id, before) => http("GET", `/teams/${enc(id)}/audit${before ? `?before=${enc(before)}` : ""}`),
  auditCsvUrl: (id) => `${API_URL}/teams/${enc(id)}/audit.csv`,

  acquisition: ({ from, to }) => {
    const q = new URLSearchParams({ ...(from ? { from } : {}), ...(to ? { to } : {}) }).toString();
    return http("GET", `/admin/acquisition${q ? `?${q}` : ""}`);
  },
};

export const api: Api = USE_MOCK ? mockApi : httpApi;
export { ApiError, USE_MOCK } from "./client";
export type * from "./types";
