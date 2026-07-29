'use client';
import Loader from '@/app/loading';
import { useStatsDataWithCache } from '@/hooks/cache/useStatsDataWithCache';
import { COLORS } from '@/lib/learning/constantes';
import { useDiambraStore } from '@/lib/store/diambra.store';
import { Users } from 'lucide-react';
import { memo } from 'react';
import ErrorMessage from '../../commons/ErrorMessage';
import { StatCard } from './StatCard';

export const StatsSection = memo(function StatsSection() {
  const afficheStat = useDiambraStore((state) => state.afficheStat);

  const { stats, isLoading, error } = useStatsDataWithCache();

  if (!afficheStat) return null;

  if (error) return <ErrorMessage />;

  if (isLoading) return <Loader />;

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