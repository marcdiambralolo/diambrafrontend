'use client';
import { useCallback, useState } from "react";

const STORAGE_PREFIX = 'validated_competition_';

const getValidationStorageKey = (competitionId: string): string => `${STORAGE_PREFIX}${competitionId}`;

const isCompetitionValidated = (competitionId: string): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(getValidationStorageKey(competitionId)) === 'true';
};

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

export default useCompetitionStorage;