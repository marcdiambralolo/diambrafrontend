export interface Case {
  numordrep?: number;
  tpsglobal?: number;
  txt?: string;
  itxt?: string;
  etati?: "Cre" | "Choi" | "Lo" | "Win";
  isbou?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  id?: number;
  isLocked?: boolean;
  size?: string;
  place?: boolean;
  index?: number;
  mode?: boolean;
  force?: boolean;
}

export interface MatchInfo {
  listeCaseOpLab?: Case[];
  listeCaseOpLabInitiale?: Case[];
  pieces?: string[];
  numordrep?: number;
  score?: number;
  rates?: number;
  tpsglobal?: number;
  niveau?: number;
  entite?: number;
  numeromatch?: string;
  isgameover?: boolean;
  datedebut?: string | null;
  datefin?: string | null;
  trouves?: number;
  nbCoup?: number;
}

export interface MenuItem {
  title: string;
  icon: React.ReactNode;
  tpsglobal?: number;
  color: string;
}