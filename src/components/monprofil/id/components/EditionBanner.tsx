"use client";
import CacheLink from "@/components/commons/CacheLink";
import { formatEditionDate } from "@/lib/functions";
import { EditionInfo } from "@/lib/interfaces";
import { motion } from "framer-motion";
import { Award, Calendar, Clock, Crown, Gamepad2, Trophy, Zap } from "lucide-react";
import { memo } from "react";

interface EditionBannerProps {
    edition: EditionInfo;
}

const EditionBanner = memo(({ edition }: EditionBannerProps) => {
    const now = new Date();
    const startDate = new Date(edition.startDate);
    const endDate = new Date(edition.endDate);
    const isActive = now >= startDate && now <= endDate && edition.status === 'active';
    const isEnded = edition.status === 'ended' || now > endDate;

    const getStatusBadge = () => {
        if (isActive) {
            return {
                text: "Édition en cours",
                color: "bg-gradient-to-r from-green-400 to-emerald-500",
                icon: <Zap className="w-3 h-3 animate-pulse" />,
                gradient: "from-green-400/10 to-emerald-500/10"
            };
        }
        if (isEnded) {
            return {
                text: "Édition terminée",
                color: "bg-gradient-to-r from-red-400 to-rose-500",
                icon: <Trophy className="w-3 h-3" />,
                gradient: "from-red-400/10 to-rose-500/10"
            };
        }
        return {
            text: "Édition à venir",
            color: "bg-gradient-to-r from-yellow-400 to-amber-500",
            icon: <Calendar className="w-3 h-3" />,
            gradient: "from-yellow-400/10 to-amber-500/10"
        };
    };

    const status = getStatusBadge();

    return (
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-800 p-6 shadow-2xl mb-8 border border-white/10"
        >
            <div className="absolute inset-0 opacity-20">
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-pink-400 blur-3xl animate-pulse" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-indigo-400 blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-purple-400 blur-3xl animate-pulse delay-2000" />
            </div>

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <motion.div
                        whileHover={{ rotate: 20, scale: 1.1 }}
                        className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20 shadow-lg"
                    >
                        <Crown className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <p className="text-xs font-medium text-white/80 tracking-wider uppercase">Édition</p>
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-white ${status.color} shadow-lg shadow-black/20`}
                            >
                                {status.icon}
                                {status.text}
                            </motion.span>
                        </div>
                        <p className="text-white font-bold text-sm mt-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-white/70" />
                            Du {formatEditionDate(startDate)} au {formatEditionDate(endDate)}
                        </p>
                    </div>
                </div>

                {edition.winningCombination && (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/10 shadow-lg"
                    >
                        <Award className="w-4 h-4 text-yellow-300" />
                        <span className="text-xs font-semibold text-white">
                            Combinaison gagnante : <span className="text-yellow-300 font-bold">{edition.winningCombination}</span>
                        </span>
                    </motion.div>
                )}

                {!isEnded && (
                    <CacheLink
                        href={`/star/choix/${edition.id}`}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-purple-600 text-sm font-bold hover:bg-white/90 transition-all shadow-lg hover:shadow-xl group"
                    >
                        <Gamepad2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        Jouer
                    </CacheLink>
                )}
            </div>
        </motion.div>
    );
});

export default EditionBanner;