'use client';
import { memo } from 'react';
import { CalendarX } from "lucide-react";

const NoCompetitionBanner = () => (
    <div className="w-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 p-6 mb-6 shadow-xl border border-slate-800">
        <div className="flex flex-col items-center text-center gap-4">
            <div className="rounded-full bg-slate-700/50 p-3">
                <CalendarX className="w-8 h-8 text-slate-400" aria-hidden="true" />
            </div>

            <div>
                <p className="text-white font-extrabold text-lg">Aucun match programmé</p>
                <p className="text-slate-400 text-xs max-w-[280px] mt-1">
                    Les administrateurs n&apos;ont pas encore planifié la prochaine session de jeu.
                </p>
            </div>
        </div>
    </div>
);

export default memo(NoCompetitionBanner);