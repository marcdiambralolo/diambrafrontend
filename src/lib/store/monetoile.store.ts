import { MatchInfo } from '@/lib/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

class MatchInfoSet {
    private map: Map<string, MatchInfo[]>;

    constructor() {
        this.map = new Map();
    }

    add(key: string, match: MatchInfo[]): void {
        this.map.set(key, match);
    }

    get(key: string): MatchInfo[] | undefined {
        return this.map.get(key);
    }

    has(key: string): boolean {
        return this.map.has(key);
    }

    delete(key: string): boolean {
        return this.map.delete(key);
    }

    getAll(): MatchInfo[][] {
        return Array.from(this.map.values());
    }

    getKeys(): string[] {
        return Array.from(this.map.keys());
    }

    size(): number {
        return this.map.size;
    }

    clear(): void {
        this.map.clear();
    }

    forEach(callback: (match: MatchInfo[], key: string) => void): void {
        this.map.forEach((value, key) => callback(value, key));
    }

    toMap(): Map<string, MatchInfo[]> {
        return new Map(this.map);
    }

    static fromMap(map: Map<string, MatchInfo[]>): MatchInfoSet {
        const instance = new MatchInfoSet();
        instance.map = new Map(map);
        return instance;
    }
}

interface MonEtoileStore {
    currentConsultationId: string | null;
    setCurrentConsultationId: (id: string | null) => void;

    completedMatches: MatchInfo[] | null;
    setCompletedMatches: (matches: MatchInfo[] | null) => void;

    mesComp: MatchInfoSet;
    addMatchToSet: (key: string, match: MatchInfo[]) => void;
    getMatchFromSet: (key: string) => MatchInfo[] | undefined;
    hasMatchInSet: (key: string) => boolean;
    removeMatchFromSet: (key: string) => boolean;
    getAllMatchesFromSet: () => MatchInfo[][];
    clearMatchSet: () => void;
    addMultipleMatchesToSet: (matches: Map<string, MatchInfo[]> | Record<string, MatchInfo[]>) => void;
    // État de fin de jeu
    jeuestfinie: boolean;
    setJeuestfinie: (jeuestfinie: boolean) => void;
    // État de jeu en cours
    jouer: boolean;
    setJouer: (jouer: boolean) => void;
    gameStarted: boolean;
    setGameStarted: (gameStarted: boolean) => void;
    // Mode compétition vs jeu
    jeuAcommencer: boolean;
    setJeuAcommencer: (jeuAcommencer: boolean) => void;
    // État d'affichage de l'aide
    afficheaide: boolean;
    setAfficheaide: (afficheaide: boolean) => void;
    startGame: () => void;
    stopGame: () => void;
    startCompetition: () => void;
    stopCompetition: () => void;
    // Actions pour l'aide
    afficherAide: () => void;
    afficherJeu: () => void;
    // Méthodes existantes modifiées
    saveFinalResults: (matches: MatchInfo[], datedebut: string, datefin: string, competitionId?: string | null) => void;
    clearCompletedMatches: () => void;
    resetGameState: () => void;
}

export const useMonEtoileStore = create<MonEtoileStore>()(
    persist(
        (set, get) => ({
            // État initial
            choixConsultationEnCours: null,
            currentConsultationId: null,
            competitions: new Map(),
            currentCompetitionId: null,
            completedMatches: null,
            mesComp: new MatchInfoSet(), // 🔥 Initialisation de mesComp
            jeuestfinie: false,
            jouer: false,
            gameStarted: false,
            jeuAcommencer: false,
            afficheaide: false,
            setCurrentConsultationId: (id) => set({ currentConsultationId: id }),
            addMatchToSet: (key: string, match: MatchInfo[]) => {
                set(state => {
                    const newSet = new MatchInfoSet();
                    // Copier les éléments existants
                    state.mesComp.forEach((m, k) => newSet.add(k, m));
                    // Ajouter le nouveau
                    newSet.add(key, match);
                    return { mesComp: newSet };
                });
            },

            getMatchFromSet: (key: string) => {
                return get().mesComp.get(key);
            },

            hasMatchInSet: (key: string) => {
                return get().mesComp.has(key);
            },

            removeMatchFromSet: (key: string) => {
                let removed = false;
                set(state => {
                    const newSet = new MatchInfoSet();
                    state.mesComp.forEach((m, k) => {
                        if (k !== key) {
                            newSet.add(k, m);
                        } else {
                            removed = true;
                        }
                    });
                    return { mesComp: newSet };
                });
                return removed;
            },

            getAllMatchesFromSet: () => {
                return get().mesComp.getAll();
            },

            clearMatchSet: () => {
                set({ mesComp: new MatchInfoSet() });
            },

            addMultipleMatchesToSet: (matches: Map<string, MatchInfo[]> | Record<string, MatchInfo[]>) => {
                set(state => {
                    const newSet = new MatchInfoSet();
                    // Copier les éléments existants
                    state.mesComp.forEach((m, k) => newSet.add(k, m));
                    // Ajouter les nouveaux
                    if (matches instanceof Map) {
                        matches.forEach((value, key) => newSet.add(key, value));
                    } else {
                        Object.entries(matches).forEach(([key, value]) => newSet.add(key, value));
                    }
                    return { mesComp: newSet };
                });
            },

            setCompletedMatches: (matches) => set({ completedMatches: matches }),
            setJeuestfinie: (jeuestfinie) => set({ jeuestfinie }),
            setJouer: (jouer) => set({ jouer }),
            setGameStarted: (gameStarted) => set({ gameStarted }),
            setJeuAcommencer: (jeuAcommencer) => set({ jeuAcommencer }),
            setAfficheaide: (afficheaide) => set({ afficheaide }),
            afficherAide: () => set({ afficheaide: true }),
            afficherJeu: () => set({ afficheaide: false }),

            startGame: () => set({
                jouer: true,
                gameStarted: true,
                jeuestfinie: false,
                jeuAcommencer: true,
                afficheaide: false
            }),

            stopGame: () => set({
                jouer: false,
                gameStarted: false,
                jeuAcommencer: false
            }),

            startCompetition: () => set({
                jeuAcommencer: false,
                jouer: false,
                jeuestfinie: false,
                gameStarted: false,
                afficheaide: false
            }),

            stopCompetition: () => set({
                jeuAcommencer: false,
            }),

            // 🔥 Sauvegarde des résultats modifiée
            saveFinalResults: (matches, datedebut, datefin) => {
                const matchesWithDates = matches.map(match => ({
                    ...match,
                    datedebut,
                    datefin,
                    isgameover: true,
                    completedAt: datefin,
                }));
                set({
                    completedMatches: matchesWithDates,
                    jeuestfinie: true,
                    jouer: false,
                    jeuAcommencer: false,
                    gameStarted: false,
                    afficheaide: false,
                });
            },

            clearCompletedMatches: () => set({
                completedMatches: null,
                jeuestfinie: false
            }),

            resetGameState: () => set({
                jeuestfinie: false,
                jouer: false,
                gameStarted: false,
                jeuAcommencer: false,
                afficheaide: false,
                // 🔥 Optionnel: vider ou garder mesComp?
                // mesComp: new MatchInfoSet(), // Décommentez pour vider aussi mesComp
            }),
        }),
        {
            name: 'monetoile-store',
            
            partialize: (state) => ({
                currentConsultationId: state.currentConsultationId,
            }),
        }
    )
);