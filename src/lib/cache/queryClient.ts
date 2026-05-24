import { QueryClient } from '@tanstack/react-query';

export const PERSISTED_QUERY_CACHE_KEY = 'diambra-react-query-cache';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1, // 10 minutes
      gcTime: 1000 * 60 * 1,    // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export const QUERY_KEYS = {
  AUTH_ME: ['auth', 'me'],
  ADMIN_USER_DETAIL: (userId: string) => ['admin', 'user', userId],
  CONSULTATIONS_MY: ['consultations', 'me'],
  CONSULTATIONS_GAME: (gameId?: string) => ['consultations', 'pergame', gameId] as const,
  NOTIFICATIONS: ['notifications'],
  WALLET_TRANSACTIONS: ['wallet', 'transactions'],
  WALLET_UNUSED_OFFERINGS: ['wallet', 'unused-offerings'],
};

export function clearPersistedQueryCache() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(PERSISTED_QUERY_CACHE_KEY);
}