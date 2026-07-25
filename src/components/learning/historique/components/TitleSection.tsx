'use client';
import { Crown, Sparkles } from "lucide-react";
import { memo } from 'react';

const TitleSection = memo(() => (
    <div className="mb-8">
        <div className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 px-4 py-1.5 mb-3 shadow-sm w-fit mx-auto">
            <Crown className="w-4 h-4 text-yellow-500" />

            <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                🏆 CLASSEMENT DE L'ÉDITION
            </span>
            <Sparkles className="w-4 h-4 text-purple-500" />
        </div>
    </div>
));

export default TitleSection;