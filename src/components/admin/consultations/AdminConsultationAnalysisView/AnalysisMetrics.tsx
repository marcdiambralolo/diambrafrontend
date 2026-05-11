import React from "react";

interface AnalysisMetricsProps {
  metrics: { wc: number; pc: number };
  mdPrompt?: string;
}

export const AnalysisMetrics: React.FC<AnalysisMetricsProps> = ({ metrics, mdPrompt }) => (
  <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
    <span className="rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 px-2.5 py-1 text-[11px] text-slate-700 dark:text-slate-200/90">
      Analyse : <span className="font-semibold">{metrics.wc}</span> mots
    </span>

    {mdPrompt ? (
      <span className="rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 px-2.5 py-1 text-[11px] text-slate-700 dark:text-slate-200/90">
        Prompt : <span className="font-semibold">{metrics.pc}</span> mots
      </span>
    ) : null}
  </div>
);
