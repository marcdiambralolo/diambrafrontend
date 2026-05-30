// store/monEtoileStore.ts
import type { Consultation, MatchInfo } from '@/lib/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MonEtoileStore {
  // Consultation
  choixConsultationEnCours: Consultation | null;
  setChoixConsultationEnCours: (choix: Consultation | null) => void;

  // Matchs terminés
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

  // Méthodes
  saveFinalResults: (matches: MatchInfo[], datedebut: string, datefin: string) => void;
  clearCompletedMatches: () => void;
  resetGameState: () => void;
}

export const useMonEtoileStore = create<MonEtoileStore>()(
  persist(
    (set) => ({
      // État initial
      choixConsultationEnCours: null,
      completedMatches: null,
      jeuestfinie: false,
      jouer: false,
      gameStarted: false,
      jeuAcommencer: false,
      afficheaide: false,

      // Actions Consultation
      setChoixConsultationEnCours: (choix) => set({ choixConsultationEnCours: choix }),

      // Actions Matchs
      setCompletedMatches: (matches) => set({ completedMatches: matches }),

      // Action pour l'état de fin de jeu
      setJeuestfinie: (jeuestfinie) => set({ jeuestfinie }),

      // Actions pour l'état de jeu
      setJouer: (jouer) => set({ jouer }),
      setGameStarted: (gameStarted) => set({ gameStarted }),

      // Actions pour le mode
      setJeuAcommencer: (jeuAcommencer) => set({ jeuAcommencer }),

      // Actions pour l'aide
      setAfficheaide: (afficheaide) => set({ afficheaide }),

      afficherAide: () => set({ afficheaide: true }),

      afficherJeu: () => set({ afficheaide: false }),

      startGame: () => set({
        jouer: true,
        jeuestfinie: false,
        jeuAcommencer: true,
        afficheaide: false
      }),

      stopGame: () => set({
        jouer: false,
        jeuAcommencer: false
      }),

      startCompetition: () => set({
        jeuAcommencer: false,
        jouer: false,
        jeuestfinie: false,
        afficheaide: false
      }),

      stopCompetition: () => set({
        jeuAcommencer: false
      }),

      // Sauvegarde des résultats
      saveFinalResults: (matches, datedebut, datefin) => {
        const matchesWithDates = matches.map(match => ({
          ...match,
          datedebut,
          datefin,
          isgameover: true,
        }));
        set({
          completedMatches: matchesWithDates,
          jeuestfinie: true,
          jouer: false,
          jeuAcommencer: false,
          afficheaide: false
        });
      },

      // Nettoyages
      clearCompletedMatches: () => set({
        completedMatches: null,
        jeuestfinie: false
      }),

      // Réinitialisation complète
      resetGameState: () => set({
        completedMatches: null,
        jeuestfinie: false,
        jouer: false,
        gameStarted: false,
        jeuAcommencer: false,
        afficheaide: false,
      }),
    }),
    {
      name: 'monetoile-store',
      partialize: (state) => ({
        choixConsultationEnCours: state.choixConsultationEnCours,
      }),
    }
  )
);