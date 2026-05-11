import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConsultationChoice } from '../interfaces';


import type { GradeConfig } from '@/lib/types/grade-config.types';


import type { BlogArticle } from '@/lib/api/services/blog.service';

import type { CategorieAdmin, Consultation } from '@/lib/interfaces';

import type { Rubrique } from '@/lib/interfaces';

interface MonEtoileStore {
  consultationChoices: ConsultationChoice[];
  setConsultationChoices: (choices: ConsultationChoice[]) => void;
  clearConsultationChoices: () => void;
  grades: GradeConfig[];
  setGrades: (grades: GradeConfig[]) => void;
  clearGrades: () => void;
  currentGrade: string | null;
  setCurrentGrade: (grade: string | null) => void;
  // Blog articles
  blogArticles: BlogArticle[];
  setBlogArticles: (articles: BlogArticle[]) => void;
  clearBlogArticles: () => void;
  // Catégorie courante
  category: CategorieAdmin | null;
  setCategory: (category: CategorieAdmin | null) => void;
  clearCategory: () => void;
  // Rubrique en cours
  rubriqueEnCours: Rubrique | null;
  setRubriqueEnCours: (rubrique: Rubrique | null) => void;
  // Choix de consultation en cours
  choixConsultationEnCours: Consultation | null;
  setChoixConsultationEnCours: (choix: Consultation | null) => void;
}

export const useMonEtoileStore = create<MonEtoileStore>()(
  persist(
    (set) => ({
      consultationChoices: [],
      setConsultationChoices: (choices) => set({ consultationChoices: choices }),
      clearConsultationChoices: () => set({ consultationChoices: [] }),
      grades: [],
      setGrades: (grades) => set({ grades }),
      clearGrades: () => set({ grades: [] }),
      currentGrade: null,
      setCurrentGrade: (grade) => set({ currentGrade: grade }),
      blogArticles: [],
      setBlogArticles: (articles) => set({ blogArticles: articles }),
      clearBlogArticles: () => set({ blogArticles: [] }),
      category: null,
      setCategory: (category) => set({ category }),
      clearCategory: () => set({ category: null }),
      rubriqueEnCours: null,
      setRubriqueEnCours: (rubrique) => set({ rubriqueEnCours: rubrique }),
      choixConsultationEnCours: null,
      setChoixConsultationEnCours: (choix) => set({ choixConsultationEnCours: choix }),
    }),
    {
      name: 'monetoile-store', // nom de la clé de stockage
      partialize: (state) => ({
        consultationChoices: state.consultationChoices,
        grades: state.grades,
        currentGrade: state.currentGrade,
        blogArticles: state.blogArticles,
        category: state.category,
        rubriqueEnCours: state.rubriqueEnCours,
        choixConsultationEnCours: state.choixConsultationEnCours,
      }),
    }
  )
);
