import { api } from "@/lib/api/client";
import { formatEditionDate } from "@/lib/functions";
import { Consultation } from "@/lib/interfaces";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Edition {
  startDate?: string;
  endDate?: string;
}

interface Stats {
  completedPlayers?: number;
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
}

interface DuplicateInfo {
  count: number;
  isDuplicate: boolean;
  totalTimeSpent: number;
}

interface UseHistoriqueConsultationsReturn {
  loading: boolean;
  error: string | null;
  sortedConsultations: Consultation[];
  duplicateMap: Map<string, DuplicateInfo>;
  hasConsultations: boolean;
  stats: Stats | undefined;
  timeSpentStats: TimeSpentStats;
  formattedStartDate: string;
  formattedEndDate: string;
  edition: Edition | undefined;
  refetch: () => Promise<void>;
}

const extractSecondsFromTimeSpent = (timeSpent: string | undefined): number => {
  if (!timeSpent) return 0;

  const minutesMatch = timeSpent.match(/(\d+)\s*m/);
  const secondsMatch = timeSpent.match(/(\d+)\s*s/);
  const hoursMatch = timeSpent.match(/(\d+)\s*h/);

  let totalSeconds = 0;

  if (hoursMatch) totalSeconds += parseInt(hoursMatch[1]) * 3600;
  if (minutesMatch) totalSeconds += parseInt(minutesMatch[1]) * 60;
  if (secondsMatch) totalSeconds += parseInt(secondsMatch[1]);

  return totalSeconds;
};

const formatSecondsToTime = (seconds: number): string => {
  if (seconds === 0) return '0s';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
};

const isValidTimeSpent = (consultation: Consultation): boolean => {
  const timeSpent = consultation?.timeSpent;
  if (!timeSpent) return false;

  return extractSecondsFromTimeSpent(timeSpent) > 0;
};

export function useHistoriqueConsultations(): UseHistoriqueConsultationsReturn {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [sortedConsultations, setSortedConsultations] = useState<Consultation[]>([]);
  const [duplicateMap, setDuplicateMap] = useState<Map<string, DuplicateInfo>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchConsultations = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/admin/last-ended-learning/stats", {
        signal: abortControllerRef.current.signal,
      });

      const responseData = response.data as ApiResponse;

      if (isMountedRef.current) {
        setData(responseData);

        const consultations = responseData?.consultations ?? [];

        const sorted = [...consultations]
          .filter(isValidTimeSpent)
          .sort((a, b) => {
            const timeA = extractSecondsFromTimeSpent(a.timeSpent);
            const timeB = extractSecondsFromTimeSpent(b.timeSpent);
            return timeB - timeA;
          });

        setSortedConsultations(sorted);

        const combinaisonMap = new Map<string, { count: number; totalTimeSpent: number }>();

        sorted.forEach((consultation) => {
          const comb = consultation.combinaison || '????';
          const seconds = extractSecondsFromTimeSpent(consultation.timeSpent);

          const existing = combinaisonMap.get(comb);
          if (existing) {
            combinaisonMap.set(comb, {
              count: existing.count + 1,
              totalTimeSpent: existing.totalTimeSpent + seconds,
            });
          } else {
            combinaisonMap.set(comb, {
              count: 1,
              totalTimeSpent: seconds,
            });
          }
        });

        const newDuplicateMap = new Map<string, DuplicateInfo>();
        combinaisonMap.forEach(({ count, totalTimeSpent }, comb) => {
          newDuplicateMap.set(comb, {
            count,
            isDuplicate: count >= 2,
            totalTimeSpent,
          });
        });

        setDuplicateMap(newDuplicateMap);
      }
    } catch (err: any) {
      if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') {
        return;
      }

      console.error('Erreur:', err);
      if (isMountedRef.current) {
        setError(err?.message || 'Erreur lors du chargement');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      abortControllerRef.current = null;
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchConsultations();
  }, [fetchConsultations]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchConsultations();

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchConsultations]);

  const timeSpentStats = useMemo((): TimeSpentStats => {
    const secondsList = sortedConsultations.map(c => extractSecondsFromTimeSpent(c.timeSpent));

    if (secondsList.length === 0) {
      return {
        totalSeconds: 0,
        averageSeconds: 0,
        maxSeconds: 0,
        minSeconds: 0,
        formattedTotal: '0s',
        formattedAverage: '0s',
      };
    }

    const totalSeconds = secondsList.reduce((acc, s) => acc + s, 0);
    const averageSeconds = Math.round(totalSeconds / secondsList.length);
    const maxSeconds = Math.max(...secondsList);
    const minSeconds = Math.min(...secondsList);

    return {
      totalSeconds,
      averageSeconds,
      maxSeconds,
      minSeconds,
      formattedTotal: formatSecondsToTime(totalSeconds),
      formattedAverage: formatSecondsToTime(averageSeconds),
    };
  }, [sortedConsultations]);

  const edition = data?.latestEdition;
  const stats = data?.stats;
  const editionStartDate = edition?.startDate ? new Date(edition.startDate) : null;
  const editionEndDate = edition?.endDate ? new Date(edition.endDate) : null;
  const formattedStartDate = formatEditionDate(editionStartDate);
  const formattedEndDate = formatEditionDate(editionEndDate);
  const hasConsultations = sortedConsultations.length > 0;

  return {
    refetch, loading, error, sortedConsultations, duplicateMap, hasConsultations, stats,
     timeSpentStats, formattedStartDate,    formattedEndDate, edition,
  };
}