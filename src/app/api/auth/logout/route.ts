import { clearSessionCookies, getBackendApiUrl, getRequestSessionTokens, readJsonResponse } from '@/lib/api/server/session';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { accessToken, refreshToken } = getRequestSessionTokens(request);

  let backendResponse: Response | null = null;
  let payload: any = { success: true };
  let status = 200;

  try {
    backendResponse = await fetch(getBackendApiUrl('auth/logout'), {
      method: 'POST',
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(refreshToken
          ? { Cookie: `monetoile_refresh_token=${refreshToken}; monetoile_access_token=${accessToken || ''}` }
          : {}),
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    payload = await readJsonResponse(backendResponse, { success: true });
    status = backendResponse.status;
  } catch (err) {
    payload = { success: false, message: 'Erreur lors de la déconnexion.' + err };
    status = 200;
  }

  const response = NextResponse.json(payload, { status });

  clearSessionCookies(request, response);

  return response;
}