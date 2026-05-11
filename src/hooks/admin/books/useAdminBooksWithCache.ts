import { useQuery } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { getBooks } from '@/lib/api/services/books.service';
import { QUERY_KEYS, queryClient } from '@/lib/cache/queryClient';
import { Book } from '@/lib/interfaces';
import { useRouter } from 'next/navigation';

export type SortField = 'title' | 'pageCount' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

function toSearchableText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function toSortableValue(book: Book, sortField: SortField): number | string {
  if (sortField === 'createdAt') {
    return new Date(book.createdAt ?? 0).getTime();
  }

  if (sortField === 'pageCount') {
    const value = book.pageCount ?? book.pages;
    return typeof value === 'number' ? value : Number(value ?? 0);
  }

  return toSearchableText(book.title).toLowerCase();
}

function getErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return 'Erreur inconnue';
}

export function useAdminBooksWithCache() {
  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
    isSuccess,
  } = useQuery<Book[]>({
    queryKey: QUERY_KEYS.BOOKS,
    queryFn: getBooks,
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 30,   // 30 min
  });

  // UI/logic state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [customError, setError] = useState<string | undefined>();

  const handleToggleActive = async (bookId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/books/${bookId}`, { isActive: !currentStatus });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKS });
      refetch();
    } catch {
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(data.map(b => b.category));
    return Array.from(cats).sort();
  }, [data]);

  const filteredAndSortedBooks = useMemo(() => {
    const filtered = data.filter(book => {
      const matchesSearch = searchQuery === '' ||
        toSearchableText(book.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
        toSearchableText(book.subtitle).toLowerCase().includes(searchQuery.toLowerCase()) ||
        toSearchableText(book.author).toLowerCase().includes(searchQuery.toLowerCase()) ||
        toSearchableText(book.description).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && book.isActive) ||
        (statusFilter === 'inactive' && !book.isActive);
      return matchesSearch && matchesCategory && matchesStatus;
    });
    filtered.sort((a, b) => {
      const aVal = toSortableValue(a, sortField);
      const bVal = toSortableValue(b, sortField);
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    return filtered;
  }, [data, searchQuery, selectedCategory, statusFilter, sortField, sortOrder]);

  const router = useRouter();
  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 1;
  const pageCount = Math.max(1, Math.ceil(filteredAndSortedBooks.length / pageSize));
  const paginatedBooks = filteredAndSortedBooks.slice((page - 1) * pageSize, page * pageSize);

  // Reset page to 1 si filtre/search change
  useEffect(() => { setPage(1); }, [searchQuery, selectedCategory, statusFilter, sortField, sortOrder]);
  const handleEditBook = (id: string) => {
    router.push(`/admin/books/${id}/edit`);
  };

  return {
    books: data, error: customError || getErrorMessage(error), isError, isSuccess, refetch,
    pageSize, page, pageCount, paginatedBooks, isLoading, searchQuery,
    selectedCategory, sortOrder, statusFilter, sortField, showFilters, categories, filteredAndSortedBooks,
    setShowFilters, setSortOrder, setSortField, setStatusFilter, setSelectedCategory,
    setError, setSearchQuery, handleToggleActive, handleEditBook, setPage,
  };
}