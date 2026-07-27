'use client';
import { ArrowRight, Clock, History, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { memo, useState } from 'react';

const AnimatedIcon = memo(() => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className="rounded-full bg-white/20 p-4 backdrop-blur-sm transition-all duration-500 ease-out"
                style={{
                    transform: isHovered ? 'scale(1.1) rotate(360deg)' : 'scale(1) rotate(0deg)',
                }}
            >
                <Trophy
                    className="w-12 h-12 text-yellow-300"
                    aria-hidden="true"
                />
            </div>

            <div
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-400/20 to-purple-400/20 blur-xl transition-all duration-300"
                style={{
                    opacity: isHovered ? 0.8 : 0,
                    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                }}
            />
        </div>
    );
});

const StatusBadge = memo(() => (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in-up">
        <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
        </span>
        <span className="text-xs font-medium text-white/80">Terminé</span>
    </div>
));

const ActionButton = memo(({ href }: { href: string }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="w-full max-w-xs"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link
                href={href}
                className="group relative flex items-center justify-center gap-3 bg-white text-purple-700 font-bold py-3.5 px-6 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
                <div
                    className="absolute inset-0 bg-gradient-to-r from-purple-50 to-indigo-50 transition-transform duration-400 ease-in-out"
                    style={{
                        transform: isHovered ? 'translateX(0%)' : 'translateX(-100%)',
                    }}
                />

                <div className="relative flex items-center gap-3">
                    <History className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span>Voir l'historique</span>
                    <ArrowRight
                        className={`w-4 h-4 transition-all duration-300 ${isHovered ? 'translate-x-1' : ''
                            }`}
                    />
                </div>
            </Link>
        </div>
    );
});

const styles = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes pulse-slow {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.05); }
    }
    
    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(15px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes shimmer {
        0% { transform: translateX(-100%) rotate(45deg); }
        100% { transform: translateX(100%) rotate(45deg); }
    }
    
    .animate-float {
        animation: float 3s ease-in-out infinite;
    }
    
    .animate-pulse-slow {
        animation: pulse-slow 4s ease-in-out infinite;
    }
    
    .animate-fade-in-up {
        opacity: 0;
        animation: fade-in-up 0.6s ease-out forwards;
    }
    
    .animate-shimmer {
        animation: shimmer 2s infinite;
    }
    
    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
    .delay-500 { animation-delay: 0.5s; }
    .delay-700 { animation-delay: 0.7s; }
    .delay-1000 { animation-delay: 1s; }
`;

const NoCompetitionBanner = memo(() => {
    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: styles }} />

            <div className="relative w-full overflow-hidden animate-fade-in-up">
                {/* Fond avec gradient */}
                <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 via-purple-500 to-orange-600 p-[1px] shadow-2xl">
                    <div className="relative rounded-3xl bg-gradient-to-br from-purple-600/90 to-orange-600/90 p-8 backdrop-blur-sm overflow-hidden">

                        {/* Particules d'arrière-plan */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-pulse-slow" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

                            {/* Étoiles flottantes */}
                            <div className="absolute w-1 h-1 bg-white/20 rounded-full animate-float" style={{ top: '20%', left: '10%', animationDelay: '0s' }} />
                            <div className="absolute w-1 h-1 bg-white/20 rounded-full animate-float" style={{ top: '50%', left: '85%', animationDelay: '1s' }} />
                            <div className="absolute w-1 h-1 bg-white/20 rounded-full animate-float" style={{ top: '80%', left: '30%', animationDelay: '2s' }} />

                            {/* Effet de brillance glissante */}
                            <div className="absolute inset-0 -translate-x-full animate-shimmer">
                                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform rotate-45" />
                            </div>
                        </div>

                        {/* Contenu principal */}
                        <div className="relative flex flex-col items-center gap-6 text-center">
                            <div className="animate-fade-in-up delay-100">
                                <AnimatedIcon />
                            </div>

                            <div className="animate-fade-in-up delay-200">
                                <StatusBadge />
                            </div>

                            <div className="space-y-2 animate-fade-in-up delay-300">
                                <h2 className="text-3xl font-bold text-white tracking-tight">
                                    🏆 Édition terminée !
                                </h2>

                                <p className="text-white/80 text-sm max-w-sm mx-auto">
                                    Le jeu est terminé. Consultez les résultats et les classements.
                                </p>
                            </div>
                            <div className="animate-fade-in-up delay-700">
                                <ActionButton href="/star/learning/historique/123456789" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

NoCompetitionBanner.displayName = 'NoCompetitionBanner';

export default NoCompetitionBanner;