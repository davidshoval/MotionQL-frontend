// Shapes returned by the backend API (motionql-backend, docs/API.md). Dates are ISO strings.

export type Edition = "pro" | "enterprise" | "trial";
export type Role = "owner" | "admin" | "member";
export type LicenseStatus = "active" | "expired" | "revoked" | "replaced";

export interface User {
  id: string;
  email: string;
  name: string;
  company?: string | null;
  emailVerified: boolean;
  isStaff: boolean;
  createdAt: string;
}

export interface TeamSummary {
  id: string;
  name: string;
  role: Role;
  hasSeat: boolean;
}

export interface PendingInvite {
  id: string;
  teamName: string;
  role: Role;
  invitedBy: string;
}

export interface Me {
  user: User;
  teams: TeamSummary[];
  pendingInvites: PendingInvite[];
}

export interface License {
  licenseId: string;
  key: string;
  edition: Edition;
  features: string[];
  customer: string;
  email: string;
  seats: number;
  issuedAt: string;
  expiresAt: string;
  status: LicenseStatus;
  source: "free" | "team" | "staff";
  revokedAt?: string | null;
  team?: { id: string; name: string } | null;
}

export type OS = "macos" | "windows" | "linux";

export interface ReleaseFile {
  name: string;
  os: OS;
  arch: "arm64" | "x64" | "universal";
  kind: "dmg" | "zip" | "exe" | "msi" | "appimage" | "deb" | "rpm";
  size: number;
  sha256?: string;
  url: string;
}

export interface Release {
  version: string;
  publishedAt: string;
  releaseNotesUrl: string;
  files: ReleaseFile[];
}

export interface Team {
  id: string;
  name: string;
  seatLimit: number;
  seatsUsed: number;
  allowedEditions: Edition[];
  allowedFeatures: string[];
  createdAt: string;
}

export interface Member {
  userId: string;
  email: string;
  name: string;
  role: Role;
  hasSeat: boolean;
  edition: Edition;
  features: string[];
  joinedAt: string;
  license?: { licenseId: string; edition: Edition; features: string[]; issuedAt: string; expiresAt: string; status: LicenseStatus };
  usage?: { lastSeen: string; appVersion: string; platform: string; installs: number };
}

export interface Invite {
  id: string;
  email: string;
  role: Role;
  assignSeat: boolean;
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
}

export interface InvitePreview {
  teamName: string;
  email: string;
  role: Role;
  invitedBy: string;
  assignSeat: boolean;
}

export interface AuditEvent {
  id: string;
  at: string;
  actor: { id: string; email: string } | null;
  action: string;
  target: { type?: string; id?: string; email?: string; name?: string } | null;
  details: Record<string, unknown>;
}

export interface FreePlan {
  enabled: boolean;
  edition: Edition;
  features: string[];
  durationDays: number;
  renewable: boolean;
}

/** Refer a friend: the signed-in user's invite link. `reward` is null while the reward is switched off. */
export interface Referral {
  code: string;
  url: string;
  signups: number;
  confirmed: number;
  rewarded: number;
  reward: { bonusDays: number; maxRewards: number; remaining: number } | null;
}

/** What an invite link shows before sign-up: the inviter's first name and the reward, if on. */
export interface ReferralPreview {
  code: string;
  inviterName: string;
  reward: { bonusDays: number } | null;
}

export interface ApiErrorBody {
  error: { code: string; message: string; fields?: Record<string, string> };
}

/** One row of GET /admin/acquisition: sign-ups that first arrived with this utm_source (null: none). */
export interface AcquisitionSource {
  utmSource: string | null;
  signups: number;
  confirmed: number;
  /** Distinct company e-mail domains (personal mailboxes left out). */
  companies: number;
  companies2Plus: number;
  companies3Plus: number;
  /** Users whose key has been seen in the app. */
  activated: number;
}

export interface AcquisitionReport {
  from: string | null;
  to: string | null;
  totals: { signups: number; confirmed: number; companies: number; activated: number };
  sources: AcquisitionSource[];
}
