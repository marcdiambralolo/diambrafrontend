'use client';
import Loader from "@/app/loading";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/lacompetition/useAdminConsultationsPageFinished";
import { formatDateFRJeu, formatDateTime, formatNumber } from "@/lib/functions";
import { LastEndedGame } from "@/lib/interfaces";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { Award, Calendar, Clock, History, Hourglass, Star, Timer, Trophy, Users, Zap } from "lucide-react";
import { memo, useEffect, useState } from 'react';
import CacheLink from "../../commons/CacheLink";
import ResultatsPage from "../endgame/ResultatsPage";
import Historique from "../historique/Historique";

const STAT_CARD_COLORS = "from-purple-600 to-indigo-600";
const BANNER_WRAPPER_CLASSES = "w-full mx-auto max-w-2xl px-4 py-4";

const CountdownTimer = ({ targetDate, variant = 'light', onFinish }: any) => {
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

    const textColor = variant === 'light' ? 'text-white' : 'text-gray-800';
    const bgColor = variant === 'light' ? 'bg-black/25' : 'bg-white/80';

    return (
        <div className="flex gap-2 justify-center flex-wrap">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className={`text-center ${bgColor} backdrop-blur-lg rounded-xl px-2 py-1.5 min-w-[55px] shadow-lg`}>
                    <p className={`${textColor} font-black text-xl sm:text-2xl leading-tight`}>{String(value).padStart(2, '0')}</p>
                    <p className={`${textColor}/70 text-[9px] uppercase tracking-wider font-medium`}>{unit === 'days' ? 'j' : unit === 'hours' ? 'h' : unit === 'minutes' ? 'm' : 's'}</p>
                </div>
            ))}
        </div>
    );
};

const HistoryButton = memo(() => (
    <CacheLink href="/star/learning/historique/1779760200000" className="group flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm w-full sm:w-auto">
        <History className="w-4 h-4" /><span>Historique</span>
    </CacheLink>
));

const NotStartedBanner = ({ startDate, handleOpenGame }: any) => (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 mb-6 shadow-xl">
        <div className="relative flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-3"><Hourglass className="w-8 h-8 text-white" /></div>
                <div><p className="text-white font-bold text-lg">Préparez-vous !</p><p className="text-white/80 text-xs">Le jeu n'a pas encore commencé</p></div>
            </div>
            <CountdownTimer targetDate={startDate} variant="light" onFinish={handleOpenGame} />
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl"><Clock className="w-4 h-4 text-white" /><span className="text-white text-xs font-medium">Ouverture {formatDateTime(startDate)}</span></div>
        </div>
    </div>
);

const EndedBanner = ({ lastEndedGame }: { lastEndedGame: LastEndedGame | null }) => (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 p-5 mb-6 shadow-xl">
        <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-yellow-500/20 p-3"><Award className="w-8 h-8 text-yellow-400" /></div>
                <div><p className="text-white font-bold text-lg">Édition terminée !</p><p className="text-gray-300 text-xs">{lastEndedGame ? `Terminée le ${new Date(lastEndedGame.endgameDate).toLocaleDateString('fr-FR')}` : 'Merci pour votre participation'}</p></div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2"><Trophy className="w-5 h-5 text-yellow-400" /><div><p className="text-[10px] text-gray-300">Prochaine édition</p><p className="font-bold text-white text-sm">Très bientôt</p></div></div>
                <HistoryButton />
            </div>
        </div>
    </div>
);

const CountdownTimerLight = ({ targetDate, onFinish }: any) => {
    const [hasFinished, setHasFinished] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            if (targetDate.getTime() - Date.now() <= 0) {
                clearInterval(timer);
                if (!hasFinished) { setHasFinished(true); onFinish?.(); }
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate, hasFinished, onFinish]);

    return null;
};

const GlowButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick} className="group relative block w-full transition-transform hover:scale-[1.02] active:scale-[0.98]" type="button">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 via-green-500 to-green-800 rounded-xl text-white font-bold text-lg shadow-2xl overflow-hidden">
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="animate-spin-slow"><Star className="w-5 h-5" /></div>
            <span className="relative z-10">{children}</span>
            <div className="animate-pulse-x"><Zap className="w-5 h-5" /></div>
        </div>
    </button>
);

