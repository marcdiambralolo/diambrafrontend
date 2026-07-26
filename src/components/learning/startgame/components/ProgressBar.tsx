"use client";
import { memo } from "react";

const ProgressBar = memo(({ lockedCount, totalCount, progression }: { lockedCount: number; totalCount: number; progression: number }) => (
    <div className="mt-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progression</span>
            <span>{lockedCount}/{totalCount}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
            <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progression}%` }}
            />
        </div>
    </div>
));

export default ProgressBar;