'use client';
import { useCommon } from '@/hooks/learning/home/useCommon';
import { APP_NAME, CURRENT_YEAR, MESSAGE_DURATION, STATUS_CONFIG } from "@/lib/learning/constantes";
import { HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useMemo } from 'react';

const TOAST_POSITION = "fixed top-4 left-1/2 -translate-x-1/2 z-50";

export const StatusBadge = memo(({ text, color }: { text: string; color: string }) => (
    <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${color === 'red' ? 'bg-red-500' : 'bg-green-500'
        } text-white flex items-center gap-1`}>
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        {text}
    </div>
));

export const FooterSection = memo(() => {
    const { onlineStatus } = useCommon();
    const status = useMemo(() =>
        onlineStatus ? STATUS_CONFIG.online : STATUS_CONFIG.offline,
        [onlineStatus]
    );

    return (
        <footer className="relative mt-4 bg-gradient-to-r from-gray-900 to-gray-900 rounded-xl p-4 text-center shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10" />
            <div className="relative flex items-center justify-between text-xs text-white">
                <span>© {CURRENT_YEAR}</span>
                <StatusBadge text={status.text} color={status.color} />
            </div>

            <p className="text-white mt-2">DIAMBRA CORPORATION</p>
        </footer>
    );
});

export const HeaderSection = memo(() => (
    <div className="flex flex-col items-center justify-center mt-2 mb-2">
        <div className="relative">
            <h1 className="text-xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                {APP_NAME}
            </h1>
            <div className="absolute -top-2 -right-6 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75" />
        </div>

        <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
        </div>
    </div>
));

export const HelpButton = memo(() => {
    const router = useRouter();

    const handleClick = useCallback(() => {
        router.push('/star/learning/help');
    }, [router]);

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
            aria-label="Aide"
            type="button"
        >
            <HelpCircle className="w-6 h-6" aria-hidden="true" />
        </button>
    );
});

interface ValidationMessage {
    text: string;
    type: 'success' | 'error';
}

export const MessageToast = memo(({ message, onClose }: { message: ValidationMessage | null; onClose: () => void }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(onClose, MESSAGE_DURATION);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div
            className={`${TOAST_POSITION} px-4 py-2 rounded-xl shadow-lg text-white text-sm font-medium transition-all duration-300 ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
            role="alert"
        >
            {message.text}
        </div>
    );
});