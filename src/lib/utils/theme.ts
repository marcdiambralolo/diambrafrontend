import { StateCase } from "../interfaces";

 

export interface CaseStyleProps {
  etat: StateCase;
  isStartCase?: boolean;
  tca: 1 | 2 | 3;
}

export function getCaseStyle({ etat, isStartCase, tca }: CaseStyleProps): string {
  // Styles de base pour chaque type
  if (tca === 1) {
    if (isStartCase && etat === StateCase.Cre) {
      return 'bg-amber-100 border-amber-500 font-bold text-amber-900 shadow-inner';
    }
    switch (etat) {
      case StateCase.Choi:
        return 'bg-yellow-300 border-yellow-600 scale-105 shadow-md z-10';
      case StateCase.Lo:
        return 'bg-slate-300 border-slate-500 text-slate-800 font-bold';
      case StateCase.Pla:
        return 'bg-emerald-100 border-emerald-500 text-emerald-900 font-semibold';
      case StateCase.Cre:
      default:
        return 'bg-slate-50 border-slate-200 hover:bg-slate-100';
    }
  }

  // Pions (Chiffres/Opérateurs)
  switch (etat) {
    case StateCase.Choi:
      return 'bg-amber-400 border-amber-600 scale-105 shadow-lg text-slate-900 font-bold';
    case StateCase.Pla:
      return 'bg-sky-500 border-sky-700 text-white shadow font-bold hover:bg-sky-600';
    case StateCase.Cre:
    default:
      return 'bg-slate-200 border-slate-300 opacity-30 cursor-not-allowed';
  }
}