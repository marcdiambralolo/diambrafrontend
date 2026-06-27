'use client';
import { memo, useEffect, useState } from 'react';
import { History, Trophy } from "lucide-react";
import { LastEndedGame } from "@/lib/interfaces";
import { BannerInfo } from './BannerInfo';
import CacheLink from '@/components/commons/CacheLink';

interface ResultsAvailableBannerProps {
    lastEndedGame: LastEndedGame | null;
    onGameCompletelyFinished?: () => void;
}

const ResultsAvailableBanner = ({
    lastEndedGame,
    onGameCompletelyFinished
}: ResultsAvailableBannerProps) => {
    const [hasTriggeredFinish, setHasTriggeredFinish] = useState(false);

    const endGameDate = lastEndedGame
        ? new Date(lastEndedGame.endgameDate).toLocaleDateString('fr-FR')
        : null;

    useEffect(() => {
        if (onGameCompletelyFinished && !hasTriggeredFinish) {
            setHasTriggeredFinish(true);
            onGameCompletelyFinished();
        }
    }, [onGameCompletelyFinished, hasTriggeredFinish]);

    return (
        <div className="w-full rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 p-6 mb-6 shadow-xl">
            <div className="flex flex-col items-center gap-4">
                <Trophy className="w-16 h-16 text-yellow-300" aria-hidden="true" />
                <BannerInfo endGameDate={endGameDate} />

                <CacheLink
                    href="/star/learning/historique/1779760200000"
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white/20 rounded-xl text-white text-sm font-semibold"
                >
                    <History className="w-4 h-4" aria-hidden="true" />
                    <span>Voir l&apos;historique des résultats</span>
                </CacheLink>
            </div>
        </div>
    );
};

export default memo(ResultsAvailableBanner);