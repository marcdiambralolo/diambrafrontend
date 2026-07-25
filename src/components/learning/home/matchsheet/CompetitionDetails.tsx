'use client';
import { useCompetitionValidation } from '@/hooks/learning/endgame/useCompetitionValidation';
import { NO_DATA_PLACEHOLDER } from '@/lib/learning/constantes';
import { formatDuration } from '@/lib/learning/functions';
import {  BarChart3,  Calendar, CheckCircle,  Clock,  Loader2, Send, Trophy, X} from 'lucide-react';
import { memo, useEffect } from 'react';

const TOAST_DURATION = 3000;

interface MatchInfo {
  tpsglobal: number;
  trouves: number;
  rates: number;
  isgameover: boolean;
  matchNumber: number;
  score: number;
  numeromatch: string;
  datedebut: string | null;
  datefin: string | null;
  combinaisons: any[];
  numordrep: number;
  entite: number;
}

interface InfoRowProps {
  label: string;
  value?: string | number;
  highlight?: boolean;
  icon?: React.ReactNode;
}

const InfoRow = memo(function InfoRow({ label, value, highlight = false, icon }: InfoRowProps) {
  return (
    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 last:border-0 py-1.5 px-2 rounded-lg">
      <span className="font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
        {icon && <span className="text-purple-500 flex-shrink-0">{icon}</span>}
        {label}:
      </span>
      <span
        className={`text-xs sm:text-sm font-mono ${
          highlight
            ? 'text-purple-600 dark:text-purple-400 font-bold'
            : 'text-gray-900 dark:text-gray-100'
        }`}
      >
        {value ?? NO_DATA_PLACEHOLDER}
      </span>
    </div>
  );
});

interface MessageToastProps {
  message: { text: string; type: string } | null;
  onClose: () => void;
}

