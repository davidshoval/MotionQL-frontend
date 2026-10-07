import { API_URL, http, USE_MOCK } from "./client";
import { mockApi } from "./mock";
import type { Attribution } from "@/lib/attribution";
import type { AcquisitionReport, AuditEvent, FreePlan, Invite, InvitePreview, License, Me, Member, Referral, ReferralPreview, Release, Role, Team, User } from "./types";

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
  updateMember(teamId: string, userId: string, patch: { role?: "admin" | "member" }): Promise<unknown>;
  removeMember(teamId: string, userId: string): Promise<void>;
  assignSeat(teamId: string, userId: string): Promise<{ license: License }>;
  freeSeat(teamId: string, userId: string): Promise<void>;
  reissueMemberKey(teamId: string, userId: string): Promise<{ license: License }>;
  invites(teamId: string): Promise<{ invites: Invite[] }>;
  invite(teamId: string, input: { emails: string[]; role: Role; assignSeat: boolean }): Promise<{ invites: Invite[]; skipped: { email: string; reason: string }[] }>;
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
  updateMember: (id, userId, patch) => http("PATCH", `/teams/${enc(id)}/members/${enc(userId)}`, patch),
  removeMember: (id, userId) => http("DELETE", `/teams/${enc(id)}/members/${enc(userId)}`),
  assignSeat: (id, userId) => http("POST", `/teams/${enc(id)}/seats/${enc(userId)}`),
  freeSeat: (id, userId) => http("DELETE", `/teams/${enc(id)}/seats/${enc(userId)}`),
  reissueMemberKey: (id, userId) => http("POST", `/teams/${enc(id)}/members/${enc(userId)}/reissue`),
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
