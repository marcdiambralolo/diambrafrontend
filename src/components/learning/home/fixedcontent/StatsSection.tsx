'use client';

import { memo } from 'react';
import { Users } from 'lucide-react';
import { useDiambraStore } from '@/lib/store/diambra.store';
import { StatCard } from './StatCard';
import { useStatsDataWithCache } from '@/hooks/cache/useStatsDataWithCache';
import { COLORS } from '@/lib/learning/constantes';
import Loader from '@/app/loading';
import ErrorMessage from '../../commons/ErrorMessage';

export const StatsSection = memo(function StatsSection() {
  // 1. Check feature toggle first to skip fetching data if disabled
  const afficheStat = useDiambraStore((state) => state.afficheStat);

  // 2. Fetch stats
  const { stats, isLoading, error } = useStatsDataWithCache();

  // 3. Handle early exits early and cleanly
  if (!afficheStat) return null;
  if (error) return <ErrorMessage />;
  if (isLoading) return <Loader />;

  // Safely fallback to 0 or undefined rather than non-null assertion
  const subscriberCount = stats?.subscribers ?? 0;

  return (
    <StatCard
      value={subscriberCount}
      label="Inscrits"
      icon={<Users className="w-4 h-4" aria-hidden="true" />}
      color={COLORS.subscribers}
    />
  );
});