const MessageToast = memo(function MessageToast({ message, onClose }: MessageToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isSuccess = message.type === 'success';

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-medium ${
        isSuccess
          ? 'bg-gradient-to-r from-green-500 to-emerald-600'
          : 'bg-gradient-to-r from-red-500 to-rose-600'
      }`}
    >
      <div className="flex items-center gap-2">
        <span>{isSuccess ? '✅' : '⚠️'}</span>
        {message.text}
      </div>
    </div>
  );
});

interface PermanentSuccessMessageProps {
  competitionName: string;
  onClose: () => void;
}

const PermanentSuccessMessage = memo(function PermanentSuccessMessage({
  competitionName,
  onClose,
}: PermanentSuccessMessageProps) {
  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 mb-4 shadow-lg border border-green-400 w-full">
      <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
        <div className="flex-1">
          <p className="font-bold text-sm">✅ Jeu validé avec succès !</p>
          <p className="text-xs text-green-100 mt-1">
            Votre participation à <span className="font-semibold">{competitionName}</span> a été enregistrée.
          </p>
          <p className="text-xs text-green-100 mt-2">
            🏆 Merci d&apos;avoir participé ! Veuillez patienter jusqu&apos;à la proclamation officielle des résultats.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-white/80 hover:text-white p-1 text-xs transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

interface CompetitionHeaderProps {
  name: string;
  onValidate: () => void;
  isLoading: boolean;
  isValidated: boolean;
}

const CompetitionHeader = memo(function CompetitionHeader({
  name,
  onValidate,
  isLoading,
  isValidated,
}: CompetitionHeaderProps) {
  let buttonText = 'Valider ce jeu';
  let buttonIcon = <Send className="w-3.5 h-3.5" />;
  let isDisabled = false;

  if (isLoading) {
    buttonText = 'Validation...';
    buttonIcon = <Loader2 className="w-3.5 h-3.5 animate-spin" />;
    isDisabled = true;
  } else if (isValidated) {
    buttonText = 'Jeu validé';
    buttonIcon = <CheckCircle className="w-3.5 h-3.5" />;
    isDisabled = true;
  }

  const buttonClass = `flex items-center gap-2 px-4 py-2 text-white text-xs font-bold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
    isValidated
      ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed'
      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-400'
  }`;

  return (
    <div className="flex items-center justify-between w-full flex-wrap gap-3 border-b border-gray-100 dark:border-gray-700/60 pb-2">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
          <Trophy className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-sm sm:text-base font-bold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent truncate max-w-[180px]">
          {name}
        </h3>
      </div>
      <button
        type="button"
        onClick={onValidate}
        disabled={isDisabled}
        className={buttonClass}
      >
        {buttonIcon}
        {buttonText}
      </button>
    </div>
  );
});

interface CompetitionStatsProps {
  startDate: string;
  finishedDate: string;
  timeSpent?: number;
  niveau?: number;
}

const CompetitionStats = memo(function CompetitionStats({
  startDate,
  finishedDate,
  timeSpent,
  niveau,
}: CompetitionStatsProps) {
  const getElapsedTime = () => {
    if (!startDate || !finishedDate) return null;

    const start = new Date(startDate).getTime();
    const end = new Date(finishedDate).getTime();

    if (Number.isNaN(start) || Number.isNaN(end)) return null;

    const diff = Math.floor((end - start) / 1000);
    return diff < 0 ? 'Négatif' : formatDuration(diff);
  };

  const elapsedTime = getElapsedTime();

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-3 border border-gray-100 dark:border-gray-700/50 mt-1">
      <InfoRow
        label="Date de début"
        value={startDate}
        icon={<Calendar className="w-3.5 h-3.5" />}
      />
      <InfoRow
        label="Date de fin"
        value={finishedDate}
        icon={<Calendar className="w-3.5 h-3.5" />}
      />
      {elapsedTime && (
        <InfoRow
          label="Temps écoulé"
          value={elapsedTime}
          highlight
          icon={<span aria-hidden="true">⏱️</span>}
        />
      )}
      {timeSpent !== undefined && (
        <InfoRow
          label="Temps total"
          value={`${timeSpent}s`}
          icon={<Clock className="w-3.5 h-3.5" />}
        />
      )}
      {niveau !== undefined && (
        <InfoRow
          label="Niveau"
          value={niveau}
          icon={<BarChart3 className="w-3.5 h-3.5" />}
        />
      )}
    </div>
  );
});

interface CompetitionDetailsProps { 
  competition: any;
  priority?: boolean;
}

const CompetitionDetails = memo(function CompetitionDetails({
  competition,
  priority = false,
}: CompetitionDetailsProps) {
  const {
    handleCloseMessage,
    handleClosePermanentMessage,
    handleValidate,
    formattedStartDate,
    isLoading,
    isValidated,
    validationMessage,
    showPermanentMessage,
    formattedFinishedDate,
  } = useCompetitionValidation(competition);

  const containerClass = `bg-white dark:bg-gray-800/50 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-800 ${
    priority ? 'ring-2 ring-purple-500/20 shadow-lg border-purple-100' : ''
  }`;

  return (
    <div className={containerClass}>
      {!isValidated && (
        <MessageToast message={validationMessage} onClose={handleCloseMessage} />
      )}
      <div className="p-3 space-y-3">
        <CompetitionHeader
          name={competition.displayName ?? ''}
          onValidate={handleValidate}
          isLoading={isLoading}
          isValidated={Boolean(isValidated)}
        />
        
        {isValidated && showPermanentMessage && (
          <PermanentSuccessMessage
            competitionName={competition.name ?? ''}
            onClose={handleClosePermanentMessage}
          />
        )}

        <CompetitionStats
          startDate={formattedStartDate}
          finishedDate={formattedFinishedDate ?? ''}
          timeSpent={competition.timeSpent}
          niveau={competition.niveau}
        /> 
      </div>
    </div>
  );
});

export default CompetitionDetails;