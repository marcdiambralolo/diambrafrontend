import { api } from "@/lib/api/client";
import { formatEditionDate } from "@/lib/functions";
import { Consultation } from "@/lib/interfaces";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface Edition {
  startDate?: string;
  endDate?: string;
}

interface Stats {
  completedPlayers?: number;
   totalTimeSpent: number;
  averageTimeSpent: number;
  fastestTime: number;
  fastestTimeFormatted: string;
}

interface ApiResponse {
  latestEdition?: Edition;
  stats?: Stats;
  consultations?: Consultation[];
}

interface TimeSpentStats {
  totalSeconds: number;
  averageSeconds: number;
  maxSeconds: number;
  minSeconds: number;
  formattedTotal: string;
  formattedAverage: string;
  formattedMax: string;
  formattedMin: string;
}

interface DuplicateInfo {
  count: number;
  isDuplicate: boolean;
  totalTimeSpent: number;
}

const TIME_PATTERNS = [
  { regex: /(\d+)\s*h/, multiplier: 3600 },
  { regex: /(\d+)\s*m/, multiplier: 60 },
  { regex: /(\d+)\s*s/, multiplier: 1 },
  { regex: /^(\d+)$/, multiplier: 1 }
] as const;


// ============================================
// Utilitaires
// ============================================
export const parseTimeToSeconds = (timeStr: string): number => {
  if (!timeStr) return 0;

  // Si c'est déjà un nombre en string
  if (/^\d+$/.test(timeStr)) {
    return parseInt(timeStr, 10);
  }

  // Format "X.Xs" ou "X sec"
  const match = timeStr.match(/(\d+(?:\.\d+)?)\s*(?:sec|s)?/i);
  return match ? parseFloat(match[1]) : 0;
};

export const formatTimeFromSeconds = (seconds: number): string => {
  if (seconds < 60) return `${seconds} sec`;
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;
  if (restSeconds === 0) return `${minutes} min`;
  return `${minutes} min ${restSeconds} sec`;
};

const extractSecondsFromTimeSpent = (timeSpent: string | undefined): number => {
  if (!timeSpent) return 0;

  if (/^\d+$/.test(timeSpent)) {
    return parseInt(timeSpent, 10);
  }

  let totalSeconds = 0;
  for (const { regex, multiplier } of TIME_PATTERNS) {
    const match = timeSpent.match(regex);
    if (match) {
      totalSeconds += parseInt(match[1], 10) * multiplier;
    }
  }

  return totalSeconds;
};

const formatSecondsToTime = (seconds: number): string => {
  if (seconds === 0) return '0s';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
};

const timeCache = new Map<string, number>();

const getCachedTime = (timeSpent: string | undefined): number => {
  if (!timeSpent) return 0;

  if (timeCache.has(timeSpent)) {
    return timeCache.get(timeSpent)!;
  }

  const seconds = extractSecondsFromTimeSpent(timeSpent);
  timeCache.set(timeSpent, seconds);
  return seconds;
};

