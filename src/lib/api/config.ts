/** Préfixe global NestJS (voir main.ts → setGlobalPrefix). */
export const API_PREFIX = "/api/v1";

/**
 * Origine du backend (ex. http://localhost:3001).
 * Définir NEXT_PUBLIC_API_URL dans `.env.local`.
 */
export function getApiOrigin(): string {
  const raw =
    typeof process.env.NEXT_PUBLIC_API_URL === "string"
      ? process.env.NEXT_PUBLIC_API_URL.trim()
      : "";
  const fallback = "http://localhost:3001";
  return (raw || fallback).replace(/\/$/, "");
}

/**
 * URL absolue vers un chemin API (ex. `''` → …/api/v1, `'/status'` → …/api/v1/status).
 */
export function apiUrl(path: string): string {
  const origin = getApiOrigin();
  const segment = path.startsWith("/") ? path : `/${path}`;
  if (segment === "/" || segment === "") {
    return `${origin}${API_PREFIX}`;
  }
  return `${origin}${API_PREFIX}${segment}`;
}
