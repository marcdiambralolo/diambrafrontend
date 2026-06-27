'use client';
import { memo, useMemo } from 'react';
import { cn } from "@/lib/utils";

const BADGE_COLORS = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
} as const;

type BadgeColor = keyof typeof BADGE_COLORS;

export interface HelpSection {
    id: string;
    icon: string;
    title: string;
    type: 'list' | 'text';
    badge: string | null;
    badgeColor?: BadgeColor;
    content: string | string[];
}

interface HelpSectionCardProps {
    section: HelpSection;
    priority?: boolean;
}

export const HelpSectionCard = memo(function HelpSectionCard({ section, priority = false }: HelpSectionCardProps) {
    const isList = section.type === "list";

    const content = useMemo(() => {
        if (isList) {
            const items = section.content as string[];
            return (
                <ul className="space-y-2">
                    {items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" aria-hidden="true" />
                            <span className="text-gray-600 dark:text-gray-400">
                                {item}
                            </span>
                        </li>
                    ))}
                </ul>
            );
        }

        return (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {section.content as string}
            </p>
        );
    }, [isList, section.content]);

    return (
        <div
            className={cn(
                "bg-white dark:bg-gray-800/50 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700",
                priority && "ring-2 ring-blue-200 dark:ring-blue-800 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10"
            )}
        >
            <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-xl" aria-hidden="true">{section.icon}</span>
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 text-base">
                        {section.title}
                    </h3>
                    {section.badge && (
                        <span className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1.5 inline-block",
                            section.badgeColor ? BADGE_COLORS[section.badgeColor] : BADGE_COLORS.blue
                        )}>
                            {section.badge}
                        </span>
                    )}
                </div>
            </div>
            <div className="pl-14">
                {content}
            </div>
        </div>
    );
});