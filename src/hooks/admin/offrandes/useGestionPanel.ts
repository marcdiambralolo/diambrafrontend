import { useOffrandesGestionPagination } from '@/hooks/admin/offrandes/useOffrandesGestionPagination';
import type { Offering } from '@/lib/interfaces';
import { useMemo } from 'react';

export function useGestionPanel(
  offerings: Offering[],
  perPage = 6,
  sortKey: 'name' | 'price' | 'category' = 'name',
  sortOrder: 'asc' | 'desc' = 'asc'
) {
  // Tri dynamique selon la clé et l'ordre
  const sorted = useMemo(() => {
    const sortedArr = [...offerings].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'price') cmp = a.price - b.price;
      else if (sortKey === 'category') cmp = a.category.localeCompare(b.category);
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return sortedArr;
  }, [offerings, sortKey, sortOrder]);
  const { page, setPage, totalPages, paginatedItems } = useOffrandesGestionPagination(sorted, perPage);
  return { page, setPage, totalPages, offerings: paginatedItems };
}
