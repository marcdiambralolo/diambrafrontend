"use client";
import { memo } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

type StatusBannerProps = {
  error: string | null;
  success: boolean;
  onDismissError: () => void;
};

const StatusBanner = memo(function StatusBanner({ error, success, onDismissError }: StatusBannerProps) {
  if (success) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border-0 bg-gradient-to-r from-emerald-200/60 to-emerald-400/40 px-6 py-4 shadow-lg shadow-emerald-400/10 backdrop-blur">
        <CheckCircle className="h-6 w-6 shrink-0 text-emerald-700 dark:text-emerald-300 drop-shadow" />
        <div>
          <p className="text-base font-extrabold text-emerald-900 dark:text-emerald-200 drop-shadow">
            Livre modifié avec succès !
          </p>

          <p className="text-[13px] text-emerald-800 dark:text-emerald-300/80">
            Redirection en cours…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border-0 bg-gradient-to-r from-red-200/60 to-red-400/40 px-6 py-4 shadow-lg shadow-red-400/10 backdrop-blur">
        <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-red-700 dark:text-red-300 drop-shadow" />
        <div className="min-w-0 flex-1">
          <p className="text-base font-extrabold text-red-900 dark:text-red-200 drop-shadow">Erreur</p>
          <p className="text-[13px] text-red-800 dark:text-red-300/80">{error}</p>
        </div>
        <button
          type="button"
          onClick={onDismissError}
          className="shrink-0 rounded-xl p-2 text-red-700 bg-white/80 hover:bg-red-100 dark:text-red-300 dark:bg-red-500/10 dark:hover:bg-red-500/20 shadow"
          title="Fermer"
        >
          ✕
        </button>
      </div>
    );
  }

  return null;
});

StatusBanner.displayName = "StatusBanner";

export default StatusBanner; 