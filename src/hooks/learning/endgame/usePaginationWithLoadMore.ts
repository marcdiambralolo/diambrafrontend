'use client';
import { INITIAL_VISIBLE_COUNT, LOAD_MORE_INCREMENT } from "@/lib/learning/constantes";
import { useCallback, useMemo, useState, useTransition } from "react";

const usePaginationWithLoadMore = <T extends { isValidated?: boolean }>(
    items: T[],
    initialCount: number = INITIAL_VISIBLE_COUNT,
    increment: number = LOAD_MORE_INCREMENT
) => {
    const [visibleCount, setVisibleCount] = useState(initialCount);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [, startTransition] = useTransition();

    const hasValidatedGame = items.some(item => item.isValidated);

    const displayList = useMemo(() => {
        if (hasValidatedGame) {
            return items.filter(item => item.isValidated);
        }
        return items.slice(0, visibleCount);
    }, [items, visibleCount, hasValidatedGame]);

    const hasMore = useMemo(() => {
        return !hasValidatedGame && visibleCount < items.length;
    }, [hasValidatedGame, visibleCount, items.length]);

    const remainingCount = items.length - visibleCount;

    const handleLoadMore = useCallback(() => {
        startTransition(() => {
            setVisibleCount(prev => Math.min(prev + increment, items.length));
        });
    }, [items.length, increment, startTransition]);

    const handleLoadMoreClick = useCallback(async () => {
        if (isLoadingMore) return;
        setIsLoadingMore(true);

        try {
            await handleLoadMore();
        } finally {
            setIsLoadingMore(false);
        }
    }, [handleLoadMore, isLoadingMore]);

    return {
        displayList, hasMore, remainingCount, hasValidatedGame, isLoadingMore,
        handleLoadMoreClick, resetPagination: () => setVisibleCount(initialCount),
    };
};

export default usePaginationWithLoadMore;