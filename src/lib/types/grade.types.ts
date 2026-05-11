/**
 * Système de grades initiatiques
 * 9 degrés d'évolution spirituelle basés sur l'activité de l'utilisateur
 * Compatible avec le backend NestJS
 */

export enum Grade {
  NEOPHYTE = 'NEOPHYTE',
  ASPIRANT = 'ASPIRANT',
  CONTEMPLATEUR = 'CONTEMPLATEUR',
  CONSCIENT = 'CONSCIENT',
  INTEGRATEUR = 'INTEGRATEUR',
  TRANSMUTANT = 'TRANSMUTANT',
  ALIGNE = 'ALIGNE',
  EVEILLE = 'EVEILLE',
  SAGE = 'SAGE',
  MAITRE_DE_SOI = 'MAITRE_DE_SOI',
}

export const GRADE_ORDER = [
  Grade.NEOPHYTE,
  Grade.ASPIRANT,
  Grade.CONTEMPLATEUR,
  Grade.CONSCIENT,
  Grade.INTEGRATEUR,
  Grade.TRANSMUTANT,
  Grade.ALIGNE,
  Grade.EVEILLE,
  Grade.SAGE,
  Grade.MAITRE_DE_SOI,
];

/**
 * Progression d'un utilisateur dans une rubrique spécifique
 * Utilisé pour les exigences par rubrique (rubriqueRequirements)
 */
export interface RubriqueProgress {
  rubriqueId: string;
  rubriqueName: string;
  consultationsCompleted: number;
  consultationsRequired: number;
}

/**
 * Exigence de consultations dans une rubrique spécifique.
 * Chaque grade peut définir un nombre minimum de consultations COMPLETED
 * dans des rubriques spécifiques.
 */
export interface RubriqueRequirement {
  rubriqueId: string;
  rubriqueName?: string;
  minimumConsultations: number;
}

export interface GradeRequirements {
  grade: Grade;
  name: string;
 
    consultations?: number;
  rituels?: number;
  livres?: number;
}

export interface UserProgress {
  /** Compteurs globaux de l'utilisateur */
  consultationsCompleted: number;
  rituelsCompleted: number;
  booksRead: number;
  currentGrade: Grade | null;
  nextGrade?: Grade | null;
  /** Détail des consultations par rubrique (agrégation depuis les consultations réelles) */
  rubriqueProgress?: RubriqueProgress[];
  progressToNextGrade?: {
    /** Seuils globaux pour le grade suivant */
    consultations: { current: number; required: number; };
    rituels: { current: number; required: number; };
    livres: { current: number; required: number; };
    /** Exigences par rubrique pour le grade suivant (si configurées) */
    rubriqueProgress?: RubriqueProgress[];
  };
}
 