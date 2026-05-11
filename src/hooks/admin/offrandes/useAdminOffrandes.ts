import { api } from '@/lib/api/client';
import { Offering } from '@/lib/interfaces';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useGestionPanel } from './useGestionPanel';

export type SortKey = 'name' | 'price' | 'category';
export type ViewMode = 'gestion' | 'stats';

export const CONSTANTS = {
  ITEMS_PER_PAGE: 9,
  ANIMATION_DURATION: 0.2,
  DEBOUNCE_DELAY_MS: 300,
} as const;

export interface StatsData {
  byCategory: Array<{ category: string; revenue: number; quantitySold: number }>;
  periods: {
    today: { revenue: number; quantitySold: number };
    last7: { revenue: number; quantitySold: number };
    last30: { revenue: number; quantitySold: number };
  };
  byOffering: Array<{
    offeringId: string;
    name: string;
    icon: string;
    category: string;
    revenue: number;
    quantitySold: number;
    avgUnitPrice: number;
  }>;
}

export interface OfferingFormData {
  id: string;
  name: string;
  category: string;
  price: number;
  priceUSD: number;
  icon: string;
  description: string;
}

type OfferingsResponse = {
  offerings?: Offering[];
};

export function useAdminOffrandes() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'gestion' | 'stats'>('gestion');
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [successMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Chargement différé des stats
  const fetchOfferings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<OfferingsResponse>('/offerings');
      setOfferings(res.data.offerings || []);
    } catch {
      setErrorMessage('Erreur lors du chargement des offrandes');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await api.get<StatsData>('/admin/offerings/stats');
      if (response.status === 200 && response.data) {
        setStatsData(response.data);
      }
    } catch {
      setErrorMessage('Erreur lors du chargement des statistiques');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOfferings();
    // On ne charge les stats que si l'onglet stats est actif
    if (activeTab === 'stats') fetchStats();
  }, [fetchOfferings, fetchStats, activeTab]);

  const handleEdit = (offering: Offering) => {
    router.push(`/admin/offrandes/${offering._id}/edit`);
  };

  const handleAdd = () => {
    router.push('/admin/offrandes/new');
  };

  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { page, setPage, totalPages, offerings: paginatedOfferings } = useGestionPanel(
    offerings,
    CONSTANTS.ITEMS_PER_PAGE,
    sortKey,
    sortOrder
  );

  const handleRefresh = useCallback(() => {
    fetchOfferings();
    fetchStats();
  }, [fetchOfferings, fetchStats]);

  return {
    setSortOrder, setSortKey, setErrorMessage, handleEdit, handleAdd,
    handleRefresh, setPage, setActiveTab,
    offerings, statsData, loading, statsLoading, successMessage, errorMessage,
    activeTab, sortKey, sortOrder, page, totalPages, paginatedOfferings,
  };
}