import { CompetitionInfo, LearningConfiguration, MatchInfo } from '@/lib/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_COMPETITIONS = 10;
const STORAGE_NAME = 'diambra-store';

interface StoredMatchInfo {
    id?: string;
    tpsglobal?: number;
    trouves?: number;
    rates?: number;
    isgameover?: boolean;
    timeSpent?: number;
    matchNumber?: number;
    niveau?: number;
    numeromatch?: string;
    datedebut?: string | null;
    datefin?: string | null;
    combinaisons?: string[];
    score?: number;
    numordrep?: number;
    entite?: number;
}

interface StoredCompetition {
    id: string;
    datedebut: string;
    datefin: string;
    idConfig: string;
    consultationId: string;
    timeSpent: number;
    displayName?: string;
    isValidated?: boolean;
    niveau?: number;
    matchInfo: StoredMatchInfo[];
}

interface MonEtoileStore {
    // État
    gameConfig: LearningConfiguration | null;
    isGameConfigLoaded: boolean; // ✅ NOUVEAU: Indique si la config a été chargée initialement
    currentMatchInfo: MatchInfo[];
    competitions: CompetitionInfo[];
    competitionsVersion: number;
    currentConsultationId: string | null;
    gameStarted: boolean;
    jeuAcommencer: boolean;
    afficheaide: boolean;
    jeuenattente: boolean;
    lejeu: boolean;
    lamise: boolean;
    afficheBanana: boolean;
    afficheStat: boolean;
    afficheChoix: boolean;
    afficheGame: boolean;
    gameIsFinished: boolean;

    // Actions - Configuration
    setGameConfig: (config: LearningConfiguration | null) => void;
    setIsGameConfigLoaded: (loaded: boolean) => void; // ✅ NOUVELLE ACTION
    resetGameConfig: () => void; // ✅ NOUVELLE ACTION: Réinitialise la config

    // Actions - Matchs
    setCurrentMatchInfo: (matches: MatchInfo[]) => void;
    appendMatchInfo: (match: MatchInfo) => void;
    updateMatchInfo: (index: number, match: Partial<MatchInfo>) => void;
    clearCurrentMatchInfo: () => void;
    getCurrentMatchByType: (tpsglobal: number) => MatchInfo | undefined;

    // Actions - Compétitions
    addCompetition: (competition: CompetitionInfo) => void;
    getCompetitionById: (id: string) => CompetitionInfo | undefined;
    removeCompetitionById: (id: string) => boolean;
    getAllCompetitions: () => CompetitionInfo[];
    getLatestCompetitions: (limit?: number) => CompetitionInfo[];
    addMultipleCompetitions: (newCompetitions: CompetitionInfo[]) => void;
    refreshCompetitions: () => void;
    updateCompetitionValidation: (id: string, isValidated: boolean) => void;

    // Actions - UI
    setAfficheBanana: (value: boolean) => void;
    setAfficheStat: (value: boolean) => void;
    setAfficheGame: (value: boolean) => void;
    setAfficheChoix: (value: boolean) => void;
    setGameIsFinished: (value: boolean) => void;
    setJeuAcommencer: (value: boolean) => void;
    setJeuenattente: (value: boolean) => void;
    setLejeu: (value: boolean) => void;
    setLamise: (value: boolean) => void;
    setAfficheAide: (value: boolean) => void;
    setGameStarted: (value: boolean) => void;
    setCurrentConsultationId: (id: string | null) => void;
    resetGameState: () => void;
    resetAll: () => void;
}

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

const compressCompetition = (competition: CompetitionInfo): StoredCompetition => ({
    id: competition.id,
    datedebut: competition.datedebut,
    datefin: competition.datefin,
    idConfig: competition.idConfig,
    consultationId: competition.consultationId,
    timeSpent: competition.timeSpent || 0,
    displayName: competition.displayName,
    isValidated: competition.isValidated,
    niveau: competition.niveau,
    matchInfo: competition.matchInfo.map(match => ({
        id: match.id,
        tpsglobal: match.tpsglobal,
        trouves: match.trouves,
        rates: match.rates,
        isgameover: match.isgameover,
        timeSpent: match.timeSpent,
        matchNumber: match.matchNumber,
        niveau: match.niveau,
        numeromatch: match.numeromatch,
        datedebut: match.datedebut,
        datefin: match.datefin,
        combinaisons: match.combinaisons || [],
        score: match.score,
        numordrep: match.numordrep,
        entite: match.entite,
    })),
});

const decompressCompetition = (stored: StoredCompetition): CompetitionInfo => ({
    id: stored.id,
    datedebut: stored.datedebut,
    datefin: stored.datefin,
    idConfig: stored.idConfig,
    consultationId: stored.consultationId,
    timeSpent: stored.timeSpent,
    displayName: stored.displayName || `N°: ${stored.id.slice(-12)}`,
    isValidated: stored.isValidated || false,
    niveau: stored.niveau,
    matchInfo: stored.matchInfo.map(match => ({
        id: match.id,
        tpsglobal: match.tpsglobal,
        trouves: match.trouves || 0,
        rates: match.rates || 0,
        isgameover: match.isgameover || false,
        timeSpent: match.timeSpent,
        matchNumber: match.matchNumber || 0,
        score: match.score || 0,
        niveau: match.niveau,
        numeromatch: match.numeromatch || '',
        datedebut: match.datedebut || null,
        datefin: match.datefin || null,
        combinaisons: match.combinaisons || [],
        numordrep: match.numordrep || 0,
        entite: match.entite || 0,
    })),
});

