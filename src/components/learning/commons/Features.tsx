'use client';
import { useCommon } from '@/hooks/learning/home/useCommon';
import { APP_NAME, CURRENT_YEAR, MESSAGE_DURATION, STATUS_CONFIG } from "@/lib/learning/constantes";
import { HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useMemo } from 'react';

const TOAST_POSITION = "fixed top-4 left-1/2 -translate-x-1/2 z-50";

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
            <p className="text-white mt-2">DIAMBRA CORPORATION</p>
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

interface ValidationMessage {
    text: string;
    type: 'success' | 'error';
}

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

//     const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//     const [hasFinished, setHasFinished] = useState(false);

//     const calculateTimeLeft = useCallback(() => {
//         const diff = targetDate.getTime() - Date.now();

//         if (diff <= 0) {
//             if (!hasFinished) {
//                 setHasFinished(true);
//                 onFinish();
//             }
//             return { days: 0, hours: 0, minutes: 0, seconds: 0 };
//         }

//         return {
//             days: Math.floor(diff / 86400000),
//             hours: Math.floor((diff % 86400000) / 3600000),
//             minutes: Math.floor((diff % 3600000) / 60000),
//             seconds: Math.floor((diff % 60000) / 1000)
//         };
//     }, [targetDate, hasFinished, onFinish]);

//     useEffect(() => {
//         const updateTimer = () => {
//             setTimeLeft(calculateTimeLeft());
//         };

//         updateTimer();
//         const timer = setInterval(updateTimer, 1000);

//         return () => clearInterval(timer);
//     }, [calculateTimeLeft]);

//     return (
//         <div className="flex gap-2 justify-center flex-wrap">
//             {TIME_UNITS.map(({ key, label }) => (
//                 <div key={key} className="text-center bg-black/25 backdrop-blur-lg rounded-xl px-2 py-1.5 min-w-[55px] shadow-lg">
//                     <p className="text-white font-black text-xl leading-tight">
//                         {String(timeLeft[key as keyof TimeLeft]).padStart(2, '0')}
//                     </p>
//                     <p className="text-white/70 text-[9px] uppercase tracking-wider">{label}</p>
//                 </div>
//             ))}
//         </div>
//     );
// });
 
//     <CacheLink
//         href="/star/learning/historique/1779760200000"
//         className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
//     >
//         <History className="w-4 h-4" aria-hidden="true" />
//         <span>Historique</span>
//     </CacheLink>
// ));

// export const NotStartedBanner = memo(({ startDate, handleOpenGame }: NotStartedBannerProps) => (
//     <div className="w-full rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 mb-6 shadow-xl">
//         <div className="flex flex-col items-center gap-3">
//             <div className="flex items-center gap-3">
//                 <div className="rounded-full bg-white/20 p-2">
//                     <Hourglass className="w-6 h-6 text-white" aria-hidden="true" />
//                 </div>
//                 <div>
//                     <p className="text-white font-bold">Préparez-vous !</p>
//                     <p className="text-white/80 text-xs">Le jeu n'a pas encore commencé</p>
//                 </div>
//             </div>
//             <CountdownTimer targetDate={startDate} onFinish={handleOpenGame} />
//             <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-xl">
//                 <Clock className="w-3 h-3 text-white" aria-hidden="true" />
//                 <span className="text-white text-xs">Ouverture {formatDateTime(startDate)}</span>
//             </div>
//         </div>
//     </div>
// ));

// export const EndedBanner = memo(({ lastEndedGame }: EndedBannerProps) => {
//     const endGameDate = useMemo(() =>
//         lastEndedGame ? new Date(lastEndedGame.endgameDate).toLocaleDateString('fr-FR') : null,
//         [lastEndedGame]
//     );

//     return (
//         <div className="rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 p-5 mb-6 shadow-xl">
//             <div className="flex flex-col items-center gap-3">
//                 <div className="flex items-center gap-3">
//                     <div className="rounded-full bg-yellow-500/20 p-2">
//                         <Award className="w-6 h-6 text-yellow-400" aria-hidden="true" />
//                     </div>
//                     <div>
//                         <p className="text-white font-bold">Édition terminée !</p>
//                         <p className="text-gray-300 text-xs">
//                             {lastEndedGame ? `Terminée le ${endGameDate}` : 'Merci pour votre participation'}
//                         </p>
//                     </div>
//                 </div>
//                 <div className="flex flex-wrap items-center justify-center gap-3">
//                     <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
//                         <Trophy className="w-4 h-4 text-yellow-400" aria-hidden="true" />
//                         <div>
//                             <p className="text-[10px] text-gray-300">Prochaine édition</p>
//                             <p className="font-bold text-white text-xs">Très bientôt</p>
//                         </div>
//                     </div>
//                     <HistoryButton />
//                 </div>
//             </div>
//         </div>
//     );
// });

// export const ActiveBanner = memo(({ gameConfig, demarrerJeu }: ActiveBannerProps) => {

//     return (
//         <div className="w-full rounded-3xl bg-gradient-to-br from-yellow-600 to-red-600 p-2 mb-4 shadow-xl">
//             <div className="grid grid-cols-2 gap-4 mb-4">

//                 <div className="bg-white/15 rounded-2xl p-3 text-center">
//                     <div className="text-3xl" aria-hidden="true">🎮</div>
//                     <div className="text-[10px] text-white/70">N° Match</div>
//                     <div className="text-sm font-bold text-white">{gameConfig?.numeromatch || 'N/A'}</div>
//                 </div>

//                 <div className="bg-white/15 rounded-2xl p-3 text-center">
//                     <div className="text-3xl" aria-hidden="true">📊</div>
//                     <div className="text-[10px] text-white/70">Niveau</div>
//                     <div className="text-sm font-bold text-white">{gameConfig?.niveau || 2}</div>
//                 </div>
//             </div>

//             <GlowButton onClick={demarrerJeu}>🚀 JOUER</GlowButton>
//         </div>
//     );
// }); 