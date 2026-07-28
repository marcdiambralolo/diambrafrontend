'use client';
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import { memo, useMemo } from 'react';
import { GRADIENT_COLORS, QUICK_TIPS } from "./constant";

export const QuickTipsCard = memo(function QuickTipsCard() {
    const tips = useMemo(() =>
        QUICK_TIPS.map((tip) => (
            <div
                key={tip.title}
                className={cn(
                    "flex items-start gap-2.5 p-2 bg-gradient-to-r rounded-lg border border-transparent cursor-default",
                    GRADIENT_COLORS[tip.color] || GRADIENT_COLORS.amber
                )}
            >
                <span className="text-2xl flex-shrink-0" aria-hidden="true">
                    {tip.icon}
                </span>

                <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 text-xs">
                        {tip.title}
                    </h4>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400">
                        {tip.description}
                    </p>
                </div>
            </div>
        )),
        []
    );

    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800 mt-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-amber-800 dark:text-amber-300 text-base">
                    Conseils pratiques
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {tips}
            </div>
        </div>
    );
});