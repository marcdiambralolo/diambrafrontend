"use client";
import { Calendar } from "lucide-react";

interface EditionPeriodProps {
    startDate: string;
    endDate: string;
}

export function EditionPeriod({ startDate, endDate }: EditionPeriodProps) {

    return (
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30">
                <Calendar className="w-5 h-5 text-purple-600" />
            </div>

            <div>
                <div className="pt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                        <span>{startDate}</span>
                        <span className="text-gray-400">→</span>
                        <span>{endDate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}