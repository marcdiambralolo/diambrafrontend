"use client";
import { cx } from "@/lib/functions";
import type { Consultation } from "@/lib/interfaces";
import { motion } from "framer-motion";
import { 
    CalendarDays, Clock, Gamepad2, History, Target, Timer, 
    UserRound, Trophy, Award, Zap, Calendar, CheckCircle2 
} from "lucide-react";
import { useState } from "react";

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

const getRelativeTime = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return `il y a ${diffInSeconds} seconde${diffInSeconds > 1 ? 's' : ''}`;
    if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} minute${Math.floor(diffInSeconds / 60) > 1 ? 's' : ''}`;
    if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} heure${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''}`;
    return `le ${past.toLocaleDateString('fr-FR')}`;
};

const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Format date au format: 17/12/2026 à 07h00
 */
const formatEditionDate = (date: Date | null): string => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} à ${hours}h${minutes}`;
};

/**
 * Format date courte (sans heure)
 */
const formatShortDate = (date: Date | null): string => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const getEditionStatus = (status: string, isActive: boolean) => {
    if (isActive && status === 'active') {
        return { label: 'En cours', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: <Zap className="w-3 h-3" /> };
    }
    if (status === 'ended') {
        return { label: 'Terminée', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800', icon: <Award className="w-3 h-3" /> };
    }
    return { label: 'À venir', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: <Calendar className="w-3 h-3" /> };
};

// ============================================================================
// COMPOSANT CARTE
// ============================================================================

interface ConsultationCardProps {
    consultation: Consultation;
    index: number;
}

export default function ConsultationCard({ consultation, index }: ConsultationCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const nomJoueur = consultation.clientId?.username || 'Anonyme';
    const combinaison = consultation.combinaison || '????';
    const timeSpent = consultation.timeSpent;
    const createdAt = consultation.createdAt;
    
    const gameEdition = consultation.idjeu as any;
    const editionStatus = gameEdition ? getEditionStatus(gameEdition.status, gameEdition.isActive) : null;
    const editionStartDate = gameEdition?.startgameDate ? new Date(gameEdition.startgameDate) : null;
    const editionEndDate = gameEdition?.endgameDate ? new Date(gameEdition.endgameDate) : null;

    const relativeDate = createdAt ? getRelativeTime(createdAt) : 'Date inconnue';
    const formattedDate = createdAt ? formatDateTime(createdAt) : 'Date inconnue';
    
    // Format des dates d'édition
    const formattedStartDate = formatEditionDate(editionStartDate);
    const formattedEndDate = formatEditionDate(editionEndDate);
    const shortStartDate = formatShortDate(editionStartDate);
    const shortEndDate = formatShortDate(editionEndDate);

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.01 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={cx(
                "group relative overflow-hidden rounded-xl p-4",
                "bg-white dark:bg-gray-800",
                "border border-gray-100 dark:border-gray-700",
                "shadow-sm hover:shadow-lg",
                "transition-all duration-300"
            )}
        >
            <div className="relative z-10 space-y-3">
                {/* Édition et date */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Gamepad2 className="w-3.5 h-3.5 text-purple-600" />
                        </div>
                        <span className="text-xs text-gray-500">{relativeDate}</span>
                    </div>
                    
                    {editionStatus && (
                        <div className={cx(
                            "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
                            editionStatus.bg,
                            editionStatus.color
                        )}>
                            {editionStatus.icon}
                            {editionStatus.label}
                        </div>
                    )}
                </div>

                {/* Combinaison */}
                <div className="flex justify-center gap-1 py-2">
                    {combinaison.split('').map((digit, i) => (
                        <span
                            key={i}
                            className={cx(
                                "w-10 h-10 flex items-center justify-center rounded-lg font-bold text-xl",
                                "bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30",
                                "text-gray-800 dark:text-white",
                                "shadow-inner"
                            )}
                        >
                            {digit}
                        </span>
                    ))}
                </div>

                {/* Informations supplémentaires */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <UserRound className="w-3 h-3" />
                        <span>{nomJoueur}</span>
                    </div>
                    {timeSpent && (
                        <div className="flex items-center gap-1">
                            <Timer className="w-3 h-3" />
                            <span>{timeSpent}</span>
                        </div>
                    )}
                </div>

                {/* Période de l'édition - Format: 17/12/2026 à 07h00 */}
                {editionStartDate && editionEndDate && (
                    <div className="pt-2 text-center">
                        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>
                                {shortStartDate} → {shortEndDate}
                            </span>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-[9px] text-gray-400 mt-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>
                                {formattedEndDate.split('à')[1]?.trim() || ''}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Effet hover */}
            {isHovered && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-purple-500/5 to-transparent" />
            )}
        </motion.article>
    );
}