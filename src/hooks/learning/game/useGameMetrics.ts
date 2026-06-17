'use client';
import { choix } from "@/lib/learning/functions";
import { GameState } from '@/lib/learning/interface';
import { useMemo } from 'react';

const useGameMetrics = (state: GameState) => {
    const currentGameType = useMemo(() => {
        const { infomatch, matchEnCours } = state;

        if (!infomatch?.length || matchEnCours === undefined || !infomatch[matchEnCours]) {
            return "Aucun match en cours";
        }
        return choix(infomatch[matchEnCours].tpsglobal || 0);
    }, [state.infomatch, state.matchEnCours]);

    const progression = useMemo(() => {
        if (state.casesdujeuencours.length === 0) return 0;
        return (state.casesdujeuencours.filter(c => c.isLocked).length / state.casesdujeuencours.length) * 100;
    }, [state.casesdujeuencours]);

    const lockedCount = useMemo(() =>
        state.casesdujeuencours.filter(c => c.isLocked).length,
        [state.casesdujeuencours]
    );

    const totalCount = state.casesdujeuencours.length;
    const hasCases = totalCount > 0;

    return {
        currentGameType, progression, lockedCount, totalCount, hasCases,
    };
};

export default useGameMetrics;