'use client';
import { Case } from '@/lib/interfaces';
import { GameState } from '@/lib/learning/interface';
import { useCallback } from 'react';

const useGameActions = (
    state: GameState,
    setState: React.Dispatch<React.SetStateAction<GameState>>,
    updateState: (updates: Partial<GameState>) => void
) => {
    const swapCases = useCallback((c1: Case, c2: Case) => {
        const { casesdujeuencours, casesinitiales } = state;
        if (!c1 || !c2 || casesinitiales.length === 0) return;

        const index1 = casesdujeuencours.findIndex(c => c.id === c1.id);
        const index2 = casesdujeuencours.findIndex(c => c.id === c2.id);
        if (index1 === -1 || index2 === -1 ||
            index1 >= casesinitiales.length || index2 >= casesinitiales.length) return;

        setState(prev => ({
            ...prev,
            casesdujeuencours: prev.casesdujeuencours.map((c, idx) => {
                if (idx === index1) {
                    const newTxt = c2.txt;
                    const shouldLock = prev.casesinitiales[idx]?.txt === newTxt;
                    return { ...c, txt: newTxt, isLocked: shouldLock, isSelected: false };
                }
                if (idx === index2) {
                    const newTxt = c1.txt;
                    const shouldLock = prev.casesinitiales[idx]?.txt === newTxt;
                    return { ...c, txt: newTxt, isLocked: shouldLock, isSelected: false };
                }
                return c;
            }),
        }));
    }, [state, setState]);

    const selectCase = useCallback((c: Case | null) => {
        if (!c || c.isLocked) return updateState({ selectedCase: null });
        if (!state.selectedCase) return updateState({ selectedCase: c });
        swapCases(state.selectedCase, c);
        updateState({ selectedCase: null });
    }, [state.selectedCase, swapCases, updateState]);

    const lockSelectedCase = useCallback(() => {
        const { selectedCase, casesdujeuencours, casesinitiales } = state;
        if (!selectedCase || casesinitiales.length === 0) return updateState({ selectedCase: null });

        const index = casesdujeuencours.findIndex(c => c.id === selectedCase.id);
        if (index === -1 || index >= casesinitiales.length) return updateState({ selectedCase: null });
        if (selectedCase.txt !== casesinitiales[index]?.txt) return updateState({ selectedCase: null });

        updateState({
            casesdujeuencours: casesdujeuencours.map(c =>
                c.id === selectedCase.id ? { ...c, isLocked: true, isSelected: false } : c
            ),
            selectedCase: null,
        });
    }, [state, updateState]);

    const shuffleUnlockedCases = useCallback(() => {
        setState(prev => {
            const shuffled = [...prev.casesdujeuencours];
            for (let i = shuffled.length - 1; i > 0; i--) {
                if (shuffled[i].isLocked) continue;
                let j = Math.floor(Math.random() * (i + 1));
                let attempts = 0;
                while (shuffled[j].isLocked && attempts < shuffled.length) {
                    j = Math.floor(Math.random() * (i + 1));
                    attempts++;
                }
                if (!shuffled[j].isLocked && i !== j) {
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
            }
            return { ...prev, casesdujeuencours: shuffled };
        });
    }, [setState]);

    const toggleShowPun = useCallback(() => {
        updateState({ showPun: !state.showPun, selectedCase: null });
        if (!state.showPun) shuffleUnlockedCases();
    }, [state.showPun, shuffleUnlockedCases, updateState]);

    return {
        selectCase, toggleShowPun, lockSelectedCase, swapCases, shuffleUnlockedCases,
    };
};

export default useGameActions;