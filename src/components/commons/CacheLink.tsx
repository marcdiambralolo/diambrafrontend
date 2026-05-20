'use client';
import { prefetchRouteData } from '@/lib/cache/route-prefetch';
import { useAuthStore } from '@/lib/store/auth.store';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useCallback, useMemo } from 'react';

type NextLinkProps = ComponentPropsWithoutRef<typeof Link>;

interface CacheLinkProps extends Omit<NextLinkProps, 'href' | 'children'> {
  href: string;
  children: ReactNode;
  /** Éviter le cache busting (désactivé par défaut) */
  disableCacheBusting?: boolean;
  /** Ajouter un timestamp personnalisé */
  customTimestamp?: number;
}

/**
 * Ajoute un paramètre de cache busting à l'URL
 * @param url - URL d'origine
 * @param timestamp - Timestamp à utiliser (optionnel)
 * @returns URL avec paramètre de cache busting
 */
const addCacheBusting = (url: string, timestamp?: number): string => {
  // Ne pas ajouter de cache busting pour les URLs externes
  if (url.startsWith('http') || url.startsWith('//') || url.startsWith('mailto:') || url.startsWith('tel:')) {
    return url;
  }

  const bustTimestamp = timestamp || Date.now();
  const separator = url.includes('?') ? '&' : '?';

  // Éviter d'ajouter plusieurs fois le même paramètre
  if (url.includes('_cb=')) {
    return url.replace(/_cb=\d+/, `_cb=${bustTimestamp}`);
  }

  return `${url}${separator}_cb=${bustTimestamp}`;
};

/**
 * Génère un timestamp unique pour la session (change toutes les 5 minutes)
 * Pour éviter de trop rafraîchir, on utilise un intervalle de 5 minutes
 */
const getSessionTimestamp = (): number => {
  // Timestamp arrondi à 5 minutes (300000 ms)
  return Math.floor(Date.now() / 300000) * 300000;
};

export default function CacheLink({
  href,
  children,
  className,
  disableCacheBusting = false,
  customTimestamp,
  ...props
}: CacheLinkProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isAuthenticated = Boolean(useAuthStore((state) => state.user));

  // URL avec cache busting
  const bustedHref = useMemo(() => {
    if (disableCacheBusting) return href;

    // Pour les URLs avec ancre (#), on garde l'ancre à la fin
    const [baseUrl, hash] = href.split('#');
    const urlWithCache = addCacheBusting(baseUrl, customTimestamp || getSessionTimestamp());
    return hash ? `${urlWithCache}#${hash}` : urlWithCache;
  }, [href, disableCacheBusting, customTimestamp]);

  // Version sans cache busting pour la préfetch (évite de polluer le cache)
  const prefetchHref = useMemo(() => {
    // Supprimer les paramètres de cache busting pour la préfetch
    return href.replace(/[?&]_cb=\d+/, '').replace(/[?&]$/, '');
  }, [href]);

  const handlePrefetch = useCallback(() => {
    if (props.prefetch === false) {
      return;
    }
    // Utiliser l'URL sans cache busting pour la préfetch
    void router.prefetch(prefetchHref);
    void prefetchRouteData(queryClient, prefetchHref, isAuthenticated);
  }, [prefetchHref, isAuthenticated, props.prefetch, queryClient, router]);

  const handleMouseEnter = useCallback<NonNullable<CacheLinkProps['onMouseEnter']>>((event) => {
    props.onMouseEnter?.(event);
    handlePrefetch();
  }, [handlePrefetch, props]);

  const handleFocus = useCallback<NonNullable<CacheLinkProps['onFocus']>>((event) => {
    props.onFocus?.(event);
    handlePrefetch();
  }, [handlePrefetch, props]);

  const handleTouchStart = useCallback<NonNullable<CacheLinkProps['onTouchStart']>>((event) => {
    props.onTouchStart?.(event);
    handlePrefetch();
  }, [handlePrefetch, props]);

  return (
    <Link
      href={bustedHref}
      className={className}
      {...props}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      onTouchStart={handleTouchStart}
    >
      {children}
    </Link>
  );
}