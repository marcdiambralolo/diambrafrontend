'use client';
import { useCompetitionValidation } from "@/hooks/learning/endgame/useCompetitionValidation";
import {  useEndGameGenerator } from "@/hooks/learning/endgame/useEndGameGenerator";
import { CompetitionInfo } from "@/lib/interfaces";
import { MESSAGE_DURATION, NO_DATA_PLACEHOLDER } from "@/lib/learning/constantes";
import { formatDuration } from "@/lib/learning/functions";
import { Calendar, CheckCircle, ChevronDown, Loader2, Send, Trophy } from "lucide-react";
import { memo, useCallback, useEffect, useState } from 'react';

const TOAST_POSITION = "fixed top-4 left-1/2 -translate-x-1/2 z-50";
const PERMANENT_MESSAGE_DURATION = 24 * 60 * 60 * 1000; // 24h

const PermanentSuccessMessage = memo(({ competitionName, onClose }: { competitionName: string; onClose: () => void }) => (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 mb-4 shadow-lg border border-green-400 w-full animate-in fade-in slide-in-from-top-2 duration-200">
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
            <button type="button" onClick={onClose} className="text-white/80 hover:text-white p-1 text-xs" aria-label="Fermer">✕</button>
        </div>
    </div>
));

const InfoRow = memo(({ label, value, highlight = false, icon }: { label: string; value: string | number | undefined; highlight?: boolean; icon?: React.ReactNode }) => (
    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 last:border-0 py-1.5 px-2 rounded-lg">
        <span className="font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
            {icon && <span className="text-purple-500 flex-shrink-0">{icon}</span>}
            {label}:
        </span>
        <span className={`${highlight ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-gray-900 dark:text-gray-100'} text-xs sm:text-sm font-mono`}>
            {value ?? NO_DATA_PLACEHOLDER}
        </span>
    </div>
));

const MessageToast = memo(({ message, onClose }: { message: { text: string; type: string } | null; onClose: () => void }) => {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(onClose, MESSAGE_DURATION);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className={`${TOAST_POSITION} px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-medium animate-in fade-in zoom-in-95 duration-150 ${message.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
            <div className="flex items-center gap-2">
                <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
                {message.text}
            </div>
        </div>
    );
});

const CompetitionHeader = memo(({ name, onValidate, isLoading, isValidated }: { name: string; onValidate: () => void; isLoading: boolean; isValidated: boolean }) => (
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
            disabled={isLoading || isValidated}
            className={`flex items-center gap-2 px-4 py-2 text-white text-xs font-bold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${isValidated ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-400 active:scale-95'} disabled:opacity-50`}
        >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isValidated ? <CheckCircle className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
            {isLoading ? 'Validation...' : isValidated ? 'Jeu validé' : 'Valider ce jeu'}
        </button>
    </div>
));

const CompetitionStats = memo(({ startDate, finishedDate }: { startDate: string; finishedDate: string }) => {
    let elapsedTime: string | null = null;

    if (startDate && finishedDate) {
        const start = new Date(startDate);
        const end = new Date(finishedDate);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            const diff = Math.floor((end.getTime() - start.getTime()) / 1000);
            elapsedTime = diff < 0 ? "Négatif" : formatDuration(diff);
        }
    }

    return (
        <div className="w-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-3 border border-gray-100 dark:border-gray-700/50 mt-1">
            <InfoRow label="Date de début" value={startDate} icon={<Calendar className="w-3.5 h-3.5" />} />
            <InfoRow label="Date de fin" value={finishedDate} icon={<Calendar className="w-3.5 h-3.5" />} />
            {elapsedTime && <InfoRow label="Temps écoulé" value={elapsedTime} highlight icon={<span aria-hidden="true">⏱️</span>} />}
        </div>
    );
});

const CompetitionDetails = memo(({ competition, onValidate, priority = false }: { competition: CompetitionInfo; onValidate: (c: CompetitionInfo) => Promise<boolean>; priority?: boolean }) => {
    const { isLoading, validationMessage, formattedStartDate, formattedFinishedDate, handleValidate, handleCloseMessage, isValidated, clearValidationStatus } = useCompetitionValidation(onValidate, competition);
    const [showPermanentMessage, setShowPermanentMessage] = useState(false);

    useEffect(() => {
        if (isValidated && validationMessage?.type === 'success') {
            setShowPermanentMessage(true);
            const timer = setTimeout(() => setShowPermanentMessage(false), PERMANENT_MESSAGE_DURATION);
            return () => clearTimeout(timer);
        }
    }, [isValidated, validationMessage]);

    const handleClosePermanentMessage = useCallback(() => {
        setShowPermanentMessage(false);
        clearValidationStatus?.();
    }, [clearValidationStatus]);

    return (
        <div className={`bg-white dark:bg-gray-800/50 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-800 transition-all ${priority ? 'ring-2 ring-purple-500/20 shadow-lg border-purple-100' : ''}`}>
            {!isValidated && <MessageToast message={validationMessage} onClose={handleCloseMessage} />}
            <div className="p-2 space-y-2">
                <CompetitionHeader name={competition.name!} onValidate={handleValidate} isLoading={isLoading} isValidated={isValidated!} />
                {isValidated && showPermanentMessage && <PermanentSuccessMessage competitionName={competition.name!} onClose={handleClosePermanentMessage} />}
                <CompetitionStats startDate={formattedStartDate} finishedDate={formattedFinishedDate!} />
            </div>
        </div>
    );
});

const LoadMoreButton = memo(({ onClick, remainingCount, isLoading }: { onClick: () => void; remainingCount: number; isLoading: boolean }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className="w-full py-3 mt-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
    >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4" />}
        {isLoading ? 'Chargement...' : `Voir plus (${remainingCount} restantes)`}
    </button>
));

const FeuilleDeMatch = () => {
    const { handleValidateCompetition, handleLoadMore, competitionList, hasMore, remainingCount, displayList } = useEndGameGenerator();
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

    return (
        <div className="w-full mx-auto max-w-md px-4 sm:px-0">
            <div className="space-y-4">
                {displayList.map((competition , idx) => (
                    <CompetitionDetails key={competition.id} competition={competition} onValidate={handleValidateCompetition} priority={idx === 0} />
                ))}
                {!competitionList?.some(c => c.isValidated) && hasMore && (
                    <LoadMoreButton onClick={handleLoadMoreClick} remainingCount={remainingCount} isLoading={isLoadingMore} />
                )}
            </div>
        </div>
    );
};

export default memo(FeuilleDeMatch);