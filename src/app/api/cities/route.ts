import { NextRequest, NextResponse } from 'next/server';

function getCityApiBaseUrl() {
  const baseUrl = process.env.CITY_API_URL || process.env.NEXT_PUBLIC_CITY_API_URL || '';
  return baseUrl.replace(/\/+$/, '');
}

function getCityApiKey() {
  return process.env.CITY_API_KEY || process.env.NEXT_PUBLIC_CITY_API_KEY || '';
}

export async function GET(request: NextRequest) {
  const cityApiBaseUrl = getCityApiBaseUrl();

  if (!cityApiBaseUrl) {
    return NextResponse.json({ message: 'API non configurée' }, { status: 503 });
  }

  const upstreamUrl = new URL(cityApiBaseUrl);

  request.nextUrl.searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.set(key, value);
  });

  const headers = new Headers({
    Accept: 'application/json',
  });

  const cityApiKey = getCityApiKey();

  if (cityApiKey) {
    headers.set('Authorization', `Bearer ${cityApiKey}`);
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl.toString(), {
      method: 'GET',
      headers,
      cache: 'no-store',
      signal: request.signal,
    });

    const contentType = upstreamResponse.headers.get('content-type') || 'application/json';

    const response = new NextResponse(await upstreamResponse.text(), {
      status: upstreamResponse.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
      },
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: 'Impossible de joindre le service de recherche de villes' },
      { status: 502 },
    );
  }
}