import { ReactNode } from "react";
import { Case, MatchInfo } from "../interfaces";

export type DateLike = Date | string | number | null | undefined;

export interface ValidationMessage {
  text: string;
  type: 'success' | 'error';
} 

export interface MatchDetailPayload {
    tpsglobal?: number;
    score?: number;
    trouves?: number;
    rates?: number;
    isgameover?: boolean;
    timeSpent?: number;
    niveau?: number;
    combinaisons?: string[];
}

export interface LearningStatsPayload {
    totalTime?: string;
    averageScore?: number;
    completedAt?: string;
    totalMatches?: number;
    totalTrouves?: number;
    totalRates?: number;
    matchesDetails?: MatchDetailPayload[];
}

export interface GameState {
    tpsglobal: number;
    casesdujeuencours: Case[];
    casesinitiales: Case[];
    pieces: string[];
    selectedCase: Case | null;
    datedebut: string;
    start: boolean;
    showPun: boolean;
    matchEnCours: number;
    infomatch: MatchInfo[];
    isGameover: boolean;
    isTransitioning: boolean;
    punChangeCount: number;
}

export interface Winner {
  nom: ReactNode;
  prenoms: ReactNode;
  consultationId: string;
  clientId: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  timeSpent: number;
  timeSpentFormatted: string;
  createdAt: string;
  rank: number;
  nombredevues: number;
}

export interface Edition {
  startDate?: string;
  endDate?: string;
}

export interface DuplicateInfo {
  count: number;
  isDuplicate: boolean;
  totalTimeSpent: number;
}

export interface GameStats {
  completedPlayers?: number;
  totalTimeSpent: number;
  averageTimeSpent: number;
  fastestTime: number;
  fastestTimeFormatted: string;
}