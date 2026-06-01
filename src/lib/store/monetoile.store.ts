import type { Consultation, MatchInfo } from '@/lib/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 🔥 Interface pour une compétition complète
export interface Competition {
    id: string;
    startedAt: string;
    finishedAt?: string;
    matches: MatchInfo[];
    totalMatches: number;
    completedMatches: number;
    isComplete: boolean;
}

interface MonEtoileStore {
    // Consultation
    choixConsultationEnCours: Consultation | null;
    setChoixConsultationEnCours: (choix: Consultation | null) => void;

    // 🔥 ID de la consultation en cours
    currentConsultationId: string | null;
    setCurrentConsultationId: (id: string | null) => void;

    // 🔥 Gestion des compétitions multiples
    competitions: Map<string, Competition>;
    currentCompetitionId: string | null;
    
    // 🔥 Matchs terminés (pour compatibilité)
    completedMatches: MatchInfo[] | null;
    setCompletedMatches: (matches: MatchInfo[] | null) => void;

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

    // 🔥 Nouvelles méthodes pour les compétitions
    createCompetition: (matches: MatchInfo[]) => string;
    getCompetition: (competitionId: string) => Competition | undefined;
    updateCompetitionMatches: (competitionId: string, matchIndex: number, updatedMatch: MatchInfo) => void;
    completeCompetition: (competitionId: string) => void;
    getAllCompetitions: () => Competition[];
    getCurrentCompetition: () => Competition | undefined;
    
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
            currentConsultationId: null, // 🔥 Réintégré
            competitions: new Map(),
            currentCompetitionId: null,
            completedMatches: null,
            jeuestfinie: false,
            jouer: false,
            gameStarted: false,
            jeuAcommencer: false,
            afficheaide: false,

            // Actions Consultation
            setChoixConsultationEnCours: (choix) => set({ choixConsultationEnCours: choix }),
            
            // 🔥 Action pour l'ID de consultation
            setCurrentConsultationId: (id) => set({ currentConsultationId: id }),

            // 🔥 Actions pour les compétitions
            createCompetition: (matches: MatchInfo[]) => {
                const competitionId = matches[0]?.competitionId || `comp_${Date.now()}`;
                const competition: Competition = {
                    id: competitionId,
                    startedAt: new Date().toISOString(),
                    matches: matches,
                    totalMatches: matches.length,
                    completedMatches: 0,
                    isComplete: false,
                };
                
                set(state => ({
                    competitions: new Map(state.competitions).set(competitionId, competition),
                    currentCompetitionId: competitionId,
                }));
                
                return competitionId;
            },

            getCompetition: (competitionId: string) => {
                return get().competitions.get(competitionId);
            },

            updateCompetitionMatches: (competitionId: string, matchIndex: number, updatedMatch: MatchInfo) => {
                const competition = get().competitions.get(competitionId);
                if (!competition) return;

                const updatedMatches = [...competition.matches];
                updatedMatches[matchIndex] = updatedMatch;
                
                const completedCount = updatedMatches.filter(m => m.isgameover === true).length;
                const isComplete = completedCount === competition.totalMatches;
                
                const updatedCompetition: Competition = {
                    ...competition,
                    matches: updatedMatches,
                    completedMatches: completedCount,
                    isComplete: isComplete,
                    finishedAt: isComplete ? new Date().toISOString() : competition.finishedAt,
                };
                
                set(state => ({
                    competitions: new Map(state.competitions).set(competitionId, updatedCompetition),
                }));
            },

            completeCompetition: (competitionId: string) => {
                const competition = get().competitions.get(competitionId);
                if (!competition) return;
                
                const updatedCompetition: Competition = {
                    ...competition,
                    isComplete: true,
                    finishedAt: new Date().toISOString(),
                };
                
                set(state => ({
                    competitions: new Map(state.competitions).set(competitionId, updatedCompetition),
                    jeuestfinie: true,
                    jouer: false,
                    jeuAcommencer: false,
                    gameStarted: false,
                }));
            },

            getAllCompetitions: () => {
                return Array.from(get().competitions.values());
            },

            getCurrentCompetition: () => {
                const { currentCompetitionId, competitions } = get();
                return currentCompetitionId ? competitions.get(currentCompetitionId) : undefined;
            },

            // Actions Matchs
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
                currentCompetitionId: null,
            }),

            // 🔥 Sauvegarde des résultats modifiée
            saveFinalResults: (matches, datedebut, datefin, competitionId) => {
                const matchesWithDates = matches.map(match => ({
                    ...match,
                    datedebut,
                    datefin,
                    isgameover: true,
                    completedAt: datefin,
                }));
                
                // Sauvegarder dans la compétition si un ID est fourni
                if (competitionId) {
                    const competition = get().competitions.get(competitionId);
                    if (competition) {
                        const updatedCompetition: Competition = {
                            ...competition,
                            matches: matchesWithDates,
                            isComplete: true,
                            finishedAt: datefin,
                            completedMatches: matchesWithDates.length,
                        };
                        set(state => ({
                            competitions: new Map(state.competitions).set(competitionId, updatedCompetition),
                            completedMatches: matchesWithDates,
                            jeuestfinie: true,
                            jouer: false,
                            jeuAcommencer: false,
                            gameStarted: false,
                            afficheaide: false,
                        }));
                        return;
                    }
                }
                
                // Compatibilité avec l'ancien système
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
                currentCompetitionId: null,
                // 🔥 On ne reset pas currentConsultationId pour garder le contexte
            }),
        }),
        {
            name: 'monetoile-store',
            partialize: (state) => ({
                choixConsultationEnCours: state.choixConsultationEnCours,
                currentConsultationId: state.currentConsultationId, // 🔥 Persister l'ID de consultation
                // 🔥 Persister les compétitions (convertir Map en objet pour la persistance)
                competitions: Array.from(state.competitions.entries()),
                currentCompetitionId: state.currentCompetitionId,
            }),
            // 🔥 Hydrater la Map après persistence
            onRehydrateStorage: () => (state) => {
                if (state && Array.isArray(state.competitions)) {
                    state.competitions = new Map(state.competitions);
                }
            },
        }
    )
);