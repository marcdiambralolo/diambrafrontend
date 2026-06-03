import { CompetitionInfo, LearningConfiguration, MatchInfo } from '@/lib/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// CONSTANTES
// ============================================================================

const MAX_COMPETITIONS = 10;

// ============================================================================
// TYPE PERSISTANCE ALLÉGÉ
// ============================================================================

interface StoredCompetition {
    id: string;
    datedebut: string;
    datefin: string;
    matchInfo: Array<{
        id?: string;
        tpsglobal?: number;
        trouves?: number;
        rates?: number;
        isgameover?: boolean;
        timeSpent?: number;
        matchNumber?: number;
    }>;
}

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface MonEtoileStore {
    // Consultation
    currentConsultationId: string | null;
    setCurrentConsultationId: (id: string | null) => void;

    // Configuration du jeu
    gameConfig: LearningConfiguration | null;
    setGameConfig: (config: LearningConfiguration | null) => void;

    // 🆕 Match info courant (pour le jeu en cours)
    currentMatchInfo: MatchInfo[];
    setCurrentMatchInfo: (matches: MatchInfo[]) => void;
    appendMatchInfo: (match: MatchInfo) => void;
    updateMatchInfo: (index: number, match: Partial<MatchInfo>) => void;
    clearCurrentMatchInfo: () => void;
    getCurrentMatchByType: (tpsglobal: number) => MatchInfo | undefined;

    // Set de compétitions (tableau limité à 10)
    competitions: CompetitionInfo[];

    // Actions pour les compétitions
    addCompetition: (competition: CompetitionInfo) => void;
    getCompetitionById: (id: string) => CompetitionInfo | undefined;
    removeCompetitionById: (id: string) => boolean;
    getAllCompetitions: () => CompetitionInfo[];
    getLatestCompetitions: (limit?: number) => CompetitionInfo[];
    clearAllCompetitions: () => void;
    addMultipleCompetitions: (newCompetitions: CompetitionInfo[]) => void;

    // États du jeu
    gameStarted: boolean;
    setGameStarted: (gameStarted: boolean) => void;

    jeuAcommencer: boolean;
    setJeuAcommencer: (jeuAcommencer: boolean) => void;

    afficheaide: boolean;
    setAfficheaide: (afficheaide: boolean) => void;

    lejeu: boolean;
    setLejeu: (lejeu: boolean) => void;
    lamise: boolean;
    setLamise: (lamise: boolean) => void;

    jeuenattente: boolean;
    setJeuenattente: (jeuenattente: boolean) => void;

    // Actions globales
    startGame: () => void;
    stopGame: () => void;
    startCompetition: () => void;
    stopCompetition: () => void;
    afficherAide: () => void;
    afficherJeu: () => void;
    resetGameState: () => void;
    resetAll: () => void;
}

// ============================================================================
// FONCTIONS DE COMPRESSION
// ============================================================================

const compressCompetition = (competition: CompetitionInfo): StoredCompetition => {
    return {
        id: competition.id,
        datedebut: competition.datedebut,
        datefin: competition.datefin,
        matchInfo: competition.matchInfo.map(match => ({
            id: match.id,
            tpsglobal: match.tpsglobal,
            trouves: match.trouves,
            rates: match.rates,
            isgameover: match.isgameover,
            timeSpent: match.timeSpent,
            matchNumber: match.matchNumber,
        })),
    };
};

const decompressCompetition = (stored: StoredCompetition): CompetitionInfo => {
    return {
        id: stored.id,
        datedebut: stored.datedebut,
        datefin: stored.datefin,
        matchInfo: stored.matchInfo.map(match => ({
            id: match.id,
            tpsglobal: match.tpsglobal,
            trouves: match.trouves,
            rates: match.rates,
            isgameover: match.isgameover,
            timeSpent: match.timeSpent,
            matchNumber: match.matchNumber,
            score: match.trouves || 0,
            listeCaseOpLab: [],
            listeCaseOpLabInitiale: [],
            pieces: [],
        })) as any,
    };
};

const isStorageNearLimit = (): boolean => {
    try {
        const testKey = '__size_test__';
        const testData = 'x'.repeat(1024 * 1024);
        localStorage.setItem(testKey, testData);
        localStorage.removeItem(testKey);
        return false;
    } catch (e) {
        return true;
    }
};

// ============================================================================
// ÉTAT INITIAL
// ============================================================================

const INITIAL_STATE = {
    currentConsultationId: null,
    gameConfig: null,
    currentMatchInfo: [] as MatchInfo[],
    competitions: [] as CompetitionInfo[],
    gameStarted: false,
    jeuAcommencer: false,
    afficheaide: false,
    jeuenattente: true,
    lejeu: false,
    lamise: false,
};

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

const sortByDateDesc = (a: CompetitionInfo, b: CompetitionInfo): number => {
    return new Date(b.datedebut).getTime() - new Date(a.datedebut).getTime();
};

const enforceMaxLimit = (competitions: CompetitionInfo[]): CompetitionInfo[] => {
    if (competitions.length <= MAX_COMPETITIONS) return competitions;
    const sorted = [...competitions].sort(sortByDateDesc);
    return sorted.slice(0, MAX_COMPETITIONS);
};

// ============================================================================
// STORE
// ============================================================================

