'use client';
import { ChevronDown, Loader2 } from "lucide-react";
import { memo } from 'react';

interface LoadMoreButtonProps {
    onClick: () => void;
    remainingCount: number;
    isLoading: boolean;
}

const LoadMoreButton = memo(({ onClick, remainingCount, isLoading }: LoadMoreButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className="w-full py-3 mt-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
    >
        {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
            <ChevronDown className="w-4 h-4" />
        )}

        {isLoading ? 'Chargement...' : `Voir plus (${remainingCount} restantes)`}
    </button>
));

export default LoadMoreButton;