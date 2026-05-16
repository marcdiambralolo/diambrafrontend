import type { Consultation, Rubrique } from '@/lib/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConsultationChoice } from '../interfaces';

interface MonEtoileStore {
  consultationChoices: ConsultationChoice[];
  rubriqueEnCours: Rubrique | null;
  choixConsultationEnCours: Consultation | null;
  setConsultationChoices: (choices: ConsultationChoice[]) => void;
  clearConsultationChoices: () => void;
  setRubriqueEnCours: (rubrique: Rubrique | null) => void;
  setChoixConsultationEnCours: (choix: Consultation | null) => void;
}

export const useMonEtoileStore = create<MonEtoileStore>()(
  persist(
    (set) => ({
      consultationChoices: [],
      setConsultationChoices: (choices) => set({ consultationChoices: choices }),
      clearConsultationChoices: () => set({ consultationChoices: [] }),
      rubriqueEnCours: null,
      setRubriqueEnCours: (rubrique) => set({ rubriqueEnCours: rubrique }),
      choixConsultationEnCours: null,
      setChoixConsultationEnCours: (choix) => set({ choixConsultationEnCours: choix }),
    }),
    {
      name: 'monetoile-store',
      partialize: (state) => ({
        consultationChoices: state.consultationChoices,
        rubriqueEnCours: state.rubriqueEnCours,
        choixConsultationEnCours: state.choixConsultationEnCours,
      }),
    }
  )
);