const ActiveBanner = ({ endDate, handleEndMatch, startDate, formatDate, gameConfig, demarrerlejeu }: any) => (
    <div className="relative mb-8 transition-all duration-500">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 p-0.5 shadow-2xl">
            <div className="relative bg-gradient-to-br from-amber-600/90 to-red-600/90 backdrop-blur-sm p-4 rounded-3xl">
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <InfoCard icon="🎮" label="N° Match" value={gameConfig?.numeromatch} />
                    <InfoCard icon="📊" label="Niveau" value={gameConfig?.niveau || 2} />
                </div>

                <CountdownTimerLight targetDate={endDate} onFinish={handleEndMatch} />
                <GlowButton onClick={demarrerlejeu}>🚀 JOUER</GlowButton>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <DateCard icon={<Calendar className="w-3 h-3" />} label="DÉBUT" date={startDate} format={formatDate} />
                    <DateCard icon={<Timer className="w-3 h-3" />} label="FIN" date={endDate} format={formatDate} />
                </div>
            </div>
        </div>
    </div>
);

const InfoCard = ({ icon, label, value }: { icon: string; label: string; value: any }) => (
    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-lg">
        <div className="text-center">
            <div className="text-3xl mb-1">{icon}</div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider">{label}</div>
            <div className="text-sm font-bold text-white">{value}</div>
        </div>
    </div>
);

const DateCard = ({ icon, label, date, format }: any) => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20 transition-all hover:bg-white/20">
        <div className="flex items-center gap-2 text-white/80 text-[10px] mb-1">
            {icon}
            <span>{label}</span>
        </div>
        <div className="text-white font-bold text-[11px]">{format(date)}</div>
    </div>
);

const StatCard = memo(({ value, label, icon, color }: { value: number | null; label: string; icon: React.ReactNode; color: string }) => (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-xl cursor-pointer group border border-white/20 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-white/15 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold opacity-90">{label}</span>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">{icon}</div>
            </div>
            <p className="text-3xl font-extrabold tracking-tight">{value !== null ? formatNumber(value) : '--'}</p>
        </div>
    </div>
));

const BANNER_CONFIG = {
    ended: (props: any) => <EndedBanner lastEndedGame={props.lastEndedGame} />,
    active: (props: any) => (
        <ActiveBanner
            endDate={props.endDate}
            handleEndMatch={props.onEndMatch}
            startDate={props.startDate}
            formatDate={formatDateFRJeu}
            gameConfig={props.gameConfig}
            demarrerlejeu={props.demarrerJeu}
        />
    ),
    'not-started': (props: any) => (
        <NotStartedBanner startDate={props.startDate} handleOpenGame={props.onOpenGame} />
    ),
} as const;

const BannersSection = memo((props: any) => {
    const bannerKey = props.showEnded ? 'ended' : (props.showActive && props.endDate && props.startDate) ? 'active' : (props.showNotStarted && props.startDate) ? 'not-started' : 'active';
    const Banner = BANNER_CONFIG[bannerKey as keyof typeof BANNER_CONFIG];

    return (
        <div className="max-w-md mx-auto">
            {Banner && <Banner {...props} />}
            <StatCard value={props.stats?.subscribers ?? null} label="Inscrits" icon={<Users className="w-3.5 h-3.5" />} color={STAT_CARD_COLORS} />
        </div>
    );
});

function LaCompetition() {
    const data = useAdminConsultationsPageFinished();
    const { gameStarted } = useMonEtoileStore();

    if (data.loading) return <Loader />;

    return (
        <div className={BANNER_WRAPPER_CLASSES}>
            <ResultatsPage />
            <BannersSection
                showNotStarted={data.hasNotStartedEdition}
                showActive={gameStarted}
                showEnded={data.showEnded}
                startDate={data.startDate}
                endDate={data.endDate}
                gameConfig={data.gameConfig}
                lastEndedGame={data.lastEndedGame}
                stats={data.stats}
                onOpenGame={data.handleOpenGame}
                onEndMatch={data.handleEndMatch}
                demarrerJeu={data.demarrerJeu}
            />
            <Historique />
        </div>
    );
}

export default memo(LaCompetition);