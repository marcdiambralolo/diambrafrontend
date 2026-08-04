'use client';
import { useCallback, useEffect, useRef } from "react";

// Clé unique globale alignée avec les autres hooks
const ACTIVE_VALIDATED_GAME_KEY = 'active_validated_competition_id';
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
            // Déclenche le rafraîchissement uniquement si la clé de compétition validée a changé
            if (e.key === ACTIVE_VALIDATED_GAME_KEY) {
                refreshData();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [refreshData]);

    return { refreshData };
};

export default useCompetitionPolling;