'use client';
import { choix } from "@/lib/learning/functions";
import { GameState } from '@/lib/learning/interface';
import { useMemo } from 'react';

export interface GameMetrics {
    currentGameType: string;
    progression: number;
    lockedCount: number;
    totalCount: number;
    hasCases: boolean;
}

export const useGameMetrics = (state: GameState): GameMetrics => {
    const { infomatch, matchEnCours, casesdujeuencours } = state;

    const currentGameType = useMemo(() => {
        if (!infomatch?.length || matchEnCours === undefined || !infomatch[matchEnCours]) {
            return "Aucun match en cours";
        }
        return choix(infomatch[matchEnCours].tpsglobal || 0);
    }, [infomatch, matchEnCours]);

    const { lockedCount, totalCount, progression, hasCases } = useMemo(() => {
        const total = casesdujeuencours?.length ?? 0;

        if (total === 0) {
            return {
                lockedCount: 0,
                totalCount: 0,
                progression: 0,
                hasCases: false,
            };
        }

        let locked = 0;
        for (let i = 0; i < total; i++) {
            if (casesdujeuencours[i].isLocked) {
                locked++;
            }
        }

        const calculatedProgression = Math.round((locked / total) * 100);

        return {
            lockedCount: locked,
            totalCount: total,
            progression: calculatedProgression,
            hasCases: true,
        };
    }, [casesdujeuencours]);

    return { currentGameType, progression, lockedCount, totalCount, hasCases, };
};

export default useGameMetrics;