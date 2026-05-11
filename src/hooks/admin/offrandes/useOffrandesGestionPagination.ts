import { useState, useMemo } from 'react';

export function useOffrandesGestionPagination<T>(items: T[], perPage: number = 6) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / perPage);
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page, perPage]);
  return { page, setPage, totalPages, paginatedItems };
}