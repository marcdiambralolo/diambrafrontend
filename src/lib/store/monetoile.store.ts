import { CompetitionInfo, LearningConfiguration } from '@/lib/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// CONSTANTES
// ============================================================================

const MAX_COMPETITIONS = 10;
const MAX_MATCHES_PER_COMPETITION = 4; // Chaque compétition a 4 matchs max

// ============================================================================
// TYPE PERSISTANCE ALLÉGÉ
// ============================================================================

interface StoredCompetition {
    id: string;
    datedebut: string;
    datefin: string;
    // Version compressée des matchInfo
    matchInfo: Array<{
        id?: string;
        tpsglobal?: number;
        trouves?: number;
        rates?: number;
        isgameover?: boolean;
        timeSpent?: number;
        matchNumber?: number;
        // Ne pas stocker les gros objets comme listeCaseOpLab etc.
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

// Compresser une compétition pour le stockage
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
            // Ne pas stocker: listeCaseOpLab, listeCaseOpLabInitiale, pieces, etc.
        })),
    };
};

// Décompresser une compétition depuis le stockage
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
            // Valeurs par défaut pour les champs non persistés
            score: match.trouves || 0,
            listeCaseOpLab: [],
            listeCaseOpLabInitiale: [],
            pieces: [],
        })) as any,
    };
};

// Vérifier la taille du stockage
const isStorageNearLimit = (): boolean => {
    try {
        const testKey = '__size_test__';
        const testData = 'x'.repeat(1024 * 1024); // 1MB
        localStorage.setItem(testKey, testData);
        localStorage.removeItem(testKey);
        return false;
    } catch (e) {
        return true; // Limite atteinte ou proche
    }
};

// Nettoyer les anciennes compétitions si nécessaire
const cleanupOldCompetitions = (competitions: CompetitionInfo[]): CompetitionInfo[] => {
    // Garder seulement les MAX_COMPETITIONS plus récentes
    const sorted = [...competitions].sort(
        (a, b) => new Date(b.datedebut).getTime() - new Date(a.datedebut).getTime()
    );
    return sorted.slice(0, MAX_COMPETITIONS);
};

// ============================================================================
// ÉTAT INITIAL
// ============================================================================

const INITIAL_STATE = {
    currentConsultationId: null,
    gameConfig: null,
    competitions: [] as CompetitionInfo[],
    gameStarted: false,
    jeuAcommencer: false,
    afficheaide: false,
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
            // ACTIONS COMPETITIONS
            // ========================================================================

            addCompetition: (competition: CompetitionInfo) => {
                set(state => {
                    // Vérifier si une compétition avec le même ID existe déjà
                    const exists = state.competitions.some(c => c.id === competition.id);
                    if (exists) {
                        console.warn(`Competition with id ${competition.id} already exists`);
                        return state;
                    }

                    // Ajouter la nouvelle compétition et limiter à 10
                    let newCompetitions = [competition, ...state.competitions];
                    newCompetitions = enforceMaxLimit(newCompetitions);
                    
                    // Vérifier si la limite de stockage est proche
                    if (isStorageNearLimit()) {
                        console.warn('Storage near limit, clearing old competitions');
                        // Supprimer les 2 plus anciennes pour faire de la place
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
            }),
        }),
        {
            name: 'monetoile-store',
            partialize: (state) => {
                // Compresser les compétitions avant persistance
                const compressedCompetitions = state.competitions.map(compressCompetition);
                
                return {
                    currentConsultationId: state.currentConsultationId,
                    gameConfig: state.gameConfig,
                    competitions: compressedCompetitions, // Version compressée
                };
            },
            onRehydrateStorage: () => (state) => {
                if (state && state.competitions) {
                    // Décompresser les compétitions après récupération
                    try {
                        state.competitions = (state.competitions as any).map(decompressCompetition);
                        // S'assurer que la limite est respectée
                        state.competitions = enforceMaxLimit(state.competitions);
                    } catch (error) {
                        console.error('Error decompressing competitions:', error);
                        state.competitions = [];
                    }
                }
                if (state) {
                    state.competitions = state.competitions || [];
                }
            },
        }
    )
);