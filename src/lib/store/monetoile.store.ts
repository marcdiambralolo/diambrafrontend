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
  
  // Paramètres du jeu
  tpsglobal: number;
  niveau: number;
  setTpsglobal: (tpsglobal: number) => void;
  setNiveau: (niveau: number) => void;
  setGameParams: (tpsglobal: number, niveau: number) => void;
  
  // État de fin de jeu
  jeuestfinie: boolean;
  setJeuestfinie: (jeuestfinie: boolean) => void;
  
  // Méthodes
  saveFinalResults: (matches: MatchInfo[], datedebut: string, datefin: string) => void;
  clearCompletedMatches: () => void;
  clearGameParams: () => void;
  resetGameState: () => void;
}

const DEFAULT_TPSGLOBAL = 0;
const DEFAULT_NIVEAU = 2;

export const useMonEtoileStore = create<MonEtoileStore>()(
  persist(
    (set) => ({
      // État initial
      choixConsultationEnCours: null,
      completedMatches: null,
      tpsglobal: DEFAULT_TPSGLOBAL,
      niveau: DEFAULT_NIVEAU,
      jeuestfinie: false,
      
      // Actions Consultation
      setChoixConsultationEnCours: (choix) => set({ choixConsultationEnCours: choix }),
      
      // Actions Matchs
      setCompletedMatches: (matches) => set({ completedMatches: matches }),
      
      // Actions Paramètres du jeu
      setTpsglobal: (tpsglobal) => set({ tpsglobal }),
      setNiveau: (niveau) => set({ niveau }),
      setGameParams: (tpsglobal, niveau) => set({ tpsglobal, niveau }),
      
      // Action pour l'état de fin de jeu
      setJeuestfinie: (jeuestfinie) => set({ jeuestfinie }),
      
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
          jeuestfinie: true 
        });
      },
      
      // Nettoyages
      clearCompletedMatches: () => set({ completedMatches: null, jeuestfinie: false }),
      clearGameParams: () => set({ 
        tpsglobal: DEFAULT_TPSGLOBAL, 
        niveau: DEFAULT_NIVEAU 
      }),
      
      // Réinitialisation complète
      resetGameState: () => set({
        completedMatches: null,
        jeuestfinie: false,
        tpsglobal: DEFAULT_TPSGLOBAL,
        niveau: DEFAULT_NIVEAU,
      }),
    }),
    {
      name: 'monetoile-store',
      partialize: (state) => ({
        choixConsultationEnCours: state.choixConsultationEnCours,
        completedMatches: state.completedMatches,
        tpsglobal: state.tpsglobal,
        niveau: state.niveau,
        jeuestfinie: state.jeuestfinie,
      }),
    }
  )
);