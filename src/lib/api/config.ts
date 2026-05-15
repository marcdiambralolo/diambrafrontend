/** Préfixe global NestJS (voir main.ts → setGlobalPrefix). */
export const API_PREFIX2 = "/api/v1";

/**
 * Origine du backend (ex. http://localhost:3001).
 * Définir NEXT_PUBLIC_API_URL dans `.env.local`.
 */
export function getApiOrigin2(): string {
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
export function apiUrl2(path: string): string {
  const origin = getApiOrigin();
  const segment = path.startsWith("/") ? path : `/${path}`;
  if (segment === "/" || segment === "") {
    return `${origin}${API_PREFIX}`;
  }
  return `${origin}${API_PREFIX}${segment}`;
}


/** Préfixe global NestJS (voir main.ts → setGlobalPrefix). */
export const API_PREFIX3 = "/api/v1";

/**
 * Origine du backend (ex. http://localhost:3001).
 * Définir NEXT_PUBLIC_API_URL dans `.env.local`.
 * ✅ CORRECTION : En production, utiliser chemin relatif pour éviter CORS
 */
export function getApiOrigin3(): string {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // En production, utiliser le chemin relatif (proxy Nginx)
  if (isProduction) {
    return '';
  }
  
  const raw =
    typeof process.env.NEXT_PUBLIC_API_URL === "string"
      ? process.env.NEXT_PUBLIC_API_URL.trim()
      : "";
  const fallback = "http://localhost:3001";
  return (raw || fallback).replace(/\/$/, "");
}

/**
 * URL absolue vers un chemin API (ex. `''` → …/api/v1, `'/status'` → …/api/v1/status).
 * ✅ CORRECTION : Évite la double route /api/v1/api/v1/...
 */
export function apiUrl3(path: string): string {
  const origin = getApiOrigin();
  const segment = path.startsWith("/") ? path : `/${path}`;
  
  // En production, origin est vide → URL relative
  if (origin === '') {
    if (segment === "/" || segment === "") {
      return API_PREFIX;
    }
    return `${API_PREFIX}${segment}`;
  }
  
  // En développement
  if (segment === "/" || segment === "") {
    return `${origin}${API_PREFIX}`;
  }
  return `${origin}${API_PREFIX}${segment}`;
}


/** Préfixe global NestJS (voir main.ts → setGlobalPrefix). */
export const API_PREFIX = "api/v1";

/**
 * Origine du backend (ex. http://localhost:3001).
 * Définir NEXT_PUBLIC_API_URL dans `.env.local`.
 */
export function getApiOrigin(): string {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    return '';
  }
  
  const raw =
    typeof process.env.NEXT_PUBLIC_API_URL === "string"
      ? process.env.NEXT_PUBLIC_API_URL.trim()
      : "";
  const fallback = "http://localhost:3001";
  return (raw || fallback).replace(/\/$/, "");
}

/**
 * URL absolue vers un chemin API.
 * ✅ CORRECTION : Ne pas ajouter de / supplémentaire
 */
export function apiUrl(path: string): string {
  const origin = getApiOrigin();
  
  // Nettoyer le path : enlever les / au début et à la fin
  const cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '');
  
  // En production, origin est vide → URL relative
  if (origin === '') {
    if (!cleanPath) {
      return `/${API_PREFIX}`;
    }
    return `/${API_PREFIX}/${cleanPath}`;
  }
  
  // En développement
  if (!cleanPath) {
    return `${origin}/${API_PREFIX}`;
  }
  return `${origin}/${API_PREFIX}/${cleanPath}`;
}
