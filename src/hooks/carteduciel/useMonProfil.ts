 
import { formatDateFR, processUserData, safeTrim } from '@/lib/functions';
import { useAuth } from '@/lib/hooks'; 
import { useMemo } from 'react';

function coerceIsoDate(v: unknown): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (v instanceof Date) return v.toISOString();

  try {
    return String(v);
  } catch {
    return "";
  }
}

export function useMonProfil() {
     const { user } = useAuth();
  const processedData = useMemo(() => processUserData(user), [user]);
 
  const prenoms = safeTrim(user?.prenoms);
  const nom = safeTrim(user?.nom); 
  const fullName = prenoms || nom ? `${prenoms}${prenoms && nom ? " " : ""}${nom}` : "Profil";
  const dateNaissanceLabel = user?.dateNaissance ? formatDateFR(coerceIsoDate(user.dateNaissance)) : "—";

  return { processedData, fullName, dateNaissanceLabel,};
}