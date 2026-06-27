'use client';
import { useOnlineStatus } from '@/hooks/learning/home/useOnlineStatus';
import { CURRENT_YEAR, STATUS_CONFIG } from "@/lib/learning/constantes";
import { memo, useMemo } from 'react';

export const StatusBadge = memo(({ text, color }: { text: string; color: string }) => (
    <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${color === 'red' ? 'bg-red-500' : 'bg-green-500'
        } text-white flex items-center gap-1`}>
        <div className="w-1.5 h-1.5 bg-white rounded-full" />
        {text}
    </div>
));

export const FooterSection = memo(() => {
    const onlineStatus = useOnlineStatus();
    const status = useMemo(() =>
        onlineStatus ? STATUS_CONFIG.online : STATUS_CONFIG.offline,
        [onlineStatus]
    );

    return (
        <footer className="relative mt-4 bg-gray-900 rounded-xl p-4 text-center shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10" />
            <div className="relative flex items-center justify-between text-xs text-white">
                <span>© {CURRENT_YEAR}</span>
                <StatusBadge text={status.text} color={status.color} />
            </div>

            <p className="text-white mt-2">DIAMBRA CORPORATION</p>
        </footer>
    );
}); 