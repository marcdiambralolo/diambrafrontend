'use client';
import { GameState } from '@/lib/learning/interface';
import { useDiambraStore } from "@/lib/store/diambra.store";
import { useCallback, useEffect, useState } from 'react';
import useGameActions from './useGameActions';
import useGameMetrics from './useGameMetrics';
import useMatchManagement from './useMatchManagement';

const useGameState = () => {
    const [state, setState] = useState<GameState>({
        tpsglobal: 0,
        casesdujeuencours: [],
        casesinitiales: [],
        pieces: [],
        selectedCase: null,
        datedebut: "",
        start: false,
        showPun: false,
        matchEnCours: -1,
        infomatch: [],
        isGameover: false,
        isTransitioning: false,
    });

    const updateState = useCallback((updates: Partial<GameState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    return { state, setState, updateState };
};

export const useGameGenerator = () => {
    const { gameConfig } = useDiambraStore();
    const { state, setState, updateState } = useGameState();
    const { selectCase, toggleShowPun, lockSelectedCase } = useGameActions(state, setState, updateState);
    const { timeElapsed } = useMatchManagement(state, setState, updateState);
    const metrics = useGameMetrics(state);

    useEffect(() => {
        if (!state.start) updateState({ start: true });
    }, [state.start, updateState]);

    return {
        toggleShowPun, lockSelectedCase, selectCase, timeElapsed,
        casesdujeuencours: state.casesdujeuencours,
        casesinitiales: state.casesinitiales,
        pieces: state.pieces,
        selectedCase: state.selectedCase,
        showPun: state.showPun,
        tpsglobal: state.tpsglobal,
        niveau: gameConfig?.niveau,
        currentGameType: metrics.currentGameType,
        progression: metrics.progression,
        lockedCount: metrics.lockedCount,
        totalCount: metrics.totalCount,
        hasCases: metrics.hasCases,
    };
};

export default useGameGenerator;