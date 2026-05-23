"use client";
import { cx, formatEditionDate, getRelativeTime } from "@/lib/functions";
import type { Consultation } from "@/lib/interfaces";
import { motion } from "framer-motion";
import { Award, Calendar, Gamepad2, Timer, UserRound, Zap } from "lucide-react";
import { useState } from "react";

 

const getEditionStatus = (status: string, isActive: boolean) => {
    if (isActive && status === 'active') {
        return { label: 'En cours', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: <Zap className="w-3 h-3" /> };
    }
    if (status === 'ended') {
        return { label: 'Terminée', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800', icon: <Award className="w-3 h-3" /> };
    }
    return { label: 'À venir', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: <Calendar className="w-3 h-3" /> };
};

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
    const formattedStartDate = formatEditionDate(editionStartDate);
    const formattedEndDate = formatEditionDate(editionEndDate);

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

                {editionStartDate && editionEndDate && (
                    <div className="pt-2 text-center">
                        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>
                                {formattedStartDate} → {formattedEndDate}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {isHovered && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-purple-500/5 to-transparent" />
            )}
        </motion.article>
    );
}