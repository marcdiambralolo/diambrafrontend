import { api } from '@/lib/api/client';
import { Offering } from '@/lib/interfaces';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
 import { useMemo } from 'react';

export type SortKey = 'name' | 'price';
export type ViewMode = 'gestion' | 'stats'; 

export function useOffrandesGestionPagination<T>(items: T[], perPage: number = 6) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / perPage);
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page, perPage]);
  return { page, setPage, totalPages, paginatedItems };
}

export function useGestionPanel(
  offerings: Offering[],
  perPage = 6,
  sortKey: 'name' | 'price',
  sortOrder: 'asc' | 'desc' = 'asc'
) {
  // Tri dynamique selon la clé et l'ordre
  const sorted = useMemo(() => {
    const sortedArr = [...offerings].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'price') cmp = a.price - b.price;
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return sortedArr;
  }, [offerings, sortKey, sortOrder]);
  const { page, setPage, totalPages, paginatedItems } = useOffrandesGestionPagination(sorted, perPage);
  return { page, setPage, totalPages, offerings: paginatedItems };
}

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
    revenue: number;
    quantitySold: number;
    avgUnitPrice: number;
  }>;
}

export interface OfferingFormData {
  id: string;
  name: string;
  price: number;
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

  const fetchOfferings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<OfferingsResponse>('/offerings');
      setOfferings(res.data.offerings || []);
    } catch {
      setErrorMessage('Erreur lors du chargement des jetons');
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