import { api } from '@/lib/api/client';
import { Consultation } from '@/lib/interfaces';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface EditionInfo {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  isActive: boolean;
  winningCombination: string | null;
}

export function useConsultationsListPage() {
  const [activeTab, setActiveTab] = useState<'history' | 'games'>('games');
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [editions, setEditions] = useState<EditionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/consultations/me');
      const data: any = response.data;

      setConsultations(data?.consultations || []);
      setEditions(data?.editions || []);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err?.response?.data?.message || err?.message || 'Erreur lors du chargement');
      setConsultations([]);
      setEditions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 🔥 Tri des éditions : en cours d'abord, puis par date décroissante
  const sortedEditions = useMemo(() => {
    const now = new Date();

    return [...editions].sort((a, b) => {
      const aStart = new Date(a.startDate);
      const aEnd = new Date(a.endDate);
      const bStart = new Date(b.startDate);
      const bEnd = new Date(b.endDate);

      const aIsActive = aStart <= now && aEnd >= now && a.status === 'active';
      const bIsActive = bStart <= now && bEnd >= now && b.status === 'active';

      // Priorité 1: Les éditions en cours passent en premier
      if (aIsActive && !bIsActive) return -1;
      if (!aIsActive && bIsActive) return 1;

      // Priorité 2: Les éditions à venir (non commencées)
      const aIsUpcoming = aStart > now;
      const bIsUpcoming = bStart > now;

      if (aIsUpcoming && !bIsUpcoming) return -1;
      if (!aIsUpcoming && bIsUpcoming) return 1;

      // Priorité 3: Pour les éditions terminées, tri par date de fin décroissante (plus récente d'abord)
      if (!aIsActive && !bIsActive && !aIsUpcoming && !bIsUpcoming) {
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      }

      // Priorité 4: Tri par date de début décroissante
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }, [editions]);

  const getGamesCountByEdition = useCallback((editionId: string) => {
    return consultations.filter(c => c.edition?.id === editionId).length;
  }, [consultations]);

  const gamesCount = consultations.length;

  return {
    setActiveTab, getGamesCountByEdition,
    editions: sortedEditions, consultations, loading, gamesCount, activeTab, error,
  };
}