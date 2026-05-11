import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── JWT helpers (edge-compatible, no Node.js APIs) ────────────────────────
type DecodedToken = {
  exp: number;
  role?: string;
  roles?: string[];
};

function decodeToken(token: string): DecodedToken | null {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    // Edge Runtime: use globalThis.atob (no Buffer)
    const json = globalThis.atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  return decoded.exp < Math.floor(Date.now() / 1000);
}


// ─── Route sets (computed once at module level) ─────────────────────────────
const AUTH_PAGES = new Set(['/auth/login', '/auth/register']);
const AUTH_ACTIONS = new Set(['/auth/logout']);
const PROTECTED_PREFIXES = ['/admin'] as const;

// ─── Security headers applied to every response ────────────────────────────
const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-DNS-Prefetch-Control': 'on',
};

/** Apply security headers to a NextResponse */
function withSecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

// ─── Middleware ──────────────────────────────────────────────────────────────
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get('monetoile_access_token')?.value;
  const isAuthAction = AUTH_ACTIONS.has(pathname);
  const isProtected = (pathname.startsWith('/admin')) || (pathname.startsWith('/star'));

  if (token && isTokenExpired(token)) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    if (isProtected) {
      const url = new URL(`/auth/login?returnTo=${encodeURIComponent(pathname + search)}`, baseUrl);
      const res = NextResponse.redirect(url);
      res.cookies.delete('monetoile_access_token');
      return withSecurityHeaders(res);
    }
    const res = NextResponse.next();
    res.cookies.delete('monetoile_access_token');
    return withSecurityHeaders(res);
  }

  if (isProtected && !token && !isAuthAction) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const url = new URL(`/auth/login?returnTo=${encodeURIComponent(pathname + search)}`, baseUrl);
    return withSecurityHeaders(NextResponse.redirect(url));
  }

  return withSecurityHeaders(NextResponse.next());
}

// ─── Matcher: only run on routes that need auth logic ───────────────────────
export const config = {
  matcher: [
   '/star/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/callback',
    '/wallet',
  ],
};
