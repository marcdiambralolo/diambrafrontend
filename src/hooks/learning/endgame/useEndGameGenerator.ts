'use client';
import { useDiambraStore } from "@/lib/store/diambra.store";
import { useCallback } from "react";
import useCompetitionList from "./useCompetitionList";
import useCompetitionPolling from "./useCompetitionPolling";
import usePaginationWithLoadMore from "./usePaginationWithLoadMore";

export const useEndGameGenerator = () => {
    const { refreshCompetitions } = useDiambraStore();

    const competitions = useCompetitionList();

    const refreshData = useCallback(() => {
        if (refreshCompetitions) {
            refreshCompetitions();
        }
    }, [refreshCompetitions]);

    useCompetitionPolling(refreshData);

    const {
        handleLoadMoreClick,
        displayList, hasMore, remainingCount, hasValidatedGame, isLoadingMore,
    } = usePaginationWithLoadMore(competitions);

    return {
        handleLoadMoreClick, competitionList: displayList,
        hasMore, remainingCount, isLoadingMore, hasValidatedGame,
    };
};

export default useEndGameGenerator;