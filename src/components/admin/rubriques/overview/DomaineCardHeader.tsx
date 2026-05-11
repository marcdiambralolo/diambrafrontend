'use client';
import { memo } from 'react';
import { Book, Sparkles, ArrowLeft } from 'lucide-react';

type DomaineHeaderData = {
  nom?: string;
  description?: string;
};

interface DomaineCardHeaderProps {
  domaine: DomaineHeaderData;
  rubriquesCount: number;
  showBackButton: boolean;
  onBack: () => void;
}

export const DomaineCardHeader = memo(function DomaineCardHeader({
  domaine,
  rubriquesCount,
  showBackButton,
  onBack,
}: DomaineCardHeaderProps) {
  return (
    <div className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-3 py-1 text-[11px] font-extrabold text-white shadow-sm shadow-[#2E5AA6]/20">
            <Book className="h-4 w-4" />
            {domaine?.nom ?? "Domaine"}
          </div>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {domaine?.nom ?? "Domaine"}
          </h2>

          {domaine?.description ? (
            <p className="mt-1 text-[13px] leading-relaxed text-slate-600 dark:text-zinc-300 line-clamp-3">
              {domaine.description}
            </p>
          ) : null}
        </div>

        {showBackButton ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-extrabold text-slate-900 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            <Sparkles className="h-4 w-4" />
            {rubriquesCount} rubriques
          </span>
        )}
      </div>
    </div>
  );
});
