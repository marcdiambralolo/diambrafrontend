import { api } from '@/lib/api/client';
import { Consultation } from '@/lib/interfaces';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface ConsultationsState {
  data: Consultation[];
  loading: boolean;
  error: string | null;
}

export function useConsultationsListPageWithId() {
  const params = useParams();
  
  // Paramètre de route (URL dynamique)
  const gameId = useMemo(() => params?.id as string, [params?.id]);
  const [activeTab, setActiveTab] = useState<'history' | 'games'>('games');
  const [state, setState] = useState<ConsultationsState>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchConsultations = useCallback(async () => {
    if (!gameId) {
      setState(prev => ({ ...prev, loading: false, error: 'Aucun ID de jeu trouvé' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await api.get<{
        success: boolean;
        consultations: Consultation[];
      }>(`/consultations/me/by-idjeu/${gameId}`);
      
      setState({
        data: response.data?.consultations ?? [],
        loading: false,
        error: null,
      });
    } catch (err: any) {
      console.error('Erreur lors du chargement des consultations:', err);
      setState({
        data: [],
        loading: false,
        error: err?.response?.data?.message || err?.message || 'Erreur lors du chargement des consultations',
      });
    }
  }, [gameId]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const myConsultations = useMemo(() => state.data, [state.data]);

  return {
    consultations: myConsultations,
    loading: state.loading,
    gamesCount: myConsultations.length,
    activeTab,
    setActiveTab,
    error: state.error,
    refetch: fetchConsultations,
  };
}