import useTimer from "@/hooks/learning/endgame/useTimer";
import { Case, CompetitionInfo, MatchInfo } from '@/lib/interfaces';
import { choix } from "@/lib/learning/functions";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const TRANSITION_DELAY = 100;

export const useGameGenerator = () => {
    const {
        currentMatchInfo,
        addCompetition,
        gameConfig,setLejeu,setJeuenattente,
        clearCurrentMatchInfo,
    } = useMonEtoileStore();

    const [state, setState] = useState({
        tpsglobal: 0,
        casesdujeuencours: [] as Case[],
        casesinitiales: [] as Case[],
        pieces: [] as string[],
        selectedCase: null as Case | null,
        datedebut: "",
        start: false,
        showPun: false,
        matchEnCours: 0,
        infomatch: [] as MatchInfo[],
        isTransitioning: false,
        isLoading: true,
        matchestermine: false,
    });

    const lancementRef = useRef(false);
    const isLoadingMatch = useRef(false);
    const allMatchesFinishedRef = useRef(false);
    const timeElapsed = useTimer(state.start);

    const updateState = useCallback((updates: Partial<typeof state>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    const allMatchesFinished = useMemo(() =>
       ( state.infomatch.length > 0 && state.infomatch.every(m => m.isgameover === true))||state.matchestermine,
        [state.infomatch]
    );

    // ============================================================================
    // LOGIQUE DE JEU
    // ============================================================================

    const swapCases = useCallback((c1: Case, c2: Case) => {
        const { casesdujeuencours, casesinitiales } = state;
        if (!c1 || !c2 || casesinitiales.length === 0) return;

        const index1 = casesdujeuencours.findIndex(c => c.id === c1.id);
        const index2 = casesdujeuencours.findIndex(c => c.id === c2.id);
        if (index1 === -1 || index2 === -1 || index1 >= casesinitiales.length || index2 >= casesinitiales.length) return;

        setState(prev => ({
            ...prev,
            casesdujeuencours: prev.casesdujeuencours.map((c, idx) => {
                if (idx === index1) {
                    return { ...c, txt: c2.txt, isLocked: false, isSelected: false };
                }
                if (idx === index2) {
                    const shouldLock = prev.casesinitiales[idx]?.txt === c1.txt;
                    return { ...c, txt: c1.txt, isLocked: shouldLock, isSelected: false };
                }
                return c;
            }),
        }));
    }, [state]);

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
    }, []);

    const toggleShowPun = useCallback(() => {
        setState(prev => ({ ...prev, showPun: !prev.showPun, selectedCase: null }));
        if (!state.showPun) shuffleUnlockedCases();
    }, [state.showPun, shuffleUnlockedCases]);

    // ============================================================================
    // CHARGEMENT D'UN MATCH
    // ============================================================================

    const chargerMatch = useCallback((matchData: MatchInfo) => {
        if (!matchData) return;
        updateState({
            tpsglobal: matchData.tpsglobal ?? 0,
            casesdujeuencours: matchData.listeCaseOpLab ?? [],
            casesinitiales: matchData.listeCaseOpLabInitiale ?? [],
            pieces: matchData.pieces ?? [],
            selectedCase: null,
            showPun: false,
        });
    }, [updateState]);

    // ============================================================================
    // INITIALISATION À PARTIR DU STORE
    // ============================================================================

    useEffect(() => {
        if (lancementRef.current) return;
        lancementRef.current = true;

        const initGame = () => {
            if (currentMatchInfo && currentMatchInfo.length > 0) {
                updateState({
                    infomatch: currentMatchInfo,
                    datedebut: new Date().toISOString(),
                    matchEnCours: 0,
                    isLoading: false,
                });
                if (currentMatchInfo[0]) chargerMatch(currentMatchInfo[0]);
            } else {
                console.error("Aucun match disponible dans le store");
                updateState({ isLoading: false });
            }
        };

        initGame();
    }, [currentMatchInfo, chargerMatch, updateState]);

    // Démarrer le timer
    useEffect(() => {
        if (!state.start && state.infomatch.length > 0) {
            updateState({ start: true });
        }
    }, [state.start, state.infomatch.length, updateState]);

    // Charger un match
    useEffect(() => {
        const { matchEnCours, infomatch } = state;
        if (matchEnCours === -1 || !infomatch[matchEnCours] || isLoadingMatch.current) return;

        isLoadingMatch.current = true;
        updateState({ isLoading: true });
        chargerMatch(infomatch[matchEnCours]);
        setTimeout(() => {
            isLoadingMatch.current = false;
            updateState({ isTransitioning: false, isLoading: false });
        }, TRANSITION_DELAY);
    }, [state.matchEnCours, state.infomatch, chargerMatch, updateState]);

    // Vérifier la fin d'un match et passer au suivant
    useEffect(() => {
        const { casesdujeuencours, isTransitioning, matchEnCours, infomatch } = state;
        if (casesdujeuencours.length === 0 || isTransitioning) return;
        if (!casesdujeuencours.every(c => c.isLocked)) return;

        updateState({ isTransitioning: true, isLoading: true });
        
        const completedCount = casesdujeuencours.filter(c => c.isLocked).length;
        
        setState(prev => ({
            ...prev,
            infomatch: prev.infomatch.map((m, idx) =>
                idx === matchEnCours ? { ...m, isgameover: true, trouves: (m.trouves || 0) + completedCount } : m
            ),
        }));

        if (matchEnCours + 1 < infomatch.length) {
            console.log(`✅ Match ${matchEnCours} terminé. Passage au match ${matchEnCours + 1}`);
            setTimeout(() => {
                updateState({ matchEnCours: matchEnCours + 1, showPun: false, selectedCase: null, isLoading: false });
            }, TRANSITION_DELAY);
        } else {
            console.log(`✅ Tous les matchs terminés.`);
            setTimeout(() => {
                updateState({ isLoading: false, matchestermine: true });
            }, TRANSITION_DELAY);
        }
    }, [state.casesdujeuencours, state.isTransitioning, state.matchEnCours, state.infomatch, updateState]);

    // Sauvegarder la compétition quand tous les matchs sont terminés
    useEffect(() => {
        if (allMatchesFinished && state.infomatch.length > 0 && !allMatchesFinishedRef.current) {
            allMatchesFinishedRef.current = true;
            
            const competitionId = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
            const competition: CompetitionInfo = {
                id: competitionId,
                matchInfo: state.infomatch,
                datedebut: state.datedebut,
                datefin: new Date().toISOString()
            };
            
            addCompetition(competition);
            console.log('✅ Compétition sauvegardée:', competitionId);
            setLejeu(false);
            setJeuenattente(true);
            window.location.href="/star/learning"; // Recharger la page pour réinitialiser le jeu
            // Nettoyer le store après sauvegarde
           // clearCurrentMatchInfo();
        }
    }, [allMatchesFinished, state.infomatch, state.datedebut, addCompetition, clearCurrentMatchInfo]);

    // ============================================================================
    // VALEURS MÉMORISÉES
    // ============================================================================

    const currentGameType = useMemo(() => {
        const { infomatch, matchEnCours } = state;
        if (!infomatch?.length || matchEnCours === undefined || !infomatch[matchEnCours]) {
            return "Aucun match en cours";
        }
        return choix(infomatch[matchEnCours].tpsglobal || 0);
    }, [state.infomatch, state.matchEnCours]);

    const progression = useMemo(() => {
        if (state.casesdujeuencours.length === 0) return 0;
        const lockedCount = state.casesdujeuencours.filter(c => c.isLocked).length;
        return (lockedCount / state.casesdujeuencours.length) * 100;
    }, [state.casesdujeuencours]);

    // ============================================================================
    // RETURN
    // ============================================================================

    return {
        toggleShowPun,
        lockSelectedCase,
        selectCase,
        niveau: gameConfig?.niveau,
        showPun: state.showPun,
        timeElapsed,
        matchEnCours: state.matchEnCours,
        infomatch: state.infomatch,
        tpsglobal: state.tpsglobal,
        casesdujeuencours: state.casesdujeuencours,
        casesinitiales: state.casesinitiales,
        pieces: state.pieces,
        selectedCase: state.selectedCase,
        allMatchesFinished,
        currentGameType,
        progression,
        isLoading: state.isLoading,
    };
};