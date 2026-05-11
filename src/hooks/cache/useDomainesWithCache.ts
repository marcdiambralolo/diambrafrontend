import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { QUERY_KEYS } from '@/lib/cache/queryClient';

type DomaineNode = Record<string, unknown>;

export function useDomainesWithCache() {
  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
    isSuccess,
  } = useQuery<DomaineNode[]>({
    queryKey: QUERY_KEYS.DOMAINES,
    queryFn: async () => {
      const res = await api.get<DomaineNode[]>('/config/domaines');
      return res.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 30,   // 30 min
  });

  return {
    domaines: data,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
  };
}
