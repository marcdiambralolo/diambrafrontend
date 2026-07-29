"use client";
import { memo } from "react";

interface DateRangeProps {
    startDate: string;
    endDate: string;
}

const DateRange = memo(({ startDate, endDate }: DateRangeProps) => (
    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
        <span>{startDate}</span>
        <span className="text-gray-400">→</span>
        <span>{endDate}</span>
    </div>
));

export default DateRange;