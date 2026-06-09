'use client';
import { CompetitionSummary, useCompetitionValidation, useEndGameGenerator } from "@/hooks/learning/endgame/useEndGameGenerator";
import { LOAD_MORE_INCREMENT, MESSAGE_DURATION, NO_DATA_PLACEHOLDER } from "@/lib/learning/constantes";
import { formatDuration } from "@/lib/learning/functions";
import { Calendar, CheckCircle, ChevronDown, Loader2, Send, Trophy } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

interface InfoRowProps {
  label: string;
  value: string | number | undefined;
  highlight?: boolean;
  icon?: React.ReactNode;
}

interface CompetitionDetailsProps {
  competition: CompetitionSummary;
  onValidate: (competition: CompetitionSummary) => Promise<boolean>;
  priority?: boolean;
}

interface PermanentMessageProps {
  competitionName: string;
  onClose: () => void;
}

const TOAST_POSITION = "fixed top-4 left-1/2 -translate-x-1/2 z-50";
const PERMANENT_MESSAGE_DURATION = 24 * 60 * 60 * 1000;

const PermanentSuccessMessage = memo(({ competitionName, onClose }: PermanentMessageProps) => (
  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 mb-4 shadow-lg border border-green-400">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <CheckCircle className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-sm">✅ Jeu validé avec succès !</p>
        <p className="text-xs text-green-100 mt-1">
          Votre participation à <span className="font-semibold">{competitionName}</span> a été enregistrée.
        </p>
        <p className="text-xs text-green-100 mt-2">
          🏆 Merci d'avoir participé ! Veuillez patienter jusqu'à la proclamation officielle des résultats.
        </p>
        <p className="text-xs text-green-100/80 mt-1">
          Les résultats seront annoncés dès que l'édition sera terminée.
        </p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
        aria-label="Fermer"
      >
        ✕
      </button>
    </div>
  </div>
));

const InfoRow = memo(({ label, value, highlight = false, icon }: InfoRowProps) => (
  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 last:border-0 px-2 rounded-lg">
    <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
      {icon && <span className="text-purple-500">{icon}</span>}
      {label}:
    </span>
    <span className={`${highlight ? 'text-purple-600 dark:text-purple-400 font-bold text-lg' : 'text-gray-900 dark:text-gray-100'} font-mono`}>
      {value ?? NO_DATA_PLACEHOLDER}
    </span>
  </div>
));

const MessageToast = memo(({ message, onClose }: { message: { text: string; type: 'success' | 'error' } | null; onClose: () => void }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, MESSAGE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={`${TOAST_POSITION} px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-medium ${message.type === 'success'
        ? 'bg-gradient-to-r from-green-500 to-emerald-600'
        : 'bg-gradient-to-r from-red-500 to-rose-600'
        }`}
      role="alert"
    >
      <div className="flex items-center gap-2">
        {message.type === 'success' ? '✅' : '⚠️'}
        {message.text}
      </div>
    </div>
  );
});

const CompetitionHeader = memo(({
  name,
  onValidate,
  isLoading,
  isValidated
}: {
  name: string;
  onValidate: () => void;
  isLoading: boolean;
  isValidated: boolean;
}) => (
  <div className="flex items-center justify-center flex-wrap gap-2">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
        <Trophy className="w-5 h-5 text-white" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-lg font-bold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
          {name}
        </h3>
      </div>
    </div>

    <button
      onClick={onValidate}
      disabled={isLoading || isValidated}
      className={`flex items-center gap-2 px-5 py-2.5 text-white text-sm font-bold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isValidated
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-400'
        } disabled:opacity-50`}
      type="button"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      ) : isValidated ? (
        <CheckCircle className="w-4 h-4" aria-hidden="true" />
      ) : (
        <Send className="w-4 h-4" aria-hidden="true" />
      )}
      {isLoading ? 'Validation...' : isValidated ? 'Jeu validé' : 'Valider ce jeu'}
    </button>
  </div>
));

