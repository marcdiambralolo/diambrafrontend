'use client';
import Loader from "@/app/loading";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/lacompetition/useAdminConsultationsPageFinished";
import { formatDateFRJeu, formatDateTime, formatNumber } from "@/lib/functions";
import { LastEndedGame } from "@/lib/interfaces";
import { Award, Calendar, Clock, History, Hourglass, Timer, Trophy, Users } from "lucide-react";
import CacheLink from "../../commons/CacheLink";
import { memo, useEffect, useState } from 'react';

const CountdownTimer = ({ targetDate, onFinish }: any) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [hasFinished, setHasFinished] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const diff = targetDate.getTime() - Date.now();
            if (diff <= 0) {
                clearInterval(timer);
                if (!hasFinished) { setHasFinished(true); onFinish?.(); }
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000)
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate, hasFinished, onFinish]);

    return (
        <div className="flex gap-2 justify-center flex-wrap">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center bg-black/25 backdrop-blur-lg rounded-xl px-2 py-1.5 min-w-[55px] shadow-lg">
                    <p className="text-white font-black text-xl leading-tight">{String(value).padStart(2, '0')}</p>
                    <p className="text-white/70 text-[9px] uppercase tracking-wider">{unit === 'days' ? 'j' : unit === 'hours' ? 'h' : unit === 'minutes' ? 'm' : 's'}</p>
                </div>
            ))}
        </div>
    );
};

const HistoryButton = memo(() => (
    <CacheLink href="/star/learning/historique/1779760200000" className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all">
        <History className="w-4 h-4" />
        <span>Historique</span>
    </CacheLink>
));

const NotStartedBanner = ({ startDate, handleOpenGame }: any) => (
    <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 mb-6 shadow-xl">
        <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-2"><Hourglass className="w-6 h-6 text-white" /></div>
                <div><p className="text-white font-bold">Préparez-vous !</p><p className="text-white/80 text-xs">Le jeu n'a pas encore commencé</p></div>
            </div>
            <CountdownTimer targetDate={startDate} onFinish={handleOpenGame} />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-xl">
                <Clock className="w-3 h-3 text-white" />
                <span className="text-white text-xs">Ouverture {formatDateTime(startDate)}</span>
            </div>
        </div>
    </div>
);

const EndedBanner = ({ lastEndedGame }: { lastEndedGame: LastEndedGame | null }) => (
    <div className="rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 p-5 mb-6 shadow-xl">
        <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-yellow-500/20 p-2"><Award className="w-6 h-6 text-yellow-400" /></div>
                <div><p className="text-white font-bold">Édition terminée !</p><p className="text-gray-300 text-xs">{lastEndedGame ? `Terminée le ${new Date(lastEndedGame.endgameDate).toLocaleDateString('fr-FR')}` : 'Merci pour votre participation'}</p></div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <div><p className="text-[10px] text-gray-300">Prochaine édition</p><p className="font-bold text-white text-xs">Très bientôt</p></div>
                </div>
                <HistoryButton />
            </div>
        </div>
    </div>
);

const GlowButton = ({ children, onClick }: any) => (
    <button onClick={onClick} className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:scale-[1.02] transition-all">
        {children}
    </button>
);

const ActiveBanner = ({ endDate, startDate, formatDate, gameConfig, demarrerJeu }: any) => (
    <div className="rounded-3xl bg-gradient-to-br from-yellow-600 to-red-600 p-2 mb-4 shadow-xl">
        <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/15 rounded-2xl p-3 text-center">
                <div className="text-3xl">🎮</div>
                <div className="text-[10px] text-white/70">N° Match</div>
                <div className="text-sm font-bold text-white">{gameConfig?.numeromatch}</div>
            </div>
            <div className="bg-white/15 rounded-2xl p-3 text-center">
                <div className="text-3xl">📊</div>
                <div className="text-[10px] text-white/70">Niveau</div>
                <div className="text-sm font-bold text-white">{gameConfig?.niveau || 2}</div>
            </div>
        </div>

        <GlowButton onClick={demarrerJeu}>🚀 JOUER</GlowButton>

        <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/10 rounded-xl p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-white/80 text-[10px]">
                    <Calendar className="w-3 h-3" />
                    <span>DÉBUT</span>
                </div>
                <div className="text-white font-bold text-[11px]">{formatDate(startDate)}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-white/80 text-[10px]">
                    <Timer className="w-3 h-3" />
                    <span>FIN</span>
                </div>
                <div className="text-white font-bold text-[11px]">{formatDate(endDate)}</div>
            </div>
        </div>
    </div>
);

const StatCard = memo(({ value, label, icon, color }: any) => (
    <div className={`rounded-2xl bg-gradient-to-br ${color} p-4 text-white shadow-xl`}>
        <div className="flex items-center justify-between mb-1">
            <span className="text-xs opacity-90">{label}</span>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">{icon}</div>
        </div>
        <p className="text-3xl font-bold">{value !== null ? formatNumber(value) : '--'}</p>
    </div>
));

function BanniereCompetition() {
    const {
        demarrerJeu, handleOpenGame, handleEndMatch, showEnded, loading, showActive,
        showNotStarted, lastEndedGame, endDate, startDate, gameConfig, stats,
    } = useAdminConsultationsPageFinished();

    if (loading) return <Loader />;

    const isEnded = showEnded;
    const isActive = !isEnded && showActive;
    const isNotStarted = !isEnded && !showActive && showNotStarted;

    return (
        <div className="max-w-md mx-auto">
            {isEnded && <EndedBanner lastEndedGame={lastEndedGame} />}
            {isActive && (
                <ActiveBanner
                    endDate={endDate}
                    handleEndMatch={handleEndMatch}
                    startDate={startDate}
                    formatDate={formatDateFRJeu}
                    gameConfig={gameConfig}
                    demarrerJeu={demarrerJeu}
                />
            )}
            {isNotStarted && (
                <NotStartedBanner startDate={startDate} handleOpenGame={handleOpenGame} />
            )}

            <StatCard
                value={stats?.subscribers ?? null}
                label="Inscrits"
                icon={<Users className="w-3.5 h-3.5" />}
                color="from-purple-600 to-indigo-600"
            />
        </div>
    );
}

export default memo(BanniereCompetition);