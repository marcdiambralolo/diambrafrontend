import { formatDateFR, processUserData, safeTrim } from '@/lib/functions';
import { User } from '@/lib/interfaces';
import { useAuthStore } from '@/lib/store/auth.store';
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
  const user = useAuthStore((state) => state.user) as User | null;
  const processedData = useMemo(() => processUserData(user), [user]);
  const premium = !!user?.premium;
  const grade = safeTrim(user?.grade) || (premium ? "Premium" : "Standard");
  const prenoms = safeTrim(user?.prenoms);
  const nom = safeTrim(user?.nom);
  const fullName = prenoms || nom ? `${prenoms}${prenoms && nom ? " " : ""}${nom}` : "Profil";
  const dateNaissanceLabel = user?.dateNaissance ? formatDateFR(coerceIsoDate(user.dateNaissance)) : "—";
  const heureNaissance = safeTrim(user?.heureNaissance) || "—";
  const lieuNaissance = safeTrim(user?.villeNaissance) || "—";

  return { processedData, fullName, grade, dateNaissanceLabel, heureNaissance, lieuNaissance, };
}