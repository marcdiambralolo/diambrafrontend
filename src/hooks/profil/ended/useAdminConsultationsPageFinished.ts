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
  winningCombination?: string;
}

export interface WinnersData {
  exact: Winner[];
  disordered: Winner[];
  totalExact: number;
  totalDisordered: number;
  totalWinners: number;
}

export interface Winner {
  country: string;
  consultationId: string;
  clientId: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  combination: string;
  timeSpent: number;
  createdAt: string;
  rank: number;
}

export interface StatisticsData {
  totalConsultations: number;
  totalParticipants: number;
  uniqueParticipants: number;
  winningCombination: string;
  successRate: {
    exact: number;
    disordered: number;
    overall: number;
  };
  digits: {
    frequency: Record<string, number>;
    mostFrequent: Array<{ digit: number; count: number; percentage: number }>;
    leastFrequent: Array<{ digit: number; count: number; percentage: number }>;
  };
  timeStats: {
    average: number;
    fastest: {
      time: number;
      clientId: string | null;
      username: string | null;
      combination: string | null;
    };
    slowest: {
      time: number;
      clientId: string | null;
      username: string | null;
      combination: string | null;
    };
    distribution: {
      under30s: number;
      under60s: number;
      under120s: number;
      over120s: number;
    };
  };
  combinations: {
    totalUnique: number;
    mostCommon: Array<{ combination: string; count: number; percentage: number }>;
    diversity: number;
  };
  topParticipants: Array<{
    clientId: string;
    username: string;
    participations: number;
  }>;
  medals: {
    gold: Winner | null;
    silver: Winner | null;
    bronze: Winner | null;
  };
}

export interface EndedGameResponse {
  consultations: Consultation[];
  activeEdition: ActiveEdition;
  winners: WinnersData | null;
  statistics: StatisticsData | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useAdminConsultationsPageFinished() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [activeEdition, setActiveEdition] = useState<ActiveEdition | null>(null);
  const [winners, setWinners] = useState<WinnersData | null>(null);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/consultations/ended-game', {
        params: {
          page: 1,
          limit: ITEMS_PER_PAGE,
        },
      });

      const data: EndedGameResponse = response.data as EndedGameResponse;
      setConsultations(data?.consultations || []);
      setActiveEdition(data?.activeEdition || null);
      setWinners(data?.winners || null);
      setStatistics(data?.statistics || null);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err?.message || 'Erreur lors du chargement');
      setConsultations([]);
      setActiveEdition(null);
      setWinners(null);
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    consultations, activeEdition, winners, statistics, loading, error,
    refresh: fetchData,
  };
}