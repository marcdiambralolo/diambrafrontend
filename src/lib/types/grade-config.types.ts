/**
 * Types pour la configuration des grades côté admin
 */

import { FrequenceConsultation, TypeParticipants } from '../interfaces';
import { Grade } from './grade.types';

/**
 * Configuration d'un grade initiatique (depuis le backend)
 *
 * Le système repose sur 2 couches :
 * 1. requirements → seuils globaux (consultations, rituels, livres) — modifiables depuis l'admin
 * 2. consultationChoices → quels choix de consultation sont ACCESSIBLES à ce grade
 */
export interface GradeConfig {
  _id: string;
  grade: Grade;
  level: number; // 1-9
  name: string;
  /** Seuils globaux du profil utilisateur */
  requirements: {
    consultations: number;
    rituels: number;
    livres: number;
  };
  /** ID du grade suivant (null pour le dernier grade) */
  nextGradeId: string | null;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  // data statique existante
  key?: string;
  title?: string;
  subtitle?: string;
  items?: string[];
}

/**
 * Choix de consultation spécifique à un grade
 */
export interface GradeConsultationChoice {
  _id?: string;
  choiceId: string;
  title: string;
  description: string;
  frequence: FrequenceConsultation;
  participants: TypeParticipants;
  /** Ordre d'affichage */
  order?: number;
  /** Indique si ce choix est actif */
  isActive?: boolean;
}

/**
 * DTO pour créer un nouveau grade
 */
export interface CreateGradeConfigDto {
  grade: Grade;
  consultationChoiceIds: string[]; // IDs des choix de consultations
  nextGradeId?: string | null;
  description?: string;
}

/**
 * DTO pour mettre à jour un grade
 */
export interface UpdateGradeConfigDto {
  name?: string;
  description?: string;
  consultationChoiceIds?: string[];
  nextGradeId?: string | null;
  requirements?: {
    consultations?: number;
    rituels?: number;
    livres?: number;
  };
}

/**
 * Grade avec informations enrichies
 */
export interface EnrichedGradeConfig extends GradeConfig {
  nextGrade?: GradeConfig | null;
  isLastGrade: boolean;
}
