
"use client";
import { useMemo } from "react";
import { DomaineCardHeader } from './DomaineCardHeader';
import { RubriquesView } from './RubriquesView';
import { RubriqueDetailView } from './RubriqueDetailView';
import { ChoiceDetailView } from './ChoiceDetailView';
import { useDomaineCardNavigation } from '@/hooks/admin/rubriques/useDomaineCardNavigation';
import type { Rubrique } from '@/lib/interfaces';

type DomaineData = {
  id?: string;
  nom?: string;
  description?: string;
  rubriques?: Rubrique[];
};

export default function DomaineCardPremium({ domaine }: { domaine: DomaineData; }) {
  const rubriques = useMemo(() =>
    Array.isArray(domaine?.rubriques) ? domaine.rubriques : [],
    [domaine]
  );

  const {
    view, currentRubrique, currentChoice, choices,
    openRubrique, openChoice, goBack,
  } = useDomaineCardNavigation(rubriques);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/70 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40">
      <DomaineCardHeader
        domaine={domaine}
        rubriquesCount={rubriques.length}
        showBackButton={view.name !== "rubriques"}
        onBack={goBack}
      />

      <div className="border-t border-slate-200 dark:border-zinc-800" />

      <div className="p-3 sm:p-5">
        {view.name === "rubriques" && (
          <div>
            <RubriquesView rubriques={rubriques} onOpenRubrique={openRubrique} />
          </div>
        )}
        {view.name === "rubrique" && currentRubrique && (
          <div>
            <RubriqueDetailView
              rubrique={currentRubrique}
              choices={choices}
              onOpenChoice={openChoice}
            />
          </div>
        )}
        {view.name === "choice" && currentChoice && (
          <div>
            <ChoiceDetailView choice={currentChoice} />
          </div>
        )}
      </div>
    </div>
  );
}