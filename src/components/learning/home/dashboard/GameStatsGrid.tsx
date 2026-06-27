'use client';
import { memo } from 'react';
import { LearningConfiguration } from "@/lib/interfaces";

interface GameStatsGridProps {
    gameConfig: LearningConfiguration;
}

export const GameStatsGrid = memo(function GameStatsGrid({ gameConfig }: GameStatsGridProps) {

    return (
        <div className="grid grid-cols-2 gap-4 w-full mt-2">
            <div className="bg-white/15 rounded-2xl p-2 text-center">
                <div className="text-2xl" aria-hidden="true">🎮</div>
                <div className="text-[10px] text-white/70">N° Match</div>
                <div className="text-sm font-bold text-white">{gameConfig?.numeromatch || 'N/A'}</div>
            </div>

            <div className="bg-white/15 rounded-2xl p-2 text-center">
                <div className="text-2xl" aria-hidden="true">📊</div>
                <div className="text-[10px] text-white/70">Niveau</div>
                <div className="text-sm font-bold text-white">{gameConfig?.niveau || 2}</div>
            </div>
        </div>
    );
});