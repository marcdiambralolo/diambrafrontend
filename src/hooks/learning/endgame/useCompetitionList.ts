'use client';
import { useDiambraStore } from "@/lib/store/diambra.store";
import { useCallback, useMemo, useState } from "react";

const STORAGE_PREFIX = 'validated_competition_';

const isCompetitionValidated = (competitionId: string): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(getValidationStorageKey(competitionId)) === 'true';
};

const getValidationStorageKey = (competitionId: string): string =>
    `${STORAGE_PREFIX}${competitionId}`;

const useCompetitionStorage = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const updateLocalCache = useCallback((competitionId: string) => {
        localStorage.setItem(getValidationStorageKey(competitionId), 'true');
        setRefreshKey(prev => prev + 1);
    }, []);

    const isCompetitionValidatedMemo = useCallback((competitionId: string) => {
        return isCompetitionValidated(competitionId);
    }, []);

    return {
        refreshKey, updateLocalCache, isCompetitionValidated: isCompetitionValidatedMemo,
    };
};

const useCompetitionList = () => {
    const { getAllCompetitions, gameConfig } = useDiambraStore();
    const { refreshKey, isCompetitionValidated } = useCompetitionStorage();

    return useMemo(() => {
        const allCompetitions = getAllCompetitions();
        return allCompetitions
            .filter(comp => comp.idConfig === gameConfig?.id)
            .map(comp => ({
                ...comp,
                displayName: `N°: ${comp.id.slice(-12)}`,
                isValidated: isCompetitionValidated(comp.id),
            }))
            .sort((a, b) => {
                if (a.isValidated !== b.isValidated) return a.isValidated ? -1 : 1;
                return new Date(b.datedebut).getTime() - new Date(a.datedebut).getTime();
            });
    }, [getAllCompetitions, gameConfig?.id, refreshKey, isCompetitionValidated]);
};

export default useCompetitionList;