export const useMonEtoileStore = create<MonEtoileStore>()(
    persist(
        (set, get) => ({
            ...INITIAL_STATE,

            // ========================================================================
            // ACTIONS CONSULTATION
            // ========================================================================

            setCurrentConsultationId: (id) => set({ currentConsultationId: id }),

            // ========================================================================
            // ACTIONS GAME CONFIG
            // ========================================================================

            setGameConfig: (config) => set({ gameConfig: config }),

            // ========================================================================
            // 🆕 ACTIONS MATCH INFO
            // ========================================================================

            setCurrentMatchInfo: (matches) => set({ currentMatchInfo: matches }),

            appendMatchInfo: (match) => set(state => ({
                currentMatchInfo: [...state.currentMatchInfo, match]
            })),

            updateMatchInfo: (index, updatedMatch) => set(state => {
                const newMatches = [...state.currentMatchInfo];
                if (index >= 0 && index < newMatches.length) {
                    newMatches[index] = { ...newMatches[index], ...updatedMatch };
                }
                return { currentMatchInfo: newMatches };
            }),

            clearCurrentMatchInfo: () => set({ currentMatchInfo: [] }),

            getCurrentMatchByType: (tpsglobal) => {
                return get().currentMatchInfo.find(match => match.tpsglobal === tpsglobal);
            },

            // ========================================================================
            // ACTIONS COMPETITIONS
            // ========================================================================

            addCompetition: (competition: CompetitionInfo) => {
                set(state => {
                    const exists = state.competitions.some(c => c.id === competition.id);
                    if (exists) {
                        console.warn(`Competition with id ${competition.id} already exists`);
                        return state;
                    }

                    let newCompetitions = [competition, ...state.competitions];
                    newCompetitions = enforceMaxLimit(newCompetitions);

                    if (isStorageNearLimit()) {
                        console.warn('Storage near limit, clearing old competitions');
                        newCompetitions = newCompetitions.slice(0, MAX_COMPETITIONS - 2);
                    }

                    return { competitions: newCompetitions };
                });
            },

            getCompetitionById: (id: string) => {
                return get().competitions.find(c => c.id === id);
            },

            removeCompetitionById: (id: string) => {
                let removed = false;
                set(state => {
                    const newCompetitions = state.competitions.filter(c => c.id !== id);
                    removed = newCompetitions.length !== state.competitions.length;
                    return { competitions: newCompetitions };
                });
                return removed;
            },

            getAllCompetitions: () => {
                return get().competitions;
            },

            getLatestCompetitions: (limit: number = MAX_COMPETITIONS) => {
                const competitions = get().competitions;
                return [...competitions].sort(sortByDateDesc).slice(0, limit);
            },

            clearAllCompetitions: () => {
                set({ competitions: [] });
            },

            addMultipleCompetitions: (newCompetitions: CompetitionInfo[]) => {
                set(state => {
                    const existingIds = new Set(state.competitions.map(c => c.id));
                    const uniqueNewCompetitions = newCompetitions.filter(c => !existingIds.has(c.id));
                    let allCompetitions = [...uniqueNewCompetitions, ...state.competitions];
                    allCompetitions = enforceMaxLimit(allCompetitions);
                    return { competitions: allCompetitions };
                });
            },

            // ========================================================================
            // ACTIONS ÉTATS
            // ========================================================================

            setGameStarted: (gameStarted) => set({ gameStarted }),
            setJeuAcommencer: (jeuAcommencer) => set({ jeuAcommencer }),
            setAfficheaide: (afficheaide) => set({ afficheaide }),
            setJeuenattente: (jeuenattente) => set({ jeuenattente }),
            setLejeu: (lejeu) => set({ lejeu }),
            setLamise: (lamise) => set({ lamise }),

            // ========================================================================
            // ACTIONS AIDE
            // ========================================================================

            afficherAide: () => set({ afficheaide: true }),
            afficherJeu: () => set({ afficheaide: false }),

            // ========================================================================
            // ACTIONS JEU
            // ========================================================================

            startGame: () => set({
                gameStarted: true,
                jeuAcommencer: true,
                afficheaide: false
            }),

            stopGame: () => set({
                gameStarted: false,
                jeuAcommencer: false
            }),

            startCompetition: () => set({
                jeuAcommencer: false,
                gameStarted: false,
                afficheaide: false
            }),

            stopCompetition: () => set({
                jeuAcommencer: false,
            }),

            // ========================================================================
            // ACTIONS RÉINITIALISATION
            // ========================================================================

            resetGameState: () => set({
                
                gameStarted: false,
                jeuAcommencer: false,
                afficheaide: false,
               
            }),

            resetAll: () => set({
                ...INITIAL_STATE,
                competitions: [],
                currentMatchInfo: [],
            }),
        }),
        {
            name: 'monetoile-store',
            partialize: (state) => {
                const compressedCompetitions = state.competitions.map(compressCompetition);

                return {
                    currentConsultationId: state.currentConsultationId,
                    gameConfig: state.gameConfig,
                    competitions: compressedCompetitions,
                    // ⚠️ Ne pas persister currentMatchInfo (trop volumineux)
                };
            },
            onRehydrateStorage: () => (state) => {
                if (state && state.competitions) {
                    try {
                        state.competitions = (state.competitions as any).map(decompressCompetition);
                        state.competitions = enforceMaxLimit(state.competitions);
                    } catch (error) {
                        console.error('Error decompressing competitions:', error);
                        state.competitions = [];
                    }
                }
                if (state) {
                    state.competitions = state.competitions || [];
                    state.currentMatchInfo = state.currentMatchInfo || []; // Initialiser si null
                }
            },
        }
    )
);