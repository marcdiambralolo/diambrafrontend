'use client';
import { api } from '@/lib/api/client';
import { ActiveEdition, Consultation, StatisticsData, WinnersData } from '@/lib/interfaces';
import { useCallback, useEffect, useRef, useState } from 'react';

export const ITEMS_PER_PAGE = 10000;

const isValidTimeSpent = (consultation: Consultation): boolean => {
  const timeSpent = consultation?.timeSpent;
  if (!timeSpent) return false;

  const numericMatch = timeSpent.match(/(\d+(?:\.\d+)?)/);
  if (!numericMatch) return false;

  const numericValue = parseFloat(numericMatch[1]);
  return !isNaN(numericValue) && numericValue > 0;
};

export function useAdminConsultationsPageFinished() {
  const isMountedRef = useRef(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [activeEdition, setActiveEdition] = useState<ActiveEdition | null>(null);
  const [winners, setWinners] = useState<WinnersData | null>(null);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);

  const hasWinners = winners?.totalWinners ? winners.totalWinners > 0 : false;
  const winningCombination = statistics?.winningCombination || activeEdition?.winningCombination || null;

  const fetchData = useCallback(async () => {
    try {
      const { data } = await api.get<any>('/consultations/ended-learning', {
        params: { page: 1, limit: ITEMS_PER_PAGE },
      });

      if (isMountedRef.current) {
        const validConsultations = (data?.consultations || []).filter(isValidTimeSpent);
        setConsultations(validConsultations);
        setActiveEdition(data?.activeEdition || null);
        setWinners(data?.winners || null);
        setStatistics(data?.statistics || null);
        setError(null);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        console.error('Erreur:', err);
        setError(err?.message || 'Erreur lors du chargement');
      }
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();
    return () => { isMountedRef.current = false; };
  }, [fetchData]);

  return { loading, error, activeEdition, consultations, winners, statistics, hasWinners, winningCombination, };
}