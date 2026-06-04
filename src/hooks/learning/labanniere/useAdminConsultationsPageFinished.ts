'use client';
import { useStatsDataWithCache } from '@/hooks/cache/useStatsDataWithCache';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { useCallback, useMemo } from 'react';

export function useAdminConsultationsPageFinished() {
  const { stats } = useStatsDataWithCache();

  const {  gameConfig } = useMonEtoileStore();

  const startDate = useMemo(() =>
    gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null,
    [gameConfig?.startgameDate]
  );

  const endDate = useMemo(() =>
    gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null,
    [gameConfig?.endgameDate]
  );

  const handleEndMatch = useCallback(() => {
   
  }, [ ]);

  return { handleEndMatch, stats, startDate, endDate };
}