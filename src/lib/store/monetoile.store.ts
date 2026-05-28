// store/monEtoileStore.ts
import type { Consultation, MatchInfo } from '@/lib/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MonEtoileStore {
  choixConsultationEnCours: Consultation | null;
  setChoixConsultationEnCours: (choix: Consultation | null) => void;
  
  // Ajout pour les matchs terminés
  completedMatches: MatchInfo[] | null;
  setCompletedMatches: (matches: MatchInfo[] | null) => void;
  
  // Méthode pour sauvegarder les résultats finaux
  saveFinalResults: (matches: MatchInfo[], datedebut: string, datefin: string) => void;
  
  // Nettoyage
  clearCompletedMatches: () => void;
}

export const useMonEtoileStore = create<MonEtoileStore>()(
  persist(
    (set) => ({
      // État initial
      choixConsultationEnCours: null,
      completedMatches: null,
      
      // Actions
      setChoixConsultationEnCours: (choix) => set({ choixConsultationEnCours: choix }),
      
      setCompletedMatches: (matches) => set({ completedMatches: matches }),
      
      saveFinalResults: (matches, datedebut, datefin) => {
        // Ajouter les dates aux matchs
        const matchesWithDates = matches.map(match => ({
          ...match,
          datedebut,
          datefin,
          isgameover: true,
        }));
        set({ completedMatches: matchesWithDates });
      },
      
      clearCompletedMatches: () => set({ completedMatches: null }),
    }),
    {
      name: 'monetoile-store',
      partialize: (state) => ({
        choixConsultationEnCours: state.choixConsultationEnCours,
        completedMatches: state.completedMatches,
      }),
    }
  )
);