const isStorageNearLimit = (): boolean => {
    try {
        const testKey = '__size_test__';
        const testData = 'x'.repeat(1024 * 1024);
        localStorage.setItem(testKey, testData);
        localStorage.removeItem(testKey);
        return false;
    } catch {
        return true;
    }
};

// ============================================================================
// ÉTAT INITIAL
// ============================================================================

const INITIAL_STATE = {
    gameConfig: null,
    isGameConfigLoaded: false, // ✅ NOUVEAU: Initialisé à false
    currentMatchInfo: [] as MatchInfo[],
    competitions: [] as CompetitionInfo[],
    competitionsVersion: 0,
    currentConsultationId: null,
    gameStarted: false,
    jeuAcommencer: false,
    afficheaide: false,
    jeuenattente: true,
    lejeu: false,
    lamise: false,
    afficheBanana: false,
    afficheStat: false,
    gameIsFinished: false,
    afficheChoix: false,
    afficheGame: false,
};

// ============================================================================
// STORE
// ============================================================================

export const useDiambraStore = create<MonEtoileStore>()(
    persist(
        (set, get) => ({
            ...INITIAL_STATE,

            // ========================================================================
            // Configuration
            // ========================================================================

            setGameConfig: (config) => set({ 
                gameConfig: config,
                // Si on set une config, on la marque comme chargée
                isGameConfigLoaded: config !== null 
            }),

            setIsGameConfigLoaded: (loaded) => set({ isGameConfigLoaded: loaded }),

            resetGameConfig: () => set({ 
                gameConfig: null, 
                isGameConfigLoaded: false 
            }),

            // ========================================================================
            // Matchs
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
            // Compétitions
            // ========================================================================

            addCompetition: (competition) => {
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

                    return {
                        competitions: newCompetitions,
                        competitionsVersion: state.competitionsVersion + 1
                    };
                });
            },

            getCompetitionById: (id) => {
                return get().competitions.find(c => c.id === id);
            },

            removeCompetitionById: (id) => {
                let removed = false;
                set(state => {
                    const newCompetitions = state.competitions.filter(c => c.id !== id);
                    removed = newCompetitions.length !== state.competitions.length;
                    return {
                        competitions: newCompetitions,
                        competitionsVersion: state.competitionsVersion + 1
                    };
                });
                return removed;
            },

            getAllCompetitions: () => {
                return get().competitions;
            },

            getLatestCompetitions: (limit = MAX_COMPETITIONS) => {
                const competitions = get().competitions;
                return [...competitions].sort(sortByDateDesc).slice(0, limit);
            },

            addMultipleCompetitions: (newCompetitions) => {
                set(state => {
                    const existingIds = new Set(state.competitions.map(c => c.id));
                    const uniqueNewCompetitions = newCompetitions.filter(c => !existingIds.has(c.id));
                    let allCompetitions = [...uniqueNewCompetitions, ...state.competitions];
                    allCompetitions = enforceMaxLimit(allCompetitions);
                    return {
                        competitions: allCompetitions,
                        competitionsVersion: state.competitionsVersion + 1
                    };
                });
            },

            refreshCompetitions: () => {
                set(state => ({
                    competitionsVersion: state.competitionsVersion + 1
                }));
            },

            updateCompetitionValidation: (id, isValidated) => {
                set(state => ({
                    competitions: state.competitions.map(comp =>
                        comp.id === id ? { ...comp, isValidated } : comp
                    ),
                    competitionsVersion: state.competitionsVersion + 1
                }));
            },

            // ========================================================================
            // UI
            // ========================================================================

            setAfficheBanana: (value) => set({ afficheBanana: value }),
            setAfficheStat: (value) => set({ afficheStat: value }),
            setAfficheChoix: (value) => set({ afficheChoix: value }),
            setGameIsFinished: (value) => set({ gameIsFinished: value }),
            setJeuAcommencer: (value) => set({ jeuAcommencer: value }),
            setJeuenattente: (value) => set({ jeuenattente: value }),
            setLejeu: (value) => set({ lejeu: value }),
            setLamise: (value) => set({ lamise: value }),
            setAfficheAide: (value) => set({ afficheaide: value }),
            setGameStarted: (value) => set({ gameStarted: value }),
            setAfficheGame: (value) => set({ afficheGame: value }),
            setCurrentConsultationId: (id) => set({ currentConsultationId: id }),

            resetGameState: () => set({
                gameStarted: false,
                jeuAcommencer: false,
                lejeu: false,
                lamise: false,
                currentMatchInfo: [],
            }),

            resetAll: () => set({
                ...INITIAL_STATE,
                competitions: [],
                competitionsVersion: 0,
                currentMatchInfo: [],
            }),
        }),
        {
            name: STORAGE_NAME,
            partialize: (state) => {
                const compressedCompetitions = state.competitions.map(compressCompetition);
                return {
                    // gameConfig: state.gameConfig,
                    isGameConfigLoaded: state.isGameConfigLoaded, // ✅ Persistance du flag
                    competitions: compressedCompetitions,
                    afficheBanana: state.afficheBanana,
                    afficheStat: state.afficheStat,
                    gameIsFinished: state.gameIsFinished,
                    currentConsultationId: state.currentConsultationId,
                };
            },
            onRehydrateStorage: () => (state) => {
                if (state && state.competitions) {
                    try {
                        state.competitions = (state.competitions as any[]).map(decompressCompetition);
                        state.competitions = enforceMaxLimit(state.competitions);
                        state.competitionsVersion = Date.now();
                    } catch (error) {
                        console.error('Error decompressing competitions:', error);
                        state.competitions = [];
                    }
                }
                if (state) {
                    state.currentMatchInfo = state.currentMatchInfo || [];
                }
            },
        }
    )
);