import { getBooks } from '@/lib/api/services/books.service';
import { QUERY_KEYS } from '@/lib/cache/queryClient';
import { Book } from '@/lib/interfaces';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export function useBooksWithCache() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    error,
    refetch,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: QUERY_KEYS.BOOKS,
    queryFn: getBooks,
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 30,   // 30 min
  });

  const handlePurchase = async (book: Book) => {
    router.push(`/star/livres/${book._id || book.id}/offrande`);
  };

  const errorMsg = typeof error === 'string' ? error : (error?.message || 'Erreur inconnue');
  const itemsPerPage = 1;
  const total = data?.length;
  const totalPages = Math.max(1, Math.ceil(total! / itemsPerPage));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const safeSetPage = (p: number) => {
    if (p < 1) setPage(1);
    else if (p > totalPages) setPage(totalPages);
    else setPage(p);
  };

  const paginatedBooks: Book[] = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return (data || []).slice(start, start + itemsPerPage);
  }, [data, page, itemsPerPage]);

  return {
    safeSetPage, handlePurchase, isLoading, books: data || [], error, errorMsg,
    paginatedBooks, page, totalPages, total, itemsPerPage, refetch, isError, isSuccess,
  };
}