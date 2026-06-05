'use client';
import { useCommon } from '@/hooks/learning/home/useCommon';
import { CURRENT_YEAR, STATUS_CONFIG } from "@/lib/learning/constantes";
import { HelpCircle } from "lucide-react";
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";
import { memo, Suspense, useCallback, useMemo } from 'react';

const LaBanniere = dynamic(
    () => import('@/components/learning/labanniere/LaBanniere'),
    {
        loading: () => <div className="h-32 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl" />,
        ssr: true,
    }
);

const StatusBadge = memo(({ text, color }: { text: string; color: string }) => (
    <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${color === 'red' ? 'bg-red-500' : 'bg-green-500'
        } text-white flex items-center gap-1`}>
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        {text}
    </div>
));

const FooterSection = memo(() => {
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
            <p className="text-white mt-2">DIAMBRA CORPORATION • Tous droits réservés.</p>
        </footer>
    );
});

const HelpButton = memo(() => {
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

const FixedContent = () => {

    return (
        <div className="fixed-bottom-content w-full space-y-4">
            <Suspense fallback={<div className="h-32 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl" />}>
                <LaBanniere />
            </Suspense>

            <FooterSection />

            <HelpButton />
        </div>
    );
};

export default FixedContent;