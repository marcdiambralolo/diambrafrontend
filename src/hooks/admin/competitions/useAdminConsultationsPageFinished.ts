'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api/client';
import { Consultation } from '@/lib/interfaces';

export const ITEMS_PER_PAGE = 10000;

interface ActiveEdition {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  isActive: boolean;
}

export function useAdminConsultationsPageFinished() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [activeEdition, setActiveEdition] = useState<ActiveEdition | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/admin/consultations/active-learning', {
        params: {
          page: page,
          limit: ITEMS_PER_PAGE,
        },
      });

      const data: any = response.data;
      setConsultations(data?.consultations as unknown as Consultation[] || []);
      setActiveEdition(data?.activeEdition || null);
      setTotal(data?.total || 0);
      setCurrentPage(page);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err?.message || 'Erreur lors du chargement');
      setConsultations([]);
      setActiveEdition(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await fetchData(currentPage);
    setIsRefreshing(false);
  }, [fetchData, currentPage, isRefreshing]);

  return {
    consultations, loading, error, isRefreshing, activeEdition, handleRefresh,
  };
}