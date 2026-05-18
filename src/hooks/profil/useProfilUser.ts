import { useStatsDataWithCache } from "../cache/useStatsDataWithCache";

export function useProfilUser() { 
  const { stats, isLoading: statsLoading } = useStatsDataWithCache();
  return { loading: statsLoading, stats, } as const;
}