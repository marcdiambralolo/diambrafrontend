import type { Consultation } from '@/lib/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConsultationChoice } from '../interfaces';

interface MonEtoileStore {
  consultationChoices: ConsultationChoice[];
  choixConsultationEnCours: Consultation | null;
  setConsultationChoices: (choices: ConsultationChoice[]) => void;
  clearConsultationChoices: () => void;
  setChoixConsultationEnCours: (choix: Consultation | null) => void;
}

export const useMonEtoileStore = create<MonEtoileStore>()(
  persist(
    (set) => ({
      consultationChoices: [],
      setConsultationChoices: (choices) => set({ consultationChoices: choices }),
      clearConsultationChoices: () => set({ consultationChoices: [] }),
      choixConsultationEnCours: null,
      setChoixConsultationEnCours: (choix) => set({ choixConsultationEnCours: choix }),
    }),
    {
      name: 'monetoile-store',
      partialize: (state) => ({
        consultationChoices: state.consultationChoices,
        choixConsultationEnCours: state.choixConsultationEnCours,
      }),
    }
  )
);