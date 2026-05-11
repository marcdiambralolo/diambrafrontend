import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';


type StatsResponse = {
  subscribers?: number;
  visits?: number;
};
export interface Stats {
  subscribers: number;
  visits: number;
}
 

export function useStatsDataWithCache() {
  const {
    data: stats = null,
    isLoading,
    isError,
    error,
    refetch,
    isSuccess,
  } = useQuery<Stats | null>({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await api.post<StatsResponse>('/stats');
      if (!res.data) throw new Error('Aucune donnée reçue');
      return {
        subscribers: res.data.subscribers ?? 0,
        visits: res.data.visits ?? 0,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 30,   // 30 min
  });

  return {
    stats,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
  };
}
