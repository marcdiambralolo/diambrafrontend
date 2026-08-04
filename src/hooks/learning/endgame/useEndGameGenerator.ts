'use client';
import { processUserData } from '@/lib/functions';
import { useAuth } from '@/lib/hooks';
import { useDiambraStore } from "@/lib/store/diambra.store";
import { useCallback, useMemo } from "react";
import useCompetitionList from "./useCompetitionList";
import useCompetitionPolling from "./useCompetitionPolling";
import usePaginationWithLoadMore from "./usePaginationWithLoadMore";

export const useEndGameGenerator = () => {
    const { refreshCompetitions } = useDiambraStore();
    const { user } = useAuth();
    const processedData = useMemo(() => processUserData(user), [user]);

    const competitions = useCompetitionList();

    const refreshData = useCallback(() => {
        if (refreshCompetitions) {
            refreshCompetitions();
        }
    }, [refreshCompetitions]);

    useCompetitionPolling(refreshData);

    const {
        handleLoadMoreClick,
        displayList, hasMore, remainingCount, isLoadingMore,
    } = usePaginationWithLoadMore(competitions);

    return {
        handleLoadMoreClick, competitionList: displayList,
        hasMore, remainingCount, isLoadingMore, user: processedData,
    };
};

export default useEndGameGenerator;