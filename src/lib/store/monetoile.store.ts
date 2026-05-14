import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConsultationChoice } from '../interfaces';
import type { CategorieAdmin, Consultation } from '@/lib/interfaces';
import type { Rubrique } from '@/lib/interfaces';

interface MonEtoileStore {
  consultationChoices: ConsultationChoice[];
  setConsultationChoices: (choices: ConsultationChoice[]) => void;
  clearConsultationChoices: () => void;
  category: CategorieAdmin | null;
  setCategory: (category: CategorieAdmin | null) => void;
  clearCategory: () => void;
  rubriqueEnCours: Rubrique | null;
  setRubriqueEnCours: (rubrique: Rubrique | null) => void;
  choixConsultationEnCours: Consultation | null;
  setChoixConsultationEnCours: (choix: Consultation | null) => void;
}

export const useMonEtoileStore = create<MonEtoileStore>()(
  persist(
    (set) => ({
      consultationChoices: [],
      setConsultationChoices: (choices) => set({ consultationChoices: choices }),
      clearConsultationChoices: () => set({ consultationChoices: [] }),
      category: null,
      setCategory: (category) => set({ category }),
      clearCategory: () => set({ category: null }),
      rubriqueEnCours: null,
      setRubriqueEnCours: (rubrique) => set({ rubriqueEnCours: rubrique }),
      choixConsultationEnCours: null,
      setChoixConsultationEnCours: (choix) => set({ choixConsultationEnCours: choix }),
    }),
    {
      name: 'monetoile-store',
      partialize: (state) => ({
        consultationChoices: state.consultationChoices,
        category: state.category,
        rubriqueEnCours: state.rubriqueEnCours,
        choixConsultationEnCours: state.choixConsultationEnCours,
      }),
    }
  )
);
