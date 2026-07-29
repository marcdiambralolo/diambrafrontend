"use client";
import { Calendar, Medal } from "lucide-react";
import { memo } from "react";
import DateRange from "./DateRange";

interface ParticipantsBadgeProps {
    count: number;
}

const ParticipantsBadge = memo(({ count }: ParticipantsBadgeProps) => (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30">
        <Medal className="w-4 h-4 text-purple-600" />
        <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
            {count} participant(s)
        </span>
    </div>
));

interface EditionHeaderProps {
    startDate: string;
    endDate: string;
    participantsCount?: number;
}

const EditionHeader = memo(({ startDate, endDate, participantsCount }: EditionHeaderProps) => (
    <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-purple-100 dark:border-purple-800 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30">
                    <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div className="pt-2">
                    <DateRange startDate={startDate} endDate={endDate} />
                </div>
            </div>

            {participantsCount !== undefined && (
                <ParticipantsBadge count={participantsCount} />
            )}
        </div>
    </div>
));

export default EditionHeader;