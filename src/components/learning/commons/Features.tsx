'use client';
import { CompetitionSummary, useCompetitionValidation } from "@/hooks/learning/endgame/useEndGameGenerator";
import { useCommon } from '@/hooks/learning/home/useCommon';
import { formatDateTime } from "@/lib/functions";
import { LastEndedGame, MatchInfo, TimeLeft } from "@/lib/interfaces";
import { APP_NAME, CURRENT_YEAR, MESSAGE_DURATION, NO_DATA_PLACEHOLDER, STATUS_CONFIG, TIME_UNITS } from "@/lib/learning/constantes";
import { formatDuration } from "@/lib/learning/functions";
import { Award, Clock, HelpCircle, History, Hourglass, Loader2, Medal, RotateCcw, Send, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import CacheLink from "../../commons/CacheLink";
import { GlowButton } from "./Boutons";

export const StatusBadge = memo(({ text, color }: { text: string; color: string }) => (
    <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${color === 'red' ? 'bg-red-500' : 'bg-green-500'
        } text-white flex items-center gap-1`}>
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        {text}
    </div>
));

export const FooterSection = memo(() => {
    const { onlineStatus } = useCommon();
    const status = useMemo(() =>
        onlineStatus ? STATUS_CONFIG.online : STATUS_CONFIG.offline,
        [onlineStatus]
    );

    return (
        <footer className="relative mt-4 bg-gradient-to-r from-gray-900 to-gray-900 rounded-xl p-4 text-center shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10" />
            <div className="relative flex items-center justify-between text-xs text-white">
                <span>© {CURRENT_YEAR}</span>
                <StatusBadge text={status.text} color={status.color} />
            </div>
            <p className="text-white mt-2">DIAMBRA CORPORATION • Tous droits réservés.</p>
        </footer>
    );
});

export const HeaderSection = memo(() => (
    <div className="flex flex-col items-center justify-center mt-2 mb-2">
        <div className="relative">
            <h1 className="text-xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                {APP_NAME}
            </h1>
            <div className="absolute -top-2 -right-6 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75" />
        </div>

        <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
        </div>
    </div>
));

export const HelpButton = memo(() => {
     const router = useRouter();    

    const handleClick = useCallback(() => {
         router.push('/star/learning/help');       
    }, [router]);

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
            aria-label="Aide"
            type="button"
        >
            <HelpCircle className="w-6 h-6" aria-hidden="true" />
        </button>
    );
});

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
}

interface ValidationMessage {
    text: string;
    type: 'success' | 'error';
}

const TOAST_POSITION = "fixed top-4 left-1/2 -translate-x-1/2 z-50";

const InfoRow = memo(({ label, value, highlight = false }: InfoRowProps) => (
    <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
        <span className="font-semibold text-gray-700">{label}:</span>
        <span className={`${highlight ? 'text-purple-600 font-bold text-lg' : 'text-gray-900'}`}>
            {value ?? NO_DATA_PLACEHOLDER}
        </span>
    </div>
));

export const MatchCard = memo(({ match, index }: MatchCardProps) => {
    const timeDisplay = useMemo(() => formatDuration(match.timeSpent), [match.timeSpent]);

    return (
        <div className="bg-white border-b border-purple-100 py-2 last:border-0">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Match {index + 1}</span>
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

export const MessageToast = memo(({ message, onClose }: { message: ValidationMessage | null; onClose: () => void }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(onClose, MESSAGE_DURATION);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div
            className={`${TOAST_POSITION} px-4 py-2 rounded-xl shadow-lg text-white text-sm font-medium transition-all duration-300 ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
            role="alert"
        >
            {message.text}
        </div>
    );
});

