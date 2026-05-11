import { QueryClient } from '@tanstack/react-query';

export const PERSISTED_QUERY_CACHE_KEY = 'monetoile-react-query-cache';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes
      gcTime: 1000 * 60 * 30,    // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export const QUERY_KEYS = {
  AUTH_ME: ['auth', 'me'],
  ADMIN_USER_DETAIL: (userId: string) => ['admin', 'user', userId],
  BLOG_POSTS: ['blog-posts'],
  BLOG_DETAIL: (blogId: string) => ['blog-post', blogId],
  ADMIN_BLOG_ARTICLES: ['admin-blog-articles'],
  BOOKS: ['books'],
  BOOK_DETAIL: (bookId: string) => ['book', bookId],
  CONSULTATION_FRONT_DATA: (consultationId: string) => ['consultation', 'front-data', consultationId],
  CONSULTATIONS_BY_RUBRIQUE: (rubriqueId: string) => ['consultations-by-rubrique', rubriqueId],
  RUBRIQUE_CINQ_ETOILES: ['rubrique-cinq-etoiles'],
  CONSULTATIONS_MY: ['consultations', 'my'],
  ANALYSES_BY_CHOICE: (choiceId: string) => ['analyses', 'by-choice', choiceId],
  DOMAINES: ['domaines'],
  GRADES: ['grades'],
  MESSAGING_CLIENT_THREAD: (consultantId: string) => ['messaging', 'client-thread', consultantId],
  MESSAGING_CONSULTATION_THREAD: (consultationId: string) => ['messaging', 'consultation-thread', consultationId],
  NOTIFICATIONS: ['notifications'],
  PLATFORM_STATS: ['platform-stats'],
  RUBRIQUES: ['rubriques'],
  RUBRIQUE_DETAIL: (rubriqueId: string) => ['rubrique', rubriqueId],
  RUBRIQUES_OVERVIEW: ['rubriques-overview'],
  WALLET_TRANSACTIONS: ['wallet', 'transactions'],
  WALLET_UNUSED_OFFERINGS: ['wallet', 'unused-offerings'],
  MY_FEATURE: ['my-feature'],
  // Ajoutez d'autres clés ici
};

export function clearPersistedQueryCache() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(PERSISTED_QUERY_CACHE_KEY);
}
