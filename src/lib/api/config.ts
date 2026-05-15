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
