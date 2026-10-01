// Shapes shared with the backend API (Xquery.io-backend). Dates are ISO strings.

export type Edition = "pro" | "enterprise" | "trial";
export type Role = "owner" | "admin" | "member";

export interface User {
  id: string;
  email: string;
  name: string;
  company: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface License {
  licenseId: string;
  key: string;
  edition: Edition;
  seats: number;
  features: string[];
  issuedAt: string;
  expiresAt: string;
  revokedAt: string | null;
  status: "active" | "expired" | "revoked";
  team: { id: string; name: string } | null;
}

export type OS = "mac" | "windows" | "linux";

export interface ReleaseFile {
  id: string;
  name: string;
  os: OS;
  arch: "arm64" | "x64" | "universal";
  kind: "dmg" | "zip" | "exe" | "msi" | "portable" | "AppImage" | "deb" | "rpm";
  size: number;
  sha256: string;
}

export interface Release {
  version: string;
  releasedAt: string;
  notesUrl: string;
  files: ReleaseFile[];
}

export interface Team {
  id: string;
  name: string;
  role: Role;
  seats: { limit: number; used: number };
  createdAt: string;
}

export interface Member {
  userId: string | null;
  email: string;
  name: string | null;
  role: Role;
  status: "invited" | "active";
  seat: boolean;
  license: License | null;
  lastSeenAt: string | null;
  appVersion: string | null;
  os: string | null;
  installs: number | null;
  invitedAt: string | null;
}

export interface Invite {
  id: string;
  email: string;
  role: Role;
  assignSeat: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface AuditEvent {
  id: string;
  actor: { email: string };
  action: string;
  target: string;
  at: string;
  details?: Record<string, unknown>;
}

export interface PublicPlans {
  free: { enabled: boolean; edition: Edition; durationDays: number };
}

export interface ApiErrorBody {
  error: { code: string; message: string; fields?: Record<string, string> };
}
