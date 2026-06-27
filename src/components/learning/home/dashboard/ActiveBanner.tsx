'use client';
import { memo, useEffect, useState } from 'react';
import { Trophy, History, Clock, AlertCircle } from "lucide-react";
import { LearningConfiguration } from "@/lib/interfaces";
import { CountdownTimer } from './CountdownTimer';
import { GameStatsGrid } from './GameStatsGrid';
import { GlowButton } from '../../commons/Boutons';
import Link from 'next/link';

interface ActiveBannerProps {
    gameConfig: LearningConfiguration;
    demarrerJeu: () => void;
    endDate: Date;
    showButton: boolean;
    onFinish: () => void;
    countdown?: number | null;
    isTimeUp?: boolean;
}

const ActiveBanner = ({ 
    gameConfig, 
    demarrerJeu, 
    endDate, 
    showButton, 
    onFinish,
    countdown,
    isTimeUp = false
}: ActiveBannerProps) => {
    const [showHistory, setShowHistory] = useState(false);

    // Si le temps est écoulé, afficher directement l'historique
    useEffect(() => {
        if (isTimeUp) {
            // Petit délai pour la transition
            const timer = setTimeout(() => {
                setShowHistory(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isTimeUp]);

    // Si le temps est écoulé, afficher la vue historique
    if (isTimeUp || showHistory) {
        return (
            <div className="w-full rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 p-6 mb-6 shadow-xl animate-in fade-in duration-500">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="rounded-full bg-white/20 p-4">
                        <Trophy className="w-12 h-12 text-yellow-300" aria-hidden="true" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white">🏆 Édition terminée !</h2>
                    
                    <p className="text-white/80 text-sm max-w-xs">
                        Le jeu est terminé. Consultez vos résultats et votre historique.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full max-w-xs">
                        <Link
                            href="/star/learning/historique"
                            className="flex items-center justify-center gap-2 bg-white text-purple-700 font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all"
                        >
                            <History className="w-5 h-5" />
                            Voir l'historique
                        </Link>
                        
                        <button
                            onClick={onFinish}
                            className="flex items-center justify-center gap-2 bg-white/20 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/30 transition-all"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Vue normale du jeu actif
    return (
        <div className="w-full rounded-3xl bg-gradient-to-br from-yellow-600 to-red-400 p-5 mb-6 shadow-xl">
            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white/20 p-2">
                        <Trophy className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                        <p className="text-white font-bold">Édition en cours</p>
                        <p className="text-white/80 text-xs">Participez avant la fin !</p>
                    </div>
                </div>

                {/* Compte à rebours avec alerte visuelle */}
                <div className="text-center w-full">
                    <p className="text-white/80 text-xs mb-2 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" />
                        Temps restant
                    </p>
                    
                    {countdown !== null && countdown !== undefined && (
                        <div className={`text-2xl font-bold text-white mb-2 transition-colors duration-300 ${
                            countdown < 60 ? 'text-yellow-300 animate-pulse' : ''
                        }`}>
                            {Math.floor(countdown / 60)}m {countdown % 60}s
                        </div>
                    )}
                    
                    <CountdownTimer targetDate={endDate} onFinish={onFinish} />
                </div>

                <GameStatsGrid gameConfig={gameConfig} />

                {showButton && countdown !== 0 && (
                    <GlowButton onClick={demarrerJeu} variant="success" size="lg">
                        🚀 JOUER MAINTENANT
                    </GlowButton>
                )}

                {/* Indicateur de fin proche */}
                {countdown !== null && countdown! < 300 && countdown! > 0 && (
                    <div className="flex items-center gap-2 text-yellow-200 text-xs animate-pulse">
                        <AlertCircle className="w-3 h-3" />
                        <span>Le jeu se termine bientôt !</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(ActiveBanner);