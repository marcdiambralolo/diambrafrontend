import { User } from '@/lib/interfaces';
import type { LoginDto, RegisterDto, AuthResponse } from '@/lib/types/auth.types';
import { getBackendApiUrl } from '../server/session';
 
const AUTH_ROUTES = {
  login: getBackendApiUrl('auth/login'), // `${API_BASE}/auth/login`,
  register: getBackendApiUrl('auth/register'), // `${API_BASE}/auth/register`,
  me: getBackendApiUrl('auth/me'), // `${API_BASE}/auth/me`,
  logout: getBackendApiUrl('auth/logout'), // `${API_BASE}/auth/logout`,
} as const;

export class AuthRequestError extends Error {
  status: number | null;
  code: 'http' | 'network' | 'invalid-payload';

  constructor(message: string, options?: { status?: number | null; code?: 'http' | 'network' | 'invalid-payload' }) {
    super(message);
    this.name = 'AuthRequestError';
    this.status = options?.status ?? null;
    this.code = options?.code ?? 'http';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function ensureUserPayload(payload: unknown): User {
  if (!isRecord(payload)) {
    throw new AuthRequestError('Invalid user payload', { code: 'invalid-payload' });
  }

  const identifier = payload._id || payload.id;
  if (typeof identifier !== 'string' || typeof payload.username !== 'string') {
    throw new AuthRequestError('Invalid user payload', { code: 'invalid-payload' });
  }

  return payload as User;
}

function ensureAuthResponse(payload: unknown): AuthResponse {
  if (!isRecord(payload)) {
    throw new AuthRequestError('Invalid authentication response', { code: 'invalid-payload' });
  }

  return {
    user: ensureUserPayload(payload.user),
  };
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (isRecord(payload) && typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message;
  }

  return fallback;
}

async function requestAuthRoute<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(input, {
      ...init,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(init?.headers || {}),
      },
      cache: 'no-store',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication request failed';
    throw new AuthRequestError(message, { code: 'network' });
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new AuthRequestError(getErrorMessage(payload, 'Authentication request failed'), {
      status: response.status,
      code: 'http',
    });
  }

  return payload as T;
}

export const authService = {
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const payload = await requestAuthRoute<AuthResponse>(AUTH_ROUTES.register, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return ensureAuthResponse(payload);
  },

  /**
   * Connexion utilisateur
   */
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const payload = await requestAuthRoute<AuthResponse>(AUTH_ROUTES.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return ensureAuthResponse(payload);
  },

  /**
   * Récupération du profil utilisateur courant
   */
  me: async (): Promise<User> => {
    const payload = await requestAuthRoute<User>(AUTH_ROUTES.me, {
      method: 'GET',
    });

    return ensureUserPayload(payload);
  },

  /**
   * Déconnexion utilisateur
   */
  logout: async (): Promise<void> => {
    await requestAuthRoute<{ success: boolean }>(AUTH_ROUTES.logout, {
      method: 'POST',
    });
  },
};

export default authService;