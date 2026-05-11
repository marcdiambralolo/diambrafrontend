import { useDomainesWithCache } from '@/hooks/cache/useDomainesWithCache';
import { usePlatformStatsWithCache } from '@/hooks/cache/usePlatformStatsWithCache';

export function useRubriquesOverview() {
    const { domaines, isLoading: loadingDomaines, error: errorDomaines } = useDomainesWithCache();

    const { stats, isLoading: loadingStats, error: errorStats } = usePlatformStatsWithCache();

    return { domaines, stats, loading: loadingDomaines || loadingStats, error: errorDomaines || errorStats, };
}