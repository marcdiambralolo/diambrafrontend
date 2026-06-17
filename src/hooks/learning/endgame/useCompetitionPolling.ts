'use client';
import { useCallback, useEffect, useRef } from "react";

const STORAGE_PREFIX = 'validated_competition_';
const REFETCH_INTERVAL = 1000;
const DEBOUNCE_DELAY = 100;

const useCompetitionPolling = (onRefresh: () => void) => {
    const isRefreshingRef = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const refreshData = useCallback(() => {
        if (isRefreshingRef.current) return;
        isRefreshingRef.current = true;

        onRefresh();

        timeoutRef.current = setTimeout(() => {
            isRefreshingRef.current = false;
        }, DEBOUNCE_DELAY);
    }, [onRefresh]);

    useEffect(() => {
        const intervalId = setInterval(refreshData, REFETCH_INTERVAL);
        return () => {
            clearInterval(intervalId);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [refreshData]);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key?.startsWith(STORAGE_PREFIX)) {
                refreshData();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [refreshData]);

    return { refreshData };
};

export default useCompetitionPolling;