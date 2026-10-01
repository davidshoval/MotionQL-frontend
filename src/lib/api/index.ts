import { http, USE_MOCK } from "./client";
import { mockApi } from "./mock";
import type { AuditEvent, Invite, License, Member, PublicPlans, Release, Role, Team, User } from "./types";

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  company?: string;
}

/** Every call the website makes to the backend. The mock implements the same interface. */
export interface Api {
  register(input: RegisterInput): Promise<{ user: User; devVerifyToken?: string }>;
  verifyEmail(token: string): Promise<{ user: User }>;
  resendVerification(email: string): Promise<void>;
  login(email: string, password: string): Promise<{ user: User }>;
  logout(): Promise<void>;
  requestPasswordReset(email: string): Promise<{ devResetToken?: string } | void>;
  confirmPasswordReset(token: string, password: string): Promise<void>;
  oauthUrl(provider: "google" | "github", redirect: string): string | null;

  me(): Promise<{ user: User; teams: Team[] }>;
  updateMe(patch: { name?: string; company?: string | null }): Promise<{ user: User }>;
  deleteMe(): Promise<void>;
  myLicenses(): Promise<{ licenses: License[] }>;
  renewLicense(): Promise<{ license: License }>;
  reissueLicense(licenseId: string): Promise<{ license: License }>;

  latestRelease(): Promise<Release>;
  downloadLink(fileId: string): Promise<{ url: string; expiresAt: string }>;
  publicPlans(): Promise<PublicPlans>;

  createTeam(name: string): Promise<{ team: Team }>;
  team(id: string): Promise<{ team: Team }>;
  renameTeam(id: string, name: string): Promise<{ team: Team }>;
  members(teamId: string): Promise<{ members: Member[] }>;
  updateMember(teamId: string, userId: string, patch: { role?: Role }): Promise<{ member: Member }>;
  removeMember(teamId: string, userId: string): Promise<void>;
  assignSeat(teamId: string, userId: string): Promise<{ member: Member }>;
  freeSeat(teamId: string, userId: string): Promise<{ member: Member }>;
  reissueMemberKey(teamId: string, userId: string): Promise<{ member: Member }>;
  invites(teamId: string): Promise<{ invites: Invite[] }>;
  invite(teamId: string, input: { emails: string[]; role: Role; assignSeat: boolean }): Promise<{ invites: Invite[] }>;
  cancelInvite(teamId: string, inviteId: string): Promise<void>;
  resendInvite(teamId: string, inviteId: string): Promise<void>;
  acceptInvite(token: string): Promise<{ team: Team }>;
  audit(teamId: string, cursor?: string): Promise<{ events: AuditEvent[]; nextCursor: string | null }>;
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
  oauthUrl: (provider, redirect) => `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/${provider}?redirect=${enc(redirect)}`,

  me: () => http("GET", "/me"),
  updateMe: (patch) => http("PATCH", "/me", patch),
  deleteMe: () => http("DELETE", "/me"),
  myLicenses: () => http("GET", "/me/licenses"),
  renewLicense: () => http("POST", "/me/licenses/renew"),
  reissueLicense: (id) => http("POST", `/me/licenses/${enc(id)}/reissue`),

  latestRelease: () => http("GET", "/downloads/latest"),
  downloadLink: (fileId) => http("POST", `/downloads/${enc(fileId)}/link`),
  publicPlans: () => http("GET", "/plans/public"),

  createTeam: (name) => http("POST", "/teams", { name }),
  team: (id) => http("GET", `/teams/${enc(id)}`),
  renameTeam: (id, name) => http("PATCH", `/teams/${enc(id)}`, { name }),
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
  acceptInvite: (token) => http("POST", "/invites/accept", { token }),
  audit: (id, cursor) => http("GET", `/teams/${enc(id)}/audit${cursor ? `?cursor=${enc(cursor)}` : ""}`),
};

export const api: Api = USE_MOCK ? mockApi : httpApi;
export { ApiError, USE_MOCK } from "./client";
export type * from "./types";
