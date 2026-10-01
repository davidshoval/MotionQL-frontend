import type { ApiErrorBody } from "./types";

/** Error thrown for any non-2xx answer from the API. */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

/** With no API URL configured (local dev, preview deploys) the site runs on an in-browser mock backend. */
export const USE_MOCK = !API_URL || process.env.NEXT_PUBLIC_API_MOCK === "1";

function csrfToken() {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith("xq_csrf="))
    ?.slice("xq_csrf=".length);
}

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export async function http<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const csrf = csrfToken();
  if (csrf && method !== "GET") headers["X-CSRF-Token"] = decodeURIComponent(csrf);

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      credentials: "include",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "network", "We couldn't reach the server. Check your connection and try again.");
  }

  if (res.status === 204) return undefined as T;
  const data = (await res.json().catch(() => null)) as unknown;
  if (!res.ok) {
    const err = (data as ApiErrorBody | null)?.error;
    throw new ApiError(
      res.status,
      err?.code ?? (res.status === 401 ? "unauthorized" : "unknown"),
      err?.message ?? "Something went wrong. Please try again.",
      err?.fields,
    );
  }
  return data as T;
}
