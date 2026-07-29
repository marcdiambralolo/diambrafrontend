'use client';
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { memo } from 'react';

const BackButton = memo(({ onClick, isPending }: { onClick: () => void; isPending?: boolean }) => (
    <button
        onClick={onClick}
        disabled={isPending}
        className={cn(
            "w-full mb-5 py-2.5 bg-gradient-to-r from-purple-50 to-purple-100",
            "dark:from-purple-900/20 dark:to-purple-800/20",
            "rounded-xl text-purple-700 dark:text-purple-400 text-sm font-semibold",
            "flex items-center justify-center gap-2",
            "focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2",
            "hover:from-purple-100 hover:to-purple-200",
            "dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 hover:shadow-md",
            isPending && "opacity-50 cursor-not-allowed"
        )}
        type="button"
        aria-busy={isPending}
    >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        {isPending ? 'Chargement...' : 'Reprendre le jeu'}
    </button>
));

export default memo(BackButton);