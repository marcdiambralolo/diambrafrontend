import { ReactNode } from "react";
import { Case, MatchInfo } from "../interfaces";

export type DateLike = Date | string | number | null | undefined;

export interface ValidationMessage {
  text: string;
  type: 'success' | 'error';
}

export interface MatchResult {
    matchNumber: number;
    type: string;
    score: number;
    timeSpent?: number;
    trouves?: number;
    rates?: number;
    niveau?: number;
    combinaisons?: string[];
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
}

export interface CompetitionInfo {
 
 displayName: string;
 isValidated: boolean;
 niveau: any;
 id: string;
 datedebut: string;
 datefin: string;
 idConfig: string;
 matchInfo: MatchInfo[];
 consultationId: string;
 timeSpent?: number;
 name?: string;
 matches?: MatchResult[];
 totalScore?: number;
 punChangeCount: number;
 
}