export const CompetitionDetails = memo(({ competition, onValidate }: CompetitionDetailsProps) => {
    const {
        isLoading,
        validationMessage,
        formattedStartDate,
        formattedFinishedDate,
        totalTimeSpent,
        handleValidate,
        handleCloseMessage,
    } = useCompetitionValidation(onValidate, competition);

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

export const RestartButton = memo(({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) => (
    <div className="flex justify-center gap-3 mb-6">
        <button
            onClick={onClick}
            disabled={disabled}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
            type="button"
        >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Recommencer
        </button>
    </div>
));

interface CountdownTimerProps {
    targetDate: Date;
    onFinish: () => void;
}

interface NotStartedBannerProps {
    startDate: Date;
    handleOpenGame: () => void;
}

interface EndedBannerProps {
    lastEndedGame: LastEndedGame | null;
}

interface ActiveBannerProps {
    gameConfig: any;
    demarrerJeu: () => void;
}

export const CountdownTimer = memo(({ targetDate, onFinish }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [hasFinished, setHasFinished] = useState(false);

    const calculateTimeLeft = useCallback(() => {
        const diff = targetDate.getTime() - Date.now();

        if (diff <= 0) {
            if (!hasFinished) {
                setHasFinished(true);
                onFinish();
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
            seconds: Math.floor((diff % 60000) / 1000)
        };
    }, [targetDate, hasFinished, onFinish]);

    useEffect(() => {
        const updateTimer = () => {
            setTimeLeft(calculateTimeLeft());
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);

        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    return (
        <div className="flex gap-2 justify-center flex-wrap">
            {TIME_UNITS.map(({ key, label }) => (
                <div key={key} className="text-center bg-black/25 backdrop-blur-lg rounded-xl px-2 py-1.5 min-w-[55px] shadow-lg">
                    <p className="text-white font-black text-xl leading-tight">
                        {String(timeLeft[key as keyof TimeLeft]).padStart(2, '0')}
                    </p>
                    <p className="text-white/70 text-[9px] uppercase tracking-wider">{label}</p>
                </div>
            ))}
        </div>
    );
});

export const HistoryButton = memo(() => (
    <CacheLink
        href="/star/learning/historique/1779760200000"
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
        <History className="w-4 h-4" aria-hidden="true" />
        <span>Historique</span>
    </CacheLink>
));

export const NotStartedBanner = memo(({ startDate, handleOpenGame }: NotStartedBannerProps) => (
    <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 mb-6 shadow-xl">
        <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-2">
                    <Hourglass className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                    <p className="text-white font-bold">Préparez-vous !</p>
                    <p className="text-white/80 text-xs">Le jeu n'a pas encore commencé</p>
                </div>
            </div>
            <CountdownTimer targetDate={startDate} onFinish={handleOpenGame} />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-xl">
                <Clock className="w-3 h-3 text-white" aria-hidden="true" />
                <span className="text-white text-xs">Ouverture {formatDateTime(startDate)}</span>
            </div>
        </div>
    </div>
));

export const EndedBanner = memo(({ lastEndedGame }: EndedBannerProps) => {
    const endGameDate = useMemo(() =>
        lastEndedGame ? new Date(lastEndedGame.endgameDate).toLocaleDateString('fr-FR') : null,
        [lastEndedGame]
    );

    return (
        <div className="rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 p-5 mb-6 shadow-xl">
            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-yellow-500/20 p-2">
                        <Award className="w-6 h-6 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div>
                        <p className="text-white font-bold">Édition terminée !</p>
                        <p className="text-gray-300 text-xs">
                            {lastEndedGame ? `Terminée le ${endGameDate}` : 'Merci pour votre participation'}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
                        <Trophy className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                        <div>
                            <p className="text-[10px] text-gray-300">Prochaine édition</p>
                            <p className="font-bold text-white text-xs">Très bientôt</p>
                        </div>
                    </div>
                    <HistoryButton />
                </div>
            </div>
        </div>
    );
});

export const ActiveBanner = memo(({ gameConfig, demarrerJeu }: ActiveBannerProps) => {

    return (
        <div className="w-full rounded-3xl bg-gradient-to-br from-yellow-600 to-red-600 p-2 mb-4 shadow-xl">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/15 rounded-2xl p-3 text-center">
                    <div className="text-3xl" aria-hidden="true">🎮</div>
                    <div className="text-[10px] text-white/70">N° Match</div>
                    <div className="text-sm font-bold text-white">{gameConfig?.numeromatch || 'N/A'}</div>
                </div>
                <div className="bg-white/15 rounded-2xl p-3 text-center">
                    <div className="text-3xl" aria-hidden="true">📊</div>
                    <div className="text-[10px] text-white/70">Niveau</div>
                    <div className="text-sm font-bold text-white">{gameConfig?.niveau || 2}</div>
                </div>
            </div>

            <GlowButton onClick={demarrerJeu}>🚀 JOUER</GlowButton> 
        </div>
    );
}); 