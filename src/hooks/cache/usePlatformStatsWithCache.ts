import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { QUERY_KEYS } from '@/lib/cache/queryClient';

type PlatformStats = Record<string, unknown> | null;

export function usePlatformStatsWithCache() {
  const {
    data = null,
    isLoading,
    isError,
    error,
    refetch,
    isSuccess,
  } = useQuery<PlatformStats>({
    queryKey: QUERY_KEYS.PLATFORM_STATS,
    queryFn: async () => {
      const res = await api.get<PlatformStats>('/config/stats');
      return res.data || null;
    },
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 30,   // 30 min
  });

  return {
    stats: data,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
  };
}
