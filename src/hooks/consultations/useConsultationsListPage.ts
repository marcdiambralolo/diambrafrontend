import { api } from '@/lib/api/client';
import { Consultation } from '@/lib/interfaces';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function useConsultationsListPage() {
  const [activeTab, setActiveTab] = useState<'history' | 'games'>('games');
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchConsultations = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await api.get('/consultations/me');
      const data:any = response.data;
      const newLocal:any = data?.consultations as unknown as Consultation[] || [];
      setConsultations(newLocal);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err?.response?.data?.message || err?.message || 'Erreur lors du chargement');
      setConsultations([]);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  // Rafraîchissement manuel
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await fetchConsultations(false);
    setIsRefreshing(false);
  }, [fetchConsultations, isRefreshing]);

  const gamesCount = consultations.length;

  return {
    consultations,
    loading,
    gamesCount,
    activeTab,
    setActiveTab,
    error,
    isRefreshing,
    handleRefresh,
  };
}