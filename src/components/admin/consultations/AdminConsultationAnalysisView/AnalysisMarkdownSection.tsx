import React from "react";
import MarkdownCard from "@/components/consultations/content/MarkdownCard";
import SectionTitle from "../DisplayConsultationCard/SectionTitle";
import { cx } from "@/lib/functions";

interface AnalysisMarkdownSectionProps {
  mdTexte?: string;
}

export const AnalysisMarkdownSection: React.FC<AnalysisMarkdownSectionProps> = ({ mdTexte }) => (
  <div className="mt-4">
    {mdTexte ? (
      <MarkdownCard markdown={mdTexte} />
    ) : (
      <div
        className={cx(
          "mx-auto w-full max-w-2xl rounded-2xl border border-amber-500/25 bg-amber-500/10",
          "px-4 py-3 text-left"
        )}
      >
        <SectionTitle
          title="Analyse indisponible"
          subtitle="Le backend n’a pas renvoyé de texte d’analyse."
        />
      </div>
    )}
  </div>
);
