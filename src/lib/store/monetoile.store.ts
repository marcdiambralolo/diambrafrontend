import type { Consultation } from '@/lib/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MonEtoileStore {
  choixConsultationEnCours: Consultation | null;
  setChoixConsultationEnCours: (choix: Consultation | null) => void;
}

export const useMonEtoileStore = create<MonEtoileStore>()(
  persist(
    (set) => ({
      choixConsultationEnCours: null,
      setChoixConsultationEnCours: (choix) => set({ choixConsultationEnCours: choix }),
    }),
    {
      name: 'monetoile-store',
      partialize: (state) => ({
        choixConsultationEnCours: state.choixConsultationEnCours,
      }),
    }
  )
);