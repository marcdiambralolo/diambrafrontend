'use client';
import { useOnlineStatus } from '@/hooks/learning/home/useOnlineStatus';
import { CURRENT_YEAR, STATUS_CONFIG } from '@/lib/learning/constantes';
import { memo } from 'react';

const COLOR_CLASSES: Record<string, string> = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    emerald: 'bg-emerald-500',
};

interface StatusBadgeProps {
    text: string;
    color: string;
}

const StatusBadge = memo(({ text, color }: StatusBadgeProps) => {
    const bgClass = COLOR_CLASSES[color] ?? 'bg-gray-500';

    return (
        <div
            role="status"
            aria-label={`Statut de connexion : ${text}`}
            className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${bgClass} text-white flex items-center gap-2 transition-colors duration-300`}
        >
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span>{text}</span>
        </div>
    );
});

export const FooterSection = memo(() => {
    const isOnline = useOnlineStatus();
    const status = isOnline ? STATUS_CONFIG.online : STATUS_CONFIG.offline;

    return (
        <footer className="relative mt-4 bg-gray-900 rounded-xl p-4 text-center shadow-lg overflow-hidden">
            <div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 pointer-events-none"
                aria-hidden="true"
            />

            <div className="relative flex items-center justify-between text-xs text-white">
                <span className="font-medium">© {CURRENT_YEAR}</span>
                <StatusBadge text={status.text} color={status.color} />
            </div>

            <p className="relative text-xs text-gray-300 font-medium mt-2">
                Diambra Corporation
            </p>
        </footer>
    );
});