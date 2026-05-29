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
  
  // Méthodes
  saveFinalResults: (matches: MatchInfo[], datedebut: string, datefin: string) => void;
  clearCompletedMatches: () => void;
  clearGameParams: () => void;
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
      
      // Actions Consultation
      setChoixConsultationEnCours: (choix) => set({ choixConsultationEnCours: choix }),
      
      // Actions Matchs
      setCompletedMatches: (matches) => set({ completedMatches: matches }),
      
      // Actions Paramètres du jeu
      setTpsglobal: (tpsglobal) => set({ tpsglobal }),
      setNiveau: (niveau) => set({ niveau }),
      setGameParams: (tpsglobal, niveau) => set({ tpsglobal, niveau }),
      
      // Sauvegarde des résultats
      saveFinalResults: (matches, datedebut, datefin) => {
        const matchesWithDates = matches.map(match => ({
          ...match,
          datedebut,
          datefin,
          isgameover: true,
        }));
        set({ completedMatches: matchesWithDates });
      },
      
      // Nettoyages
      clearCompletedMatches: () => set({ completedMatches: null }),
      clearGameParams: () => set({ 
        tpsglobal: DEFAULT_TPSGLOBAL, 
        niveau: DEFAULT_NIVEAU 
      }),
    }),
    {
      name: 'monetoile-store',
      partialize: (state) => ({
        choixConsultationEnCours: state.choixConsultationEnCours,
        completedMatches: state.completedMatches,
        tpsglobal: state.tpsglobal,
        niveau: state.niveau,
      }),
    }
  )
);