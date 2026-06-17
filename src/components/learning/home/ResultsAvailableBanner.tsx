'use client';
import { LastEndedGame } from "@/lib/interfaces";
import { History, Trophy } from "lucide-react";
import { memo, useEffect, useState } from 'react';
import CacheLink from "../../commons/CacheLink";

const ResultsAvailableBanner = memo(({
    lastEndedGame,
    onGameCompletelyFinished
}: {
    lastEndedGame: LastEndedGame | null;
    onGameCompletelyFinished?: () => void;
}) => {
    const [hasTriggeredFinish, setHasTriggeredFinish] = useState(false);
    const endGameDate = lastEndedGame ? new Date(lastEndedGame.endgameDate).toLocaleDateString('fr-FR') : null;

    useEffect(() => {
        if (onGameCompletelyFinished && !hasTriggeredFinish) {
            setHasTriggeredFinish(true);
            onGameCompletelyFinished();
        }
    }, [onGameCompletelyFinished, hasTriggeredFinish]);

    return (
        <div className="w-full rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 p-6 mb-6 shadow-xl">
            <div className="flex flex-col items-center gap-4">
                <Trophy className="w-16 h-16 text-yellow-300" />

                <div className="text-center">
                    <p className="text-white font-bold text-xl">Résultats officiels disponibles !</p>
                    <p className="text-white/80 text-sm mt-1">
                        {lastEndedGame
                            ? `Édition terminée le ${endGameDate}`
                            : 'Merci pour votre participation'}
                    </p>

                    <p className="text-yellow-300 text-xs mt-2 font-semibold">
                        ✓ Compétition officiellement clôturée
                    </p>
                </div>

                <CacheLink
                    href="/star/learning/historique/1779760200000"
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white/20 rounded-xl text-white text-sm font-semibold hover:bg-white/30 transition-colors"
                >
                    <History className="w-4 h-4" />
                    <span>Voir l&apos;historique des résultats</span>
                </CacheLink>
            </div>
        </div>
    );
});

ResultsAvailableBanner.displayName = 'ResultsAvailableBanner';

export default ResultsAvailableBanner;