const CompetitionStats = memo(({ startDate, finishedDate }: { startDate: string; finishedDate: string }) => {
  const elapsedTime = useMemo(() => {
    if (!startDate || !finishedDate) return null;

    const start = new Date(startDate);
    const end = new Date(finishedDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    const diffInSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);

    if (diffInSeconds < 0) return "Négatif";

    return formatDuration(diffInSeconds);
  }, [startDate, finishedDate]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-5 mb-5 border border-gray-100 dark:border-gray-700">
      <div className="space-y-1">
        <InfoRow label="Date de début" value={startDate} icon={<Calendar className="w-3.5 h-3.5" />} />
        <InfoRow label="Date de fin" value={finishedDate} icon={<Calendar className="w-3.5 h-3.5" />} />
        {elapsedTime && (
          <InfoRow label="Temps écoulé" value={elapsedTime} highlight={true} icon={<span className="text-sm">⏱️</span>} />
        )}
      </div>
    </div>
  );
});

const CompetitionDetails = memo(({ competition, onValidate, priority = false }: CompetitionDetailsProps) => {
  const {
    isLoading,
    validationMessage,
    formattedStartDate,
    formattedFinishedDate,
    handleValidate,
    handleCloseMessage,
    isValidated,
    clearValidationStatus
  } = useCompetitionValidation(onValidate, competition);

  const [showPermanentMessage, setShowPermanentMessage] = useState(false);

  // Afficher le message permanent après validation réussie
  useEffect(() => {
    if (isValidated && validationMessage?.type === 'success') {
      setShowPermanentMessage(true);
      const timer = setTimeout(() => {
        setShowPermanentMessage(false);
      }, PERMANENT_MESSAGE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isValidated, validationMessage]);

  const handleClosePermanentMessage = useCallback(() => {
    setShowPermanentMessage(false);
    clearValidationStatus?.();
  }, [clearValidationStatus]);

  if (isValidated) {
    return (
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-md overflow-hidden">
        <div className="w-full flex flex-col items-center justify-center gap-2 space-y-2 p-2">
          <CompetitionHeader
            name={competition.name}
            onValidate={handleValidate}
            isLoading={isLoading}
            isValidated={true}
          />

          {showPermanentMessage && (
            <PermanentSuccessMessage
              competitionName={competition.name}
              onClose={handleClosePermanentMessage}
            />
          )}

          <CompetitionStats startDate={formattedStartDate} finishedDate={formattedFinishedDate!} />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800/50 rounded-2xl shadow-md overflow-hidden ${priority ? 'ring-2 ring-purple-300 dark:ring-purple-700 shadow-lg' : ''}`}>
      <MessageToast message={validationMessage} onClose={handleCloseMessage} />

      <div className="w-full flex flex-col items-center justify-center gap-2 space-y-2 p-2">
        <CompetitionHeader
          name={competition.name}
          onValidate={handleValidate}
          isLoading={isLoading}
          isValidated={false}
        />

        <CompetitionStats startDate={formattedStartDate} finishedDate={formattedFinishedDate!} />
      </div>
    </div>
  );
});

const LoadMoreButton = memo(({ onClick, remainingCount, isLoading }: { onClick: () => void; remainingCount: number; isLoading: boolean }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className="group w-full py-3 mt-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
    aria-label={`Charger ${Math.min(LOAD_MORE_INCREMENT, remainingCount)} compétitions supplémentaires`}
  >
    {isLoading ? (
      <>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Chargement...</span>
      </>
    ) : (
      <>
        <span>Voir plus</span>
        <ChevronDown className="w-4 h-4" />
        <span className="text-xs text-gray-500 dark:text-gray-400">({remainingCount} restantes)</span>
      </>
    )}
  </button>
));

const FeuilleDeMatch = () => {
  const { handleValidateCompetition, handleLoadMore, competitionList, hasMore, remainingCount } = useEndGameGenerator();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMoreClick = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    try {
      await handleLoadMore();
    } finally {
      setIsLoadingMore(false);
    }
  }, [handleLoadMore, isLoadingMore]);

  if (!competitionList?.length) {
    return null;
  }

  return (
    <div className="w-full mx-auto max-w-md">
      <div className="space-y-4">
        {competitionList.map((competition, index) => (
          <CompetitionDetails
            key={competition.id}
            competition={competition}
            onValidate={handleValidateCompetition}
            priority={index === 0}
          />
        ))}

        {hasMore && (
          <LoadMoreButton onClick={handleLoadMoreClick} remainingCount={remainingCount} isLoading={isLoadingMore} />
        )}
      </div>
    </div>
  );
};

export default memo(FeuilleDeMatch);