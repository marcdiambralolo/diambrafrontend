"use client";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
    onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
    return (
        <div className="mt-8 text-center">
            <button
                onClick={onClick}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:scale-[1.02]"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour
            </button>
        </div>
    );
}