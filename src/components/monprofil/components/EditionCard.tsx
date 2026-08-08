"use client";
import { formatEditionDate } from "@/lib/functions";
import { motion, Variants } from "framer-motion";
import { CalendarDays, ChevronRight, Crown, Flame, Trophy } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

interface EditionCardProps {
    edition: {
        id: string;
        startDate: string;
        endDate: string;
        status: string;
        isActive: boolean;
        winningCombination: string | null;
    };
    gamesCount: number;
}

const EditionCard = memo(({ edition, gamesCount }: EditionCardProps) => {
    const now = new Date();
    const startDate = new Date(edition.startDate);
    const endDate = new Date(edition.endDate);
    const isActive = now >= startDate && now <= endDate && edition.status === 'active';
    const isEnded = edition.status === 'ended' || now > endDate;

    const getStatusBadge = () => {
        if (isActive) {
            return { text: "En cours", color: "bg-green-500", icon: <Flame className="w-3 h-3" /> };
        }
        if (isEnded) {
            return { text: "Terminée", color: "bg-red-500", icon: <Trophy className="w-3 h-3" /> };
        }
        return { text: "À venir", color: "bg-yellow-500", icon: <CalendarDays className="w-3 h-3" /> };
    };

    const status = getStatusBadge();

    return (
        <motion.div
            variants={fadeInUp}
            whileHover={{ y: -2 }}
            className="relative overflow-hidden"
        >
            <Link href={`/star/monprofil/${edition.id}`}>
                <div className="p-5 cursor-pointer">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                                <Crown className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-xs text-white/80">Édition</p>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${status.color} text-white`}>
                                        {status.icon}
                                        {status.text}
                                    </span>
                                </div>
                                <p className="text-white font-bold text-sm mt-1">
                                    Du {formatEditionDate(startDate)} au {formatEditionDate(endDate)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {gamesCount > 0 && (
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{gamesCount}</div>
                                    <div className="text-[10px] text-white/70">parties</div>
                                </div>
                            )}

                            {edition.winningCombination && (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                                    <Trophy className="w-4 h-4 text-yellow-400" />
                                    <span className="text-xs font-semibold text-white">
                                        {edition.winningCombination}
                                    </span>
                                </div>
                            )}
                            <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
});

export default EditionCard;