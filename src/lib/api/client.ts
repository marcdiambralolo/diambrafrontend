import { apiUrl } from "@/lib/api/config";
import type { ApiHealthResponse, ApiStatusResponse } from "@/lib/api/types";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type FetchJsonOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

/**
 * Appelle le backend avec cookies httpOnly (JWT) si présents — nécessite `credentials: 'include'`.
 */
export async function apiFetch<T>(
  path: string,
  init: FetchJsonOptions = {},
): Promise<T> {
  const { body, headers: initHeaders, ...rest } = init;

  const headers = new Headers(initHeaders);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  let resolvedBody: BodyInit | undefined;
  if (body !== undefined && body !== null) {
    if (
      typeof body === "string" ||
      body instanceof FormData ||
      body instanceof Blob ||
      body instanceof ArrayBuffer
    ) {
      resolvedBody = body as BodyInit;
    } else {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      resolvedBody = JSON.stringify(body);
    }
  }

  const res = await fetch(apiUrl(path), {
    ...rest,
    headers,
    credentials: "include",
    body: resolvedBody,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const msg =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof (payload as { message: unknown }).message === "string"
        ? (payload as { message: string }).message
        : res.statusText || `HTTP ${res.status}`;
    throw new ApiError(res.status, msg, payload);
  }

  return payload as T;
}

/** Santé : GET /api/v1 */
export function fetchApiHealth() {
  return apiFetch<ApiHealthResponse>("");
}

/** Statut détaillé : GET /api/v1/status */
export function fetchApiStatus() {
  return apiFetch<ApiStatusResponse>("/status");
}
