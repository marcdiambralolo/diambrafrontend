'use client';
import CacheLink from "@/components/commons/CacheLink";
import { Consultation } from "@/lib/interfaces";
import { Sparkles } from "lucide-react";
import { memo } from 'react';

const ParticipationsSection = memo(({ consultations, activeEditionId }: { consultations: Consultation[]; activeEditionId?: string }) => (
    <div className="max-w-7xl mx-auto mt-4">
        {consultations.length === 0 ? (
            <div className="text-center py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-purple-400 dark:text-purple-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">📜 Aucune partie n'a été jouée dans cette édition</p>
            </div>
        ) : (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
                <CacheLink
                    href={`/star/learning/historique/${activeEditionId || ''}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    📋 VOIR TOUTES LES PARTICIPATIONS ({consultations.length})
                </CacheLink>
            </div>
        )}
    </div>
));

export default ParticipationsSection;