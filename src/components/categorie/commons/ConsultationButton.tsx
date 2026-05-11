'use client';
import { useConsultationButton } from '@/hooks/categorie/useConsultationButton';
import { ConsultationChoice } from '@/lib/interfaces';
import { Loader2, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { memo } from 'react';

type EnrichedConsultationChoice = ConsultationChoice & {
  consultation?: { analysisNotified?: boolean; } | null;
};

interface ConsultationButtonProps {
  enrichedChoice: EnrichedConsultationChoice;
  onConsult: () => void;
}

export const ConsultationButton = memo<ConsultationButtonProps>(function ConsultationButton({
  enrichedChoice, onConsult,
}) {
  const router = useRouter();
  const {
    handleShare, handleClick, status, config, Icon, count, shareLabel, isPending, showHistory,
  } = useConsultationButton(enrichedChoice, onConsult);

  return (
    <div className="w-full flex flex-col items-stretch gap-3">
      <div className="flex flex-col gap-3 w-full">
        <button
          type="button"
          onClick={handleClick}
          disabled={isPending}
          aria-disabled={isPending}
          className={
            status === "VOIR L'ANALYSE"
              ? "flex-1 min-w-0 rounded-2xl px-3 py-3 font-semibold text-white text-xs sm:text-sm flex items-center justify-center gap-2 select-none transition-all duration-300 shadow-md hover:scale-[1.03] disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-amber-400 to-orange-500"
              : status === "VOIR LA RÉPONSE"
                ? "flex-1 min-w-0 rounded-2xl px-3 py-3 font-semibold text-white text-xs sm:text-sm flex items-center justify-center gap-2 select-none transition-all duration-300 shadow-md hover:scale-[1.03] disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-amber-400 to-orange-500"
                : "theme-dark-primary-button flex-1 min-w-0 rounded-2xl px-3 py-3 font-semibold text-white text-xs sm:text-sm flex items-center justify-center gap-2 select-none transition-all duration-300 shadow-md bg-gradient-to-r from-cosmic-purple to-cosmic-indigo hover:scale-[1.03] disabled:opacity-70 disabled:cursor-not-allowed"
          }
        >
          <Icon className="h-4 w-4" />

          <span>{config.label}</span>

          {status === 'RÉPONSE EN ATTENTE' ? (
            <Loader2 className="h-4 w-4 animate-spin opacity-90" aria-hidden="true" />
          ) : null}
        </button>

        {showHistory && (
          <button
            type="button"
            onClick={() => {
              if (enrichedChoice._id) {
                router.push(`/star/consultations/history/${enrichedChoice._id}?r=${Date.now()}`);
              }
            }}
            className="flex-1 min-w-0 rounded-2xl px-3 py-3 font-semibold text-white text-xs sm:text-sm flex items-center justify-center gap-2 select-none transition-all duration-300 shadow-md bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-[1.03]"
          >
            HISTORIQUE ({count})
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className="flex-1 min-w-0 rounded-2xl px-3 py-3 font-extrabold text-white text-xs sm:text-sm flex items-center justify-center gap-2 select-none transition-all duration-300 shadow-md bg-black hover:bg-neutral-900 active:scale-[0.99] relative overflow-hidden border border-neutral-800"
          aria-label="Partager cette consultation"
          title="Partager"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] translate-x-[-140%] hover:translate-x-[320%] transition-transform duration-700"
          />

          <Share2 className="h-4 w-4 relative z-10" />
          <span className="relative z-10 truncate">{shareLabel}</span>
        </button>
      </div>
    </div>
  );
});