export function useHistoriqueConsultations() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [sortedConsultations, setSortedConsultations] = useState<Consultation[]>([]);
  const [duplicateMap, setDuplicateMap] = useState<Map<string, DuplicateInfo>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchConsultations = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/admin/last-ended-learning/stats", {
        signal: abortControllerRef.current.signal,
      });

      const responseData = response.data as ApiResponse;

      if (!isMountedRef.current) return;

      setData(responseData);

      const consultations = responseData?.consultations ?? [];

      if (consultations.length === 0) {
        setSortedConsultations([]);
        setDuplicateMap(new Map());
        setLoading(false);
        return;
      }

      // ============================================
      // 1. Tri des consultations (optimisé)
      // ============================================
      const sorted = [...consultations].sort((a, b) => {
        const timeA = getCachedTime(a.timeSpent);
        const timeB = getCachedTime(b.timeSpent);
        return timeB - timeA; // Du plus long au plus court
      });

      setSortedConsultations(sorted);

      // ============================================
      // 2. Calcul des doublons (une seule passe)
      // ============================================
      const combinaisonMap = new Map<string, { count: number; totalTimeSpent: number }>();

      for (const consultation of sorted) {
        const comb = consultation.combinaison || '1230';
        const seconds = getCachedTime(consultation.timeSpent);

        const existing = combinaisonMap.get(comb);
        if (existing) {
          existing.count += 1;
          existing.totalTimeSpent += seconds;
        } else {
          combinaisonMap.set(comb, {
            count: 1,
            totalTimeSpent: seconds,
          });
        }
      }

      // Construction de la map des doublons
      const newDuplicateMap = new Map<string, DuplicateInfo>();
      for (const [comb, { count, totalTimeSpent }] of combinaisonMap) {
        newDuplicateMap.set(comb, {
          count,
          isDuplicate: count >= 2,
          totalTimeSpent,
        });
      }

      setDuplicateMap(newDuplicateMap);

    } catch (err: any) {
      if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') {
        return;
      }

      console.error('❌ Erreur fetchConsultations:', err);
      if (isMountedRef.current) {
        setError(err?.message || 'Erreur lors du chargement des données');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      abortControllerRef.current = null;
    }
  }, []);

  // ============================================
  // Refetch avec debounce
  // ============================================
  const refetch = useCallback(async () => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    return new Promise<void>((resolve) => {
      fetchTimeoutRef.current = setTimeout(async () => {
        await fetchConsultations();
        resolve();
        fetchTimeoutRef.current = null;
      }, 300);
    });
  }, [fetchConsultations]);

  // ============================================
  // Effets
  // ============================================
  useEffect(() => {
    isMountedRef.current = true;
    fetchConsultations();

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      // Nettoyage du cache
      timeCache.clear();
    };
  }, [fetchConsultations]);

  // ============================================
  // Calcul des statistiques de temps (mémorisé)
  // ============================================
  const timeSpentStats = useMemo((): TimeSpentStats => {
    const consultations = sortedConsultations;
    const length = consultations.length;

    if (length === 0) {
      return {
        totalSeconds: 0,
        averageSeconds: 0,
        maxSeconds: 0,
        minSeconds: 0,
        formattedTotal: '0s',
        formattedAverage: '0s',
        formattedMax: '0s',
        formattedMin: '0s',
      };
    }

    // Une seule passe pour calculer tout
    let totalSeconds = 0;
    let maxSeconds = -Infinity;
    let minSeconds = Infinity;

    for (const consultation of consultations) {
      const seconds = getCachedTime(consultation.timeSpent);
      totalSeconds += seconds;
      if (seconds > maxSeconds) maxSeconds = seconds;
      if (seconds < minSeconds) minSeconds = seconds;
    }

    const averageSeconds = Math.round(totalSeconds / length);

    return {
      totalSeconds,
      averageSeconds,
      maxSeconds: maxSeconds === -Infinity ? 0 : maxSeconds,
      minSeconds: minSeconds === Infinity ? 0 : minSeconds,
      formattedTotal: formatSecondsToTime(totalSeconds),
      formattedAverage: formatSecondsToTime(averageSeconds),
      formattedMax: formatSecondsToTime(maxSeconds === -Infinity ? 0 : maxSeconds),
      formattedMin: formatSecondsToTime(minSeconds === Infinity ? 0 : minSeconds),
    };
  }, [sortedConsultations]);

  // ============================================
  // Statistiques de participants (mémorisé)
  // ============================================
  const participantStats = useMemo(() => {
    const uniquePlayers = new Set(
      sortedConsultations
        .map(c => c.clientId?._id)
        .filter((id): id is string => Boolean(id))
    );

    return {
      uniquePlayers: uniquePlayers.size,
      totalConsultations: sortedConsultations.length,
      hasMultipleConsultations: uniquePlayers.size < sortedConsultations.length,
    };
  }, [sortedConsultations]);

  // ============================================
  // Données dérivées
  // ============================================
  const edition = data?.latestEdition;
  const stats = data?.stats;

  const editionStartDate = edition?.startDate ? new Date(edition.startDate) : null;
  const editionEndDate = edition?.endDate ? new Date(edition.endDate) : null;

  const formattedStartDate = formatEditionDate(editionStartDate);
  const formattedEndDate = formatEditionDate(editionEndDate);

  const hasConsultations = sortedConsultations.length > 0;


  
    // Calcul des statistiques avancées avec useMemo
    const advancedStats = useMemo((): Stats | null => {
      if (!sortedConsultations?.length) return null;
  
      const validConsultations = sortedConsultations.filter(c => {
        const time = parseTimeToSeconds(c.timeSpent || '');
        return time > 0;
      });
  
      if (validConsultations.length === 0) return null;
  
      const totalTimeSpent = validConsultations.reduce(
        (sum, c) => sum + parseTimeToSeconds(c.timeSpent || ''),
        0
      );
  
      const averageTime = Math.round(totalTimeSpent / validConsultations.length);
  
      // Trouver le temps le plus rapide
      const fastest = validConsultations.reduce((fastest, current) => {
        const currentTime = parseTimeToSeconds(current.timeSpent || '');
        return currentTime < fastest.time ? { time: currentTime, consultation: current } : fastest;
      }, { time: Infinity, consultation: validConsultations[0] });
  
      return {
        completedPlayers: stats?.completedPlayers || validConsultations.length,
        totalTimeSpent,
        averageTimeSpent: averageTime,
        fastestTime: fastest.time,
        fastestTimeFormatted: formatTimeFromSeconds(fastest.time)
      };
    }, [sortedConsultations, stats]);
  
    // Calcul des rangs
    const rankedConsultations = useMemo(() => {
      if (!sortedConsultations?.length) return sortedConsultations;
  
      // Trier par temps (du plus rapide au plus lent)
      const sorted = [...sortedConsultations].sort((a, b) => {
        const timeA = parseTimeToSeconds(a.timeSpent || '');
        const timeB = parseTimeToSeconds(b.timeSpent || '');
        return timeA - timeB;
      });
  
      // Attribuer les rangs
      return sorted.map((consultation, index) => ({
        ...consultation,
        rank: index + 1
      }));
    }, [sortedConsultations]);
  
    // Gestion du retour
    const handleGoBack = useCallback(() => {
      window.history.back();
    }, []);

  // ============================================
  // Retour optimisé
  // ============================================
  return {
    // États
    loading,
    error,
    sortedConsultations,
    duplicateMap,
    hasConsultations,

    // Statistiques
    stats,
    timeSpentStats,
    participantStats,

    // Données de l'édition
    edition,
    formattedStartDate,
    formattedEndDate,

    // Actions
    refetch,
    advancedStats,
    rankedConsultations,
    handleGoBack,
  };
}