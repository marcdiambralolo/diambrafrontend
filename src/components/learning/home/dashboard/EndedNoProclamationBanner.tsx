'use client';
import { memo } from 'react';
import { Award, History } from "lucide-react";
import { LastEndedGame } from "@/lib/interfaces";
import CacheLink from '@/components/commons/CacheLink';

interface EndedNoProclamationBannerProps {
    lastEndedGame: LastEndedGame | null;
}

export const EndedNoProclamationBanner = memo(function EndedNoProclamationBanner({
    lastEndedGame
}: EndedNoProclamationBannerProps) {
    const endGameDate = lastEndedGame
        ? new Date(lastEndedGame.endgameDate).toLocaleDateString('fr-FR')
        : null;

    return (
        <div className="rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 p-5 mb-6 shadow-xl">
            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-yellow-500/20 p-2">
                        <Award className="w-6 h-6 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div>
                        <p className="text-white font-bold">Édition terminée</p>
                        <p className="text-gray-300 text-xs">
                            {lastEndedGame ? `Terminée le ${endGameDate}` : 'Merci pour votre participation'}
                        </p>
                    </div>
                </div>
                <CacheLink
                    href="/star/learning/historique/1779760200000"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl"
                >
                    <History className="w-4 h-4" aria-hidden="true" />
                    <span>Historique</span>
                </CacheLink>
            </div>
        </div>
    );
});