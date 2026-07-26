'use client';
import { NO_DATA_PLACEHOLDER } from '@/lib/learning/constantes';
import { memo } from 'react';

interface InfoRowProps {
    label: string;
    value?: string | number;
    highlight?: boolean;
    icon?: React.ReactNode;
}

const InfoRow = memo(function InfoRow({ label, value, highlight = false, icon }: InfoRowProps) {

    return (
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 last:border-0 py-1.5 px-2 rounded-lg">
            <span className="font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                {icon && <span className="text-purple-500 flex-shrink-0">{icon}</span>}
                {label}:
            </span>
            <span
                className={`text-xs sm:text-sm font-mono ${highlight
                    ? 'text-purple-600 dark:text-purple-400 font-bold'
                    : 'text-gray-900 dark:text-gray-100'
                    }`}
            >
                {value ?? NO_DATA_PLACEHOLDER}
            </span>
        </div>
    );
});

export default InfoRow;