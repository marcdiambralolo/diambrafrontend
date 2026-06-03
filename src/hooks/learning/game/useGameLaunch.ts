import { MatchInfo } from '@/lib/interfaces';
import { decoupelimage } from "@/lib/learning/functions";
import { createInitialCases, createMatch, createPlayableCases, getTotalCases, shuffleArray } from "@/lib/learning/services/game.service";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useCallback, useEffect, useRef, useState } from 'react';

const GLOBAL_GAME_ORDER = [0, 3, 1, 2] as const;

export const useGameLauncher = () => {
    const { gameConfig, setCurrentMatchInfo, clearCurrentMatchInfo } = useMonEtoileStore();

    const [state, setState] = useState({
        isLoading: true,
    });

    const lancementRef = useRef(false);

    const updateState = useCallback((updates: Partial<typeof state>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    const generateMatchList = useCallback((): MatchInfo[] => {
        const matchId = gameConfig?.numeromatch || "123456789";
        return GLOBAL_GAME_ORDER.map((type, index) => createMatch(type, index, matchId));
    }, [gameConfig?.numeromatch]);

    const loadMatch = useCallback(async (match: MatchInfo, niveau: number, piecesImages: string[]): Promise<MatchInfo> => {
        const totalCases = getTotalCases(match.tpsglobal!, niveau);
        const gridSize = niveau * niveau;
        const seed = parseInt(match.numeromatch!) + 7;

        let availableCases = Array.from({ length: totalCases }, (_, i) => i.toString());

        if (match.tpsglobal !== 2) {
            availableCases = shuffleArray(availableCases, seed);
        }

        const selectedCases = availableCases.slice(0, gridSize);
        let shuffledCases = shuffleArray([...selectedCases], seed);

        match.listeCaseOpLab = createPlayableCases(shuffledCases, selectedCases, match);
        match.listeCaseOpLabInitiale = createInitialCases(selectedCases, match);
        match.pieces = piecesImages;

        return match;
    }, []);

    useEffect(() => {
        if (lancementRef.current) return;
        lancementRef.current = true;

        const lancerJeu = async () => {
            updateState({ isLoading: true });

            try {
                const matchList = generateMatchList();
                const piecesImages = await decoupelimage("/ephotoquatorze.jpg", gameConfig?.niveau!);
                const updatedMatches = await Promise.all(
                    matchList.map(match => loadMatch(match, gameConfig?.niveau!, piecesImages))
                );
                clearCurrentMatchInfo();
                setCurrentMatchInfo(updatedMatches);
                updateState({
                    isLoading: false,
                });
            } catch (error) {
                console.error("Erreur:", error);
                updateState({ isLoading: false });
            } finally {
                lancementRef.current = false;
            }
        };

        lancerJeu();
    }, [gameConfig?.niveau, generateMatchList, loadMatch, updateState, setCurrentMatchInfo]);

    return {
        isLoading: state.isLoading,
    };
};