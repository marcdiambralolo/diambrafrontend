import { CompetitionInfo, LearningConfiguration, MatchInfo } from '@/lib/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_COMPETITIONS = 10;

interface StoredCompetition {
    id: string;
    datedebut: string;
    datefin: string;
    idConfig: string;
      consultationId: string;
       timeSpent: number;
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

interface MonEtoileStore {
    currentConsultationId: string | null;
    setCurrentConsultationId: (id: string | null) => void;
    gameConfig: LearningConfiguration | null;
    setGameConfig: (config: LearningConfiguration | null) => void;

    afficheBanana: boolean;
    setAfficheBanana: (value: boolean) => void;
      afficheStat: boolean;
    setAfficheStat: (value: boolean) => void;

    currentMatchInfo: MatchInfo[];
    setCurrentMatchInfo: (matches: MatchInfo[]) => void;
    appendMatchInfo: (match: MatchInfo) => void;
    updateMatchInfo: (index: number, match: Partial<MatchInfo>) => void;
    clearCurrentMatchInfo: () => void;
    getCurrentMatchByType: (tpsglobal: number) => MatchInfo | undefined;

    competitions: CompetitionInfo[];
    addCompetition: (competition: CompetitionInfo) => void;
    getCompetitionById: (id: string) => CompetitionInfo | undefined;
    removeCompetitionById: (id: string) => boolean;
    getAllCompetitions: () => CompetitionInfo[];
    getLatestCompetitions: (limit?: number) => CompetitionInfo[];
    addMultipleCompetitions: (newCompetitions: CompetitionInfo[]) => void;
    resetAll: () => void;
}

const compressCompetition = (competition: CompetitionInfo): StoredCompetition => {
    return {
        id: competition.id,
        datedebut: competition.datedebut,
        datefin: competition.datefin,
        idConfig: competition.idConfig,
        consultationId: competition.consultationId,
        timeSpent: competition.timeSpent!,
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
        idConfig: stored.idConfig,
        consultationId: stored.consultationId,
        timeSpent: stored.timeSpent,
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
    afficheBanana: false,
    afficheStat: false,
};
 
const sortByDateDesc = (a: CompetitionInfo, b: CompetitionInfo): number => {
    return new Date(b.datedebut).getTime() - new Date(a.datedebut).getTime();
};

const enforceMaxLimit = (competitions: CompetitionInfo[]): CompetitionInfo[] => {
    if (competitions.length <= MAX_COMPETITIONS) return competitions;
    const sorted = [...competitions].sort(sortByDateDesc);
    return sorted.slice(0, MAX_COMPETITIONS);
};

export const useMonEtoileStore = create<MonEtoileStore>()(
    persist(
        (set, get) => ({
            ...INITIAL_STATE, 
            setCurrentConsultationId: (id) => set({ currentConsultationId: id }), 
            setGameConfig: (config) => set({ gameConfig: config }), 
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

            addMultipleCompetitions: (newCompetitions: CompetitionInfo[]) => {
                set(state => {
                    const existingIds = new Set(state.competitions.map(c => c.id));
                    const uniqueNewCompetitions = newCompetitions.filter(c => !existingIds.has(c.id));
                    let allCompetitions = [...uniqueNewCompetitions, ...state.competitions];
                    allCompetitions = enforceMaxLimit(allCompetitions);
                    return { competitions: allCompetitions };
                });
            },         
            setAfficheBanana: (value: boolean) => set({ afficheBanana: value }),
            setAfficheStat: (value: boolean) => set({ afficheStat: value }),
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
                    afficheBanana: state.afficheBanana,
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