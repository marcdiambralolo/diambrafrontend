'use client';
import { useStatsDataWithCache } from '@/hooks/cache/useStatsDataWithCache';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const TICK_INTERVAL = 1000;

export function useAdminConsultationsPageFinished() {
  const router = useRouter();
  const { stats } = useStatsDataWithCache();
  const { gameConfig, setGameIsFinished } = useMonEtoileStore();

  const [currentTimestamp, setCurrentTimestamp] = useState<number>(() => Date.now());
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, TICK_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  const startDate = useMemo(() =>
    gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null,
    [gameConfig?.startgameDate]
  );

  const endDate = useMemo(() =>
    gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null,
    [gameConfig?.endgameDate]
  );

  const { isGameFinished, remainingTime } = useMemo(() => {
    if (gameConfig?.status === 'ended') {
      return { isGameFinished: true, remainingTime: 0 };
    }

    if (!endDate) {
      return { isGameFinished: false, remainingTime: null };
    }

    const remainingMs = endDate.getTime() - currentTimestamp;
    const remainingSecs = Math.max(0, Math.floor(remainingMs / 1000));

    return {
      isGameFinished: remainingMs <= 0,
      remainingTime: remainingSecs
    };
  }, [gameConfig?.status, endDate, currentTimestamp]);

  const handleEndMatch = useCallback(() => {
    if (hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;
    setGameIsFinished(true);
      const queryClient = useQueryClient();
      queryClient.invalidateQueries({ queryKey: ['game'] });
  }, [router,]);

  useEffect(() => {
    if (isGameFinished && !hasRedirectedRef.current) {
      handleEndMatch();
    }
  }, [isGameFinished, handleEndMatch]);

  return { handleEndMatch, stats, startDate, endDate, isGameFinished, remainingTime, };
}