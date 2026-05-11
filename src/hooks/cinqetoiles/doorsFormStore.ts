import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FormData } from '@/lib/interfaces';

interface DoorsFormState {
  form: FormData | null;
  setForm: (form: FormData) => void;
  clearForm: () => void;
}

export const useDoorsFormStore = create<DoorsFormState>()(
  persist(
    (set) => ({
      form: null,
      setForm: (form) => set({ form }),
      clearForm: () => set({ form: null }),
    }),
    {
      name: 'doors-form-store', // clé localStorage
      partialize: (state) => ({ form: state.form }),
    }
  )
);
