import { api } from '@/lib/api/client';
import { getBooks } from '@/lib/api/services/books.service';
import { consultationsService } from '@/lib/api/services/consultations.service';
import { notificationsService } from '@/lib/api/services/notifications.service';
import { getConsultationsByRubrique } from '@/lib/api/services/rubriques.service';
import { walletService } from '@/lib/api/services/wallet.service';
import type { User } from '@/lib/interfaces';
import type { QueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryClient';


const inFlightDataPrefetches = new Map<string, Promise<void>>();
const inFlightConsultationPrefetches = new Map<string, Promise<void>>();
const inFlightAdminUserPrefetches = new Map<string, Promise<void>>();

type PrefetchEntry = {
  route: string;
  requiresAuth?: boolean;
  prefetch: (queryClient: QueryClient) => Promise<void>;
};

const prefetchRegistry: PrefetchEntry[] = [
  {
    route: '/star/consultations',
    requiresAuth: true,
    prefetch: async (queryClient) => {
      await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.CONSULTATIONS_MY,
        queryFn: () => consultationsService.getMine(),
      });
    },
  },
  {
    route: '/star/wallet',
    requiresAuth: true,
    prefetch: async (queryClient) => {
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: QUERY_KEYS.WALLET_TRANSACTIONS,
          queryFn: () => walletService.getTransactions(),
        }),
        queryClient.prefetchQuery({
          queryKey: QUERY_KEYS.WALLET_UNUSED_OFFERINGS,
          queryFn: () => walletService.getUnusedOfferings(),
        }),
      ]);
    },
  },
  {
    route: '/star/livres',
    prefetch: async (queryClient) => {
      await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.BOOKS,
        queryFn: getBooks,
      });
    },
  },
  {
    route: '/star/notifications',
    requiresAuth: true,
    prefetch: async (queryClient) => {
      await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.NOTIFICATIONS,
        queryFn: () => notificationsService.getUnreadNotifications(),
      });
    },
  },
  {
    route: '/star/monprofil',
    requiresAuth: true,
    prefetch: async (queryClient) => {
      await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.CONSULTATIONS_BY_RUBRIQUE('694acf59bd12675f59e7a7f2'),
        queryFn: () => getConsultationsByRubrique('694acf59bd12675f59e7a7f2'),
      });
    },
  },
  {
    route: '/admin/consultations',
    requiresAuth: true,
    prefetch: async (queryClient) => {
      await queryClient.prefetchQuery({
        queryKey: ['consultations', 'assigned', 1, 100],
        queryFn: () => consultationsService.getAssigned(1, 100),
      });
    },
  },
  {
    route: '/admin/books',
    requiresAuth: true,
    prefetch: async (queryClient) => {
      await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.BOOKS,
        queryFn: getBooks,
      });
    },
  },
  
];

export function normalizePrefetchHref(href: string): string | null {
  if (!href.startsWith('/')) {
    return null;
  }

  const pathname = href.split('#')[0]?.split('?')[0]?.trim();
  if (!pathname) {
    return null;
  }

  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export function prefetchRouteData(
  queryClient: QueryClient,
  href: string,
  isAuthenticated: boolean,
): Promise<void> {
  const normalizedHref = normalizePrefetchHref(href);
  if (!normalizedHref) {
    return Promise.resolve();
  }

  const entry = prefetchRegistry.find((candidate) => candidate.route === normalizedHref);
  if (!entry) {
    return Promise.resolve();
  }

  if (entry.requiresAuth && !isAuthenticated) {
    return Promise.resolve();
  }

  const existing = inFlightDataPrefetches.get(normalizedHref);
  if (existing) {
    return existing;
  }

  const pending = entry
    .prefetch(queryClient)
    .catch(() => undefined)
    .finally(() => {
      inFlightDataPrefetches.delete(normalizedHref);
    });

  inFlightDataPrefetches.set(normalizedHref, pending);
  return pending;
}

export function prefetchConsultationFrontData(queryClient: QueryClient, consultationId: string): Promise<void> {
  const normalizedId = consultationId.trim();
  if (!normalizedId) {
    return Promise.resolve();
  }

  const existing = inFlightConsultationPrefetches.get(normalizedId);
  if (existing) {
    return existing;
  }

  const pending = queryClient
    .prefetchQuery({
      queryKey: QUERY_KEYS.CONSULTATION_FRONT_DATA(normalizedId),
      queryFn: () => consultationsService.getFrontData(normalizedId),
      staleTime: 1000 * 60,
    })
    .catch(() => undefined)
    .finally(() => {
      inFlightConsultationPrefetches.delete(normalizedId);
    });

  inFlightConsultationPrefetches.set(normalizedId, pending);
  return pending;
}

export function prefetchAdminUserDetail(queryClient: QueryClient, userId: string): Promise<void> {
  const normalizedId = userId.trim();
  if (!normalizedId) {
    return Promise.resolve();
  }

  const existing = inFlightAdminUserPrefetches.get(normalizedId);
  if (existing) {
    return existing;
  }

  const pending = queryClient
    .prefetchQuery({
      queryKey: QUERY_KEYS.ADMIN_USER_DETAIL(normalizedId),
      queryFn: async () => {
        const response = await api.get<User>(`/users/${normalizedId}`);
        return response.data;
      },
      staleTime: 1000 * 60,
    })
    .catch(() => undefined)
    .finally(() => {
      inFlightAdminUserPrefetches.delete(normalizedId);
    });

  inFlightAdminUserPrefetches.set(normalizedId, pending);
  return pending;
}