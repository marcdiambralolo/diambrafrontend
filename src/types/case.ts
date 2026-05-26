// types/case.ts
export interface CaseProps {
  tpsglobal?: number;
  txt?: string;
  itxt?: string;
  onClick?: () => void;
  isSelected?: boolean;
  isLocked?: boolean;
  size?: string;
  mode?: boolean;
  pieces: string[];
  id?: number;
  // Ajouts pour accessibilité
  ariaLabel?: string;
  disabled?: boolean;
}

export type GameMode = 0 | 1 | 2 | 3;
// 0: Nombre, 1: Couleur, 2: Image, 3: Lettre
