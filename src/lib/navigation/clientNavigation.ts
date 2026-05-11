'use client';

export const CLIENT_NAVIGATION_EVENT = 'monetoile:navigate';

export type ClientNavigationDetail = {
  href: string;
  replace?: boolean;
  refresh?: boolean;
};

export function dispatchClientNavigation(detail: ClientNavigationDetail) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent<ClientNavigationDetail>(CLIENT_NAVIGATION_EVENT, { detail }));
}

export function dispatchLoginNavigation(returnTo?: string) {
  const params = new URLSearchParams();

  if (returnTo) {
    params.set('returnTo', returnTo);
  }

  dispatchClientNavigation({
    href: params.size ? `/auth/login?${params.toString()}` : '/auth/login',
    replace: true,
    refresh: true,
  });
}