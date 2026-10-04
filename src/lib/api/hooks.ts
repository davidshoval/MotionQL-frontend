"use client";

import { useQuery } from "@tanstack/react-query";
import { api, ApiError } from "./index";
import { linuxInstallers } from "@/lib/os";

export const qk = {
  me: ["me"] as const,
  licenses: ["me", "licenses"] as const,
  release: ["release", "latest"] as const,
  team: (id: string) => ["team", id] as const,
  members: (id: string) => ["team", id, "members"] as const,
  invites: (id: string) => ["team", id, "invites"] as const,
  audit: (id: string) => ["team", id, "audit"] as const,
};

/** The signed-in user, or null when signed out. */
export function useMe() {
  return useQuery({
    queryKey: qk.me,
    queryFn: async () => {
      try {
        return await api.me();
      } catch (e) {
        if (e instanceof ApiError && (e.status === 401 || e.status === 403)) return null;
        throw e;
      }
    },
    staleTime: 60_000,
    retry: false,
  });
}

export function useLicenses(enabled = true) {
  return useQuery({ queryKey: qk.licenses, queryFn: () => api.myLicenses().then((r) => r.licenses), enabled });
}

export function useRelease() {
  return useQuery({ queryKey: qk.release, queryFn: () => api.latestRelease(), staleTime: 10 * 60_000, retry: 1 });
}

/**
 * Whether the latest release has Linux installers. Same lookup as the download panel; `available` stays false
 * while loading or when the lookup fails, so pages fall back to "coming soon" rather than a broken link.
 */
export function useLinuxRelease() {
  const { data: release, isLoading, isError } = useRelease();
  const files = release ? linuxInstallers(release.files) : [];
  return { release, files, available: files.length > 0, isLoading, isError };
}
