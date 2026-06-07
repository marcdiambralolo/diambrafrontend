'use client';

import { useStatsDataWithCache } from '@/hooks/cache/useStatsDataWithCache';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const TICK_INTERVAL = 1000;

export function useAdminConsultationsPageFinished() {
  const router = useRouter();
  const { stats } = useStatsDataWithCache();
  const { gameConfig, clearCurrentMatchInfo } = useMonEtoileStore();

  // On stocke uniquement le timestamp actuel pour l'horloge globale
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(() => Date.now());
  const hasRedirectedRef = useRef(false);

  // 1. Horloge atomique : évite les effets de bords et met à jour uniquement l'entier brut
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, TICK_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  // 2. Dates mémorisées
  const startDate = useMemo(() =>
    gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null,
    [gameConfig?.startgameDate]
  );

  const endDate = useMemo(() =>
    gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null,
    [gameConfig?.endgameDate]
  );

  // 3. Déduction d'états synchrone performante (Supprime le besoin de useState/useEffect pour synchroniser)
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

  // 4. Action de clôture et redirection
  const handleEndMatch = useCallback(() => {
    if (hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;

    // Si besoin d'appeler l'action du store fournie par Zustand :
    if (typeof clearCurrentMatchInfo === 'function') {
      clearCurrentMatchInfo();
    }

    // router.push('/star/learning');
  }, [router, clearCurrentMatchInfo]);

  // 5. Déclencheur automatique de fin de jeu dès que la condition synchrone passe à true
  useEffect(() => {
    if (isGameFinished && !hasRedirectedRef.current) {
      handleEndMatch();
    }
  }, [isGameFinished, handleEndMatch]);

  return {
    handleEndMatch,
    stats,
    startDate,
    endDate,
    isGameFinished,
    remainingTime,
  };
}