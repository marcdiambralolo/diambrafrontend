'use client';
import { useStatsDataWithCache } from '@/hooks/cache/useStatsDataWithCache';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useAdminConsultationsPageFinished() {
  const router = useRouter();
  const { stats } = useStatsDataWithCache();
  const { gameConfig, competitions, clearCurrentMatchInfo } = useMonEtoileStore();

  const [isGameFinished, setIsGameFinished] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [checkCount, setCheckCount] = useState(0);
  
  const hasCalledEndRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const startDate = useMemo(() =>
    gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null,
    [gameConfig?.startgameDate]
  );

  const endDate = useMemo(() =>
    gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null,
    [gameConfig?.endgameDate]
  );

  // Fonction de vérification
  const checkGameFinished = useCallback(() => {
    if (!isMountedRef.current) return false;

    // Vérifier si l'édition est terminée
    if (gameConfig?.status === 'ended') {
      setIsGameFinished(true);
      return true;
    }
    
    // Vérifier si la date de fin est dépassée
    if (endDate) {
      const now = new Date();
      const remaining = endDate.getTime() - now.getTime();
      const remainingSecs = Math.max(0, Math.floor(remaining / 1000));
      setRemainingTime(remainingSecs);
      
      if (remaining <= 0) {
        setIsGameFinished(true);
        return true;
      }
    }
    
    // Vérifier si toutes les compétitions sont terminées
    if (competitions.length > 0) {
      const allCompetitionsFinished = competitions.every(comp => 
        comp.matchInfo && comp.matchInfo.length > 0 && 
        comp.matchInfo.every(match => match.isgameover === true)
      );
      
      if (allCompetitionsFinished) {
        setIsGameFinished(true);
        return true;
      }
    }
    
    setIsGameFinished(false);
    return false;
  }, [gameConfig?.status, endDate, competitions]);

  // Vérification chaque seconde avec compteur
  useEffect(() => {
    isMountedRef.current = true;
    
    // Vérification immédiate
    checkGameFinished();
    setCheckCount(prev => prev + 1);

    // Intervalle toutes les secondes
    intervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        checkGameFinished();
        setCheckCount(prev => prev + 1);
      }
    }, 1000);

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkGameFinished]);

  const handleEndMatch = useCallback(() => {
    if (hasCalledEndRef.current) return;
    hasCalledEndRef.current = true;
    
    // Nettoyer l'intervalle
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Nettoyer les données
    clearCurrentMatchInfo();
    
    // Rediriger
    router.push('/star/learning');
  }, [router, clearCurrentMatchInfo]);

  // Déclencher la fin du jeu
  useEffect(() => {
    if (isGameFinished && !hasCalledEndRef.current) {
      const timer = setTimeout(() => {
        handleEndMatch();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isGameFinished, handleEndMatch]);

  // Nettoyage final
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { 
    handleEndMatch, 
    stats, 
    startDate, 
    endDate,
    isGameFinished,
    remainingTime,
  };
}