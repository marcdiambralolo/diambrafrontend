'use client';
import { CompetitionSummary, useEndGameGenerator } from "@/hooks/learning/endgame/useEndGameGenerator";
import { MatchInfo } from "@/lib/interfaces";
import { NO_DATA_PLACEHOLDER } from "@/lib/learning/constantes";
import { Loader2, Medal, RotateCcw, Send, Trophy } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

interface InfoRowProps {
    label: string;
    value: string | number | undefined;
    highlight?: boolean;
}

interface MatchCardProps {
    match: {
        matchNumber: number;
        type: string;
        score: number;
        timeSpent?: number;
    };
    index: number;
}

interface CompetitionDetailsProps {
    competition: CompetitionSummary;
    onValidate: (rawMatches: MatchInfo[]) => Promise<boolean>;
    isValidating?: boolean;
}

interface ActionButtonsProps {
    onRestart: () => void;
    disabled?: boolean;
}

interface ValidationMessage {
    text: string;
    type: 'success' | 'error';
}

const MESSAGE_DURATION = 3000;

const formatDuration = (seconds?: number): string => {
    if (!seconds) return '0s';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
};

const InfoRow = memo(({ label, value, highlight = false }: InfoRowProps) => (
    <div className="flex justify-between py-1 border-b border-gray-200 last:border-0">
        <span className="font-semibold text-gray-700">{label}:</span>
        <span className={`${highlight ? 'text-purple-600 font-bold text-lg' : 'text-gray-900'}`}>
            {value ?? NO_DATA_PLACEHOLDER}
        </span>
    </div>
));

const MatchCard = memo(({ match, index }: MatchCardProps) => {
    const timeDisplay = useMemo(() => formatDuration(match.timeSpent), [match.timeSpent]);

    return (
        <div className="bg-white border-b border-purple-100">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700"> {index + 1}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{match.type}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-500">⏱️</span>
                    <span className="font-medium text-purple-600">{timeDisplay}</span>
                </div>
            </div>
        </div>
    );
});

const MessageToast = memo(({ message, onClose }: { message: ValidationMessage | null; onClose: () => void }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(onClose, MESSAGE_DURATION);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl shadow-lg text-white text-sm font-medium transition-all duration-300 ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
            role="alert"
        >
            {message.text}
        </div>
    );
});

const CompetitionDetails = memo(({ competition, onValidate, isValidating = false }: CompetitionDetailsProps) => {
    const [isLocalValidating, setIsLocalValidating] = useState(false);
    const [validationMessage, setValidationMessage] = useState<ValidationMessage | null>(null);

    const formattedStartDate = useMemo(() =>
        new Date(competition.startedAt).toLocaleString(),
        [competition.startedAt]
    );

    const formattedFinishedDate = useMemo(() =>
        competition.finishedAt ? new Date(competition.finishedAt).toLocaleString() : null,
        [competition.finishedAt]
    );

    const totalTimeSpent = useMemo(() => {
        const total = competition.matches.reduce((sum, match) =>
            sum + (match.timeSpent || 0), 0
        );
        return formatDuration(total);
    }, [competition.matches]);

    const handleValidate = useCallback(async () => {
        if (isLocalValidating || isValidating || !competition.rawMatches) return;

        setIsLocalValidating(true);
        setValidationMessage(null);

        const success = await onValidate(competition.rawMatches);

        setValidationMessage({
            text: success ? 'Compétition validée avec succès !' : 'Erreur lors de la validation',
            type: success ? 'success' : 'error'
        });

        setIsLocalValidating(false);
    }, [competition, onValidate, isValidating, isLocalValidating]);

    const handleCloseMessage = useCallback(() => setValidationMessage(null), []);

    const isLoading = isLocalValidating || isValidating;

    return (
        <div className="space-y-4 mb-6 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <MessageToast message={validationMessage} onClose={handleCloseMessage} />

            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="text-xl font-bold text-purple-700 flex items-center gap-2">
                    <Trophy className="w-6 h-6" aria-hidden="true" />
                    {competition.name}
                </h3>

                <button
                    onClick={handleValidate}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
                    type="button"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    ) : (
                        <Send className="w-4 h-4" aria-hidden="true" />
                    )}
                    {isLoading ? 'Validation...' : 'Valider ce jeu'}
                </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <InfoRow label="Date de début" value={formattedStartDate} />
                {formattedFinishedDate && (
                    <InfoRow label="Date de fin" value={formattedFinishedDate} />
                )}
                <InfoRow label="Temps total" value={totalTimeSpent} highlight />
                <InfoRow label="Nombre de matchs" value={competition.matches.length} />
            </div>

            <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Medal className="w-4 h-4" aria-hidden="true" />
                    Résultats par match
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {competition.matches.map((match, idx) => (
                        <MatchCard key={idx} match={match} index={idx} />
                    ))}
                </div>
            </div>
        </div>
    );
});


export default function ResultatsPage() {
    const {
        handleValidateCompetition, handleRestart,
        isValidating, competitions, validateMessage,
    } = useEndGameGenerator();

    const hasCompetitions = competitions.length > 0;

    const [globalMessage, setGlobalMessage] = useState<ValidationMessage | null>(null);

    useEffect(() => {
        setGlobalMessage(validateMessage);
    }, [validateMessage]);

    const handleCloseGlobalMessage = useCallback(() => setGlobalMessage(null), []);

    const competitionList = useMemo(() =>
        competitions.map((competition) => (
            <CompetitionDetails
                key={competition.id}
                competition={competition}
                onValidate={handleValidateCompetition}
                isValidating={isValidating}
            />
        )),
        [competitions, handleValidateCompetition, isValidating]
    );

    return (
        <div className="w-full max-w-md mx-auto py-4">
            <MessageToast message={globalMessage} onClose={handleCloseGlobalMessage} />
            {hasCompetitions && (
                  <div className="flex justify-center gap-3 mb-6">
        <button
            onClick={handleRestart}
            disabled={false}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
            type="button"
        >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Recommencer
        </button>
    </div>
            )}

            {hasCompetitions && competitionList}
        </div>
    );
}