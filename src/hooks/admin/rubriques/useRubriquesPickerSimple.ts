import { useMemo } from "react";
import { Rubrique } from "@/lib/interfaces";
import { getRubriqueId, rubriqueLabel } from "@/lib/functions";

export function useRubriquesPickerSimple(rubriques: Rubrique[], selectedIds: string[]) {
   const normalized = useMemo(() => {
    return (rubriques ?? [])
      .map((r) => {
        const id = getRubriqueId(r);
        if (!id) return null;
        return { id, rubrique: r as Rubrique, label: rubriqueLabel(r) };
      })
      .filter(Boolean) as Array<{ id: string; rubrique: Rubrique; label: string }>;
  }, [rubriques]);

  const chips = useMemo(() => {
    const byId = new Map<string, Rubrique>();
    normalized.forEach((n) => byId.set(n.id, n.rubrique));
    return selectedIds.map((id) => byId.get(id)).filter(Boolean) as Rubrique[];
  }, [normalized, selectedIds]);

  return { normalized, chips };
}
