// hooks/admin/consultations/useAdminConsultationsPageFinished.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api/client';
import { Consultation } from '@/lib/interfaces';

export const ITEMS_PER_PAGE = 144;

export function useAdminConsultationsPageFinished() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/admin/consultations/ended-editions', {
        params: {
          page: page,
          limit: ITEMS_PER_PAGE,
        },
      });

      const data: any = response.data;
      setConsultations(data?.consultations as unknown as Consultation[] || []);
      setTotal(data?.total || 0);
      setCurrentPage(page);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err?.message || 'Erreur lors du chargement');
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  // Changement de page
  const handlePageChange = useCallback((page: number) => {
    if (page === currentPage) return;
    fetchData(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, fetchData]);

  // Rafraîchissement
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await fetchData(currentPage);
    setIsRefreshing(false);
  }, [fetchData, currentPage, isRefreshing]);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  return {
    consultations,
    total,
    totalPages,
    currentPage,
    loading,
    error,
    isRefreshing,
    handleRefresh,
    handlePageChange,
  };
}