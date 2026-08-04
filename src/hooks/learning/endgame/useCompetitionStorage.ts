'use client';
import { useCallback, useState } from "react";

// Clé unique globale pour ne garder qu'une seule compétition validée
const ACTIVE_VALIDATED_GAME_KEY = 'active_validated_competition_id';

const isCompetitionValidated = (competitionId: string): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(ACTIVE_VALIDATED_GAME_KEY) === competitionId;
};

const useCompetitionStorage = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const updateLocalCache = useCallback((competitionId: string) => {
        // Enregistre la nouvelle compétition validée (écrase l'ancienne)
        localStorage.setItem(ACTIVE_VALIDATED_GAME_KEY, competitionId);
        setRefreshKey(prev => prev + 1);
    }, []);

    const isCompetitionValidatedMemo = useCallback((competitionId: string) => {
        return isCompetitionValidated(competitionId);
    }, []);

    return {
        refreshKey, 
        updateLocalCache, 
        isCompetitionValidated: isCompetitionValidatedMemo,
    };
};

export default useCompetitionStorage;