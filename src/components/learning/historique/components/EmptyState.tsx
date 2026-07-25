'use client';
import { Gift } from 'lucide-react';
import { memo } from 'react';

const EmptyState = memo(function EmptyState({
    title,
    subtitle,
}: {
    title: string;
    subtitle: string;
}) {
    return (
        <div className="text-center py-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl mb-8">
            <Gift className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />

            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
    );
});

export default EmptyState;