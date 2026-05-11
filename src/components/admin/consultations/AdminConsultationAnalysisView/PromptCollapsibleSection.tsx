import MarkdownCard from "@/components/consultations/content/MarkdownCard";
import React from "react";
import Collapsible from "../DisplayConsultationCard/Collapsible";

interface PromptCollapsibleSectionProps {
  mdPrompt?: string;
}

export const PromptCollapsibleSection: React.FC<PromptCollapsibleSectionProps> = ({ mdPrompt }) => (
  <div className="mt-4">
    <Collapsible
      label="Prompt utilisé"
      hint={mdPrompt ? "Afficher / masquer le prompt envoyé au modèle" : "Aucun prompt disponible"}
      defaultOpen={true}
    >
      {mdPrompt ? (
        <MarkdownCard markdown={mdPrompt} />
      ) : (
        <div className="px-3 py-3 text-center text-[12px] text-slate-600 dark:text-slate-300/80">
          Aucun prompt disponible.
        </div>
      )}
    </Collapsible>
  </div>
);
