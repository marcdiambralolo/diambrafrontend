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


import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import config from '../config';
import { clearClientApplicationState } from '../cache/clientState';
import { dispatchLoginNavigation } from '../navigation/clientNavigation';
import { logger } from '../utils/logger';

type DecodedToken = {
  exp?: number;
  role?: string;
  roles?: string[];
};

type ExtendedAxiosRequestConfig = InternalAxiosRequestConfig & {
  skipAuth?: boolean;
  skip401Redirect?: boolean;
};

const ACCESS_TOKEN_COOKIE = 'monetoile_access_token';
const REQUEST_TIMEOUT_MS = 300000; // 5 min
const AUTH_PAGES = ['/auth/login', '/auth/register'];

let authRedirectInFlight = false;

/**
 * Base64URL → Base64 compatible atob
 */
function normalizeBase64Url(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const paddingNeeded = (4 - (normalized.length % 4)) % 4;
  return normalized + '='.repeat(paddingNeeded);
}

/**
 * Décode le JWT côté navigateur
 */
function decodeToken(token: string): DecodedToken | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const json = globalThis.atob(normalizeBase64Url(payload));
    return JSON.parse(json) as DecodedToken;
  } catch {
    return null;
  }
}

/**
 * Vérifie si le token est expiré ou invalide
 */
function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  return decoded.exp <= Math.floor(Date.now() / 1000);
}

/**
 * Récupère le token depuis le cookie navigateur
 * NOTE: si le cookie est HttpOnly, cette méthode retournera null.
 * Dans ce cas, il faut s'appuyer sur withCredentials + cookies serveur.
 */
function getAccessTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${ACCESS_TOKEN_COOKIE.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Vérifie si on est déjà sur une page d'auth
 */
function isOnAuthPage(): boolean {
  if (typeof window === 'undefined') return false;
  return AUTH_PAGES.some((path) => window.location.pathname.startsWith(path));
}

/**
 * Supprime le cookie access token côté navigateur si accessible
 */
function clearAccessTokenCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Lax`;
}

/**
 * Détermine si l'URL concerne un endpoint auth pour éviter
 * des redirections parasites / boucles.
 */
function isAuthEndpoint(url?: string): boolean {
  if (!url) return false;
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/logout') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/me')
  );
}

/**
 * Détermine si l'erreur doit déclencher une redirection login
 */
function shouldRedirectOn401(error: AxiosError): boolean {
  const status = error.response?.status;
  if (status !== 401) return false;

  const requestConfig = error.config as ExtendedAxiosRequestConfig | undefined;

  if (requestConfig?.skip401Redirect) return false;
  if (isAuthEndpoint(requestConfig?.url)) return false;
  if (isOnAuthPage()) return false;

  return true;
}

/**
 * Redirection unique vers login
 */
function redirectToLogin(): void {
  if (typeof window === 'undefined') return;
  if (isOnAuthPage()) return;
  if (authRedirectInFlight) return;

  authRedirectInFlight = true;

  const returnTo = `${window.location.pathname}${window.location.search}`;

  void clearClientApplicationState()
    .catch((err) => {
      logger.warn('Erreur lors du nettoyage du state client avant redirect login', err);
    })
    .finally(() => {
      clearAccessTokenCookie();
      dispatchLoginNavigation(returnTo);

      window.setTimeout(() => {
        authRedirectInFlight = false;
      }, 600);
    });
}

/**
 * Instance Axios optimisée avec gestion avancée du cache et des tokens
 */
const cleanBaseURL = config.api.baseURL.replace(/\/+$/, '');
const hasApiPath = cleanBaseURL.endsWith('/api') || /\/api\//.test(cleanBaseURL);
const computedBaseURL = hasApiPath
  ? `${cleanBaseURL}/${config.api.apiVersion}`
  : `${cleanBaseURL}/api/${config.api.apiVersion}`;
const apiClient: AxiosInstance = axios.create({
  baseURL: computedBaseURL,
  timeout: REQUEST_TIMEOUT_MS,
  withCredentials: true,
  maxRedirects: 5,
  validateStatus: (status) => status >= 200 && status < 300,
});

/**
 * Intercepteur de requête
 * - n'injecte pas un token expiré
 * - respecte skipAuth
 * - ne remplace pas un Authorization déjà défini
 */
apiClient.interceptors.request.use(
  async (requestConfig: InternalAxiosRequestConfig) => {
    const config = requestConfig as ExtendedAxiosRequestConfig;

    if (config.skipAuth) {
      return config;
    }

    config.headers = config.headers || {};

    if (config.headers.Authorization) {
      return config;
    }

    const token = getAccessTokenFromCookie();

    if (!token) {
      return config;
    }

    if (isTokenExpired(token)) {
      logger.warn('Token expiré détecté avant requête, annulation préventive de l’auth header.');
      clearAccessTokenCookie();

      if (!isOnAuthPage()) {
        redirectToLogin();
      }

      return config;
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Intercepteur de réponse
 * - 401: redirection contrôlée
 * - 403: log
 * - réseau / timeout: log propre
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const requestConfig = error.config as ExtendedAxiosRequestConfig | undefined;

    if (shouldRedirectOn401(error)) {
      logger.warn('401 détecté, redirection login déclenchée.', {
        url: requestConfig?.url,
        method: requestConfig?.method,
      });

      redirectToLogin();
    }

    if (error.response?.status === 403) {
      logger.error('Permission refusée (403):', {
        url: requestConfig?.url,
        method: requestConfig?.method,
        data: error.response.data,
      });
    }

    if (
      !error.response &&
      error.name !== 'CanceledError' &&
      error.name !== 'AbortError'
    ) {
      logger.error('Erreur réseau ou timeout:', {
        url: requestConfig?.url,
        method: requestConfig?.method,
        message: error.message,
      });
    }

    return Promise.reject(error);
  },
);

/**
 * API helper avec support optionnel de skipAuth / skip401Redirect
 */
export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig & { skipAuth?: boolean; skip401Redirect?: boolean }) =>
    apiClient.get<T>(url, config),

  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig & { skipAuth?: boolean; skip401Redirect?: boolean },
  ) => apiClient.post<T>(url, data, config),

  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig & { skipAuth?: boolean; skip401Redirect?: boolean },
  ) => apiClient.put<T>(url, data, config),

  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig & { skipAuth?: boolean; skip401Redirect?: boolean },
  ) => apiClient.patch<T>(url, data, config),

  delete: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig & { skipAuth?: boolean; skip401Redirect?: boolean },
  ) => apiClient.delete<T>(url, config),
};

export default apiClient;
