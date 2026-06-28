import { api } from '@/lib/api/client';
import { LastEndedGame, LastEndedResponse } from '@/lib/interfaces';
import { useQuery } from "@tanstack/react-query";

const QUERY_STALE_TIME = 10 * 1000;
const RETRY_ATTEMPTS = 2;
const LAST_ENDED_REFETCH_INTERVAL = 5000;

export function useLastEndedGame() {
  const { data: lastEndedGame = null, isLoading } = useQuery<LastEndedGame | null>({
    queryKey: ['game', 'last-ended'],
    queryFn: async () => {
      const { data } = await api.get<LastEndedResponse>('/learning-configurations/last-ended');
      return data?.hasEndedEdition ? data.configuration : null;
    },
    staleTime: QUERY_STALE_TIME,
    refetchInterval: LAST_ENDED_REFETCH_INTERVAL,
    refetchOnWindowFocus: false,
    retry: RETRY_ATTEMPTS,
    gcTime: 1000 * 60 * 5,
  });

  return { lastEndedGame, isLoading };
}