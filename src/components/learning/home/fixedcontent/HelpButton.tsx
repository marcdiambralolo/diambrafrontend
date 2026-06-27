'use client';
import { memo, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { HelpCircle } from "lucide-react";

export const HelpButton = memo(function HelpButton() {
    const router = useRouter();

    const handleClick = useCallback(() => {
        router.push('/star/learning/help');
    }, [router]);

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14
             bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Aide"
            type="button"
        >
            <HelpCircle className="w-6 h-6" aria-hidden="true" />
        </button>
    );
});