import {
  applySessionCookies, createUnauthorizedResponse,
  fetchBackendWithSession, getRequestSessionTokens, readJsonResponse,
} from '@/lib/api/server/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { accessToken, refreshToken } = getRequestSessionTokens(request);

  if (!accessToken) {
    return createUnauthorizedResponse(request);
  }

  let backendResponse: Response;
  let refreshedSession: { accessToken: string; refreshToken?: string } | null = null;

  try {
    const result = await fetchBackendWithSession(request, 'auth/me', {
      method: 'GET',
      accessToken,
      refreshToken,
    });
    
    backendResponse = result.backendResponse;
    refreshedSession = result.refreshedSession;
  } catch {
    return createUnauthorizedResponse(request);
  }

  const payload = await readJsonResponse<Record<string, unknown>>(backendResponse, {});
  const response = NextResponse.json(payload, { status: backendResponse.status });

  if (backendResponse.ok && refreshedSession) {
    applySessionCookies(request, response, refreshedSession);
  }
  if (backendResponse.status === 401) {
    return createUnauthorizedResponse(request);
  }

  return response;
}