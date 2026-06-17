
import { ITEMS_PER_PAGE } from '@/lib/learning/constantes';
import { useCallback, useMemo, useState } from 'react'; 

interface UsePaginationReturn<T> {
    currentPage: number;
    totalPages: number;
    paginatedItems: T[];
    setCurrentPage: (page: number) => void;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
    goToFirstPage: () => void;
    goToLastPage: () => void;
}

export function usePagination<T>(
    items: T[],
    itemsPerPage: number = ITEMS_PER_PAGE
): UsePaginationReturn<T> {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = useMemo(() =>
        Math.max(1, Math.ceil(items.length / itemsPerPage)),
        [items.length, itemsPerPage]
    );

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    }, [items, currentPage, itemsPerPage]);

    const goToNextPage = useCallback(() => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }, [totalPages]);

    const goToPreviousPage = useCallback(() => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }, []);

    const goToFirstPage = useCallback(() => {
        setCurrentPage(1);
    }, []);

    const goToLastPage = useCallback(() => {
        setCurrentPage(totalPages);
    }, [totalPages]);

    return {
        currentPage,
        totalPages,
        paginatedItems,
        setCurrentPage,
        goToNextPage,
        goToPreviousPage,
        goToFirstPage,
        goToLastPage,
    };
}