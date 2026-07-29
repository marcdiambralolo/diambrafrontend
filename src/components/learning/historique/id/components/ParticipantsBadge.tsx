"use client";
import { Medal } from "lucide-react";

interface ParticipantsBadgeProps {
    count: number;
}

export function ParticipantsBadge({ count }: ParticipantsBadgeProps) {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30">
            <Medal className="w-4 h-4 text-purple-600" />

            <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                {count} participant(s)
            </span>
        </div>
    );
}