import { useState, useCallback, useMemo } from 'react';
import { getId } from '@/lib/functions';
import type { ConsultationChoice, Rubrique } from '@/lib/interfaces';

type View =
  | { name: "rubriques" }
  | { name: "rubrique"; rubriqueId: string }
  | { name: "choice"; rubriqueId: string; choiceId: string };

export function useDomaineCardNavigation(rubriques: Rubrique[]) {
  const [view, setView] = useState<View>({ name: "rubriques" });

  const rubriquesById = useMemo(() => {
    const m = new Map<string, Rubrique>();
    for (const r of rubriques) m.set(getId(r), r);
    return m;
  }, [rubriques]);

  const currentRubrique = useMemo(() => {
    if (view.name === "rubrique" || view.name === "choice") {
      return rubriquesById.get(view.rubriqueId) ?? null;
    }
    return null;
  }, [view, rubriquesById]);

  const choices = useMemo(() => {
    const r = currentRubrique;
    return Array.isArray(r?.consultationChoices) ? r.consultationChoices : [];
  }, [currentRubrique]);

  const choicesById = useMemo(() => {
    const m = new Map<string, ConsultationChoice>();
    for (const c of choices) m.set(getId(c), c);
    return m;
  }, [choices]);

  const currentChoice = useMemo(() => {
    if (view.name !== "choice") return null;
    return choicesById.get(view.choiceId) ?? null;
  }, [view, choicesById]);

  const openRubrique = useCallback((rubriqueId: string) => {
    setView({ name: "rubrique", rubriqueId });
  }, []);

  const openChoice = useCallback((choiceId: string) => {
    setView((prev) =>
      prev.name === "rubrique"
        ? { name: "choice", rubriqueId: prev.rubriqueId, choiceId }
        : prev
    );
  }, []);

  const goBack = useCallback(() => {
    setView((prev) => {
      if (prev.name === "choice") return { name: "rubrique", rubriqueId: prev.rubriqueId };
      if (prev.name === "rubrique") return { name: "rubriques" };
      return prev;
    });
  }, []);

  return {
    view, currentRubrique, currentChoice, choices,
    openRubrique, openChoice, goBack,
  };
}