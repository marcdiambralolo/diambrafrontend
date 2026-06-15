import { api } from '@/lib/api/client';
import { Consultation } from '@/lib/interfaces';
import { useState, useEffect, useCallback, useRef } from 'react';

const ITEMS_PER_PAGE = 10;

type ConsultationListResponse = {
  consultations: Consultation[];
  total: number;
};

interface UseConsultationsListPageReturn {
  loading: boolean;
  consultationsglobaux: Consultation[];
  historyCount: number;
  total: number;
  error: string | null;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export function useConsultationsListPage(): UseConsultationsListPageReturn {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Ref pour éviter les appels multiples
  const isMountedRef = useRef(true);
  const isLoadingRef = useRef(false);

  // Fonction pour charger une page spécifique
  const fetchPage = useCallback(async (page: number): Promise<ConsultationListResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(ITEMS_PER_PAGE),
    });

    const response = await api.get<{ consultations?: Consultation[]; total?: number }>(
      `/admin/consultations?${params}`,
      {
        headers: { 'Cache-Control': 'no-cache' },
        timeout: 30000,
      }
    );

    return {
      consultations: response.data?.consultations || [],
      total: Number(response.data?.total || 0),
    };
  }, []);

  // Fonction pour charger les données initiales
  const loadInitialData = useCallback(async () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const firstPage = await fetchPage(1);

      if (isMountedRef.current) {
        setConsultations(firstPage.consultations);
        setTotal(firstPage.total);
        setHasMore(firstPage.consultations.length < firstPage.total);
        setCurrentPage(2);
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement initial:', err);
      if (isMountedRef.current) {
        setError(err?.message || 'Erreur lors du chargement des données');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        isLoadingRef.current = false;
      }
    }
  }, [fetchPage]);

  // Fonction pour charger plus de données (infinite scroll)
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || loading) return;

    setIsLoadingMore(true);

    try {
      const nextPage = await fetchPage(currentPage);

      if (isMountedRef.current) {
        setConsultations(prev => [...prev, ...nextPage.consultations]);
        setHasMore(consultations.length + nextPage.consultations.length < total);
        setCurrentPage(prev => prev + 1);
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement supplémentaire:', err);
      if (isMountedRef.current) {
        setError(err?.message || 'Erreur lors du chargement');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoadingMore(false);
      }
    }
  }, [currentPage, hasMore, isLoadingMore, loading, total, consultations.length, fetchPage]);

  // Fonction pour rafraîchir les données
  const refresh = useCallback(async () => {
    await loadInitialData();
  }, [loadInitialData]);

  // Chargement initial
  useEffect(() => {
    isMountedRef.current = true;
    loadInitialData();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadInitialData]);

  return {
    consultationsglobaux: consultations, historyCount: consultations.length,
    total, loading, error, hasMore, isLoadingMore,
    loadMore, refresh,
  };
}