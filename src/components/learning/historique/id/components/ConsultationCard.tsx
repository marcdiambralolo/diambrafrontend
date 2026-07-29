"use client";
import { useConsultationCard } from "@/hooks/learning/historique/useConsultationCard";
import { cx } from "@/lib/functions";
import type { Consultation } from "@/lib/interfaces";
import { Calendar, CheckCircle, Eye, Globe, Timer, UserRound, } from "lucide-react";
import { memo } from "react";

interface ConsultationCardProps {
    consultation: Consultation;
    index: number;
    isDuplicate?: boolean;
    duplicateCount?: number;
    rank?: number;
}

const ConsultationCard = memo(
    ({
        consultation,
        isDuplicate = false,
        duplicateCount = 0,
        rank,
    }: ConsultationCardProps) => {
        const {
            nomJoueur, country, relativeDate, formattedTime, nombredevues, medal,
        } = useConsultationCard(consultation, rank);

        return (
            <article
                className={cx(
                    "group relative overflow-hidden rounded-2xl p-4 my-3 transition-all duration-300",
                    "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800",
                    "shadow-sm hover:shadow-lg hover:-translate-y-0.5",
                    rank === 1 &&
                    "border-amber-300/60 dark:border-amber-500/30 bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/30 dark:from-amber-950/20 dark:via-gray-900 dark:to-yellow-950/10",
                    rank === 2 &&
                    "border-slate-300/60 dark:border-slate-600/30 bg-gradient-to-br from-slate-50/80 via-white to-gray-50/30 dark:from-slate-900/40 dark:via-gray-900 dark:to-slate-950/10",
                    rank === 3 &&
                    "border-amber-600/40 dark:border-amber-700/30 bg-gradient-to-br from-orange-50/80 via-white to-amber-50/30 dark:from-amber-950/20 dark:via-gray-900 dark:to-orange-950/10",
                    isDuplicate &&
                    "border-emerald-300/60 dark:border-emerald-600/30 bg-gradient-to-br from-emerald-50/60 via-white to-green-50/20 dark:from-emerald-950/20 dark:via-gray-900 dark:to-green-950/10"
                )}
            >
                <div className="relative z-10 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 shrink-0">
                                <UserRound className="w-4 h-4" />
                            </div>

                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                                        {nomJoueur}
                                    </h4>
                                    {medal && (
                                        <span
                                            className={cx("inline-flex items-center text-xs font-bold px-1.5 py-0.5 rounded-md",
                                                medal.color
                                            )}
                                            title={`Rang #${rank}`}
                                        >
                                            {medal.emoji}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isDuplicate && (
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20 shrink-0">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>
                                    {duplicateCount > 1 ? `x${duplicateCount}` : "Doublon"}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/60">
                            <Timer className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500 leading-none">
                                    Temps
                                </span>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate mt-0.5">
                                    {formattedTime}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/60">
                            <Eye className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500 leading-none">
                                    Vues
                                </span>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate mt-0.5">
                                    {nombredevues}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/60">
                            <Calendar className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500 leading-none">
                                    Date
                                </span>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate mt-0.5">
                                    {relativeDate}
                                </span>
                            </div>
                        </div>

                        {country && (
                            <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/60">
                                <Globe className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500 leading-none">
                                        Pays
                                    </span>
                                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate mt-0.5">
                                        {country}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </article>
        );
    }
);

export default ConsultationCard;