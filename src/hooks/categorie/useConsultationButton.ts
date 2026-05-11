import { useMemo, useCallback, useRef, useState } from 'react';
import { ConsultationChoice } from '@/lib/interfaces';
import { useRouter } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
type ShareState = 'idle' | 'copied' | 'shared' | 'error';

export type ButtonStatus = 'CONSULTER' | 'RÉPONSE EN ATTENTE' | "VOIR L'ANALYSE" |"VOIR LA RÉPONSE";

export interface ButtonConfig {
    label: string;
    icon: LucideIcon;
    gradient: string;
    hoverEffect: boolean;
}

export const BUTTON_CONFIGS: Record<ButtonStatus, ButtonConfig> = {
    CONSULTER: {
        label: 'Consulter',
        icon: require('lucide-react').Sparkles,
        gradient: 'from-[#2E5AA6] to-[#4F83D1]',
        hoverEffect: true,
    },
    'RÉPONSE EN ATTENTE': {
        label: 'Réponse en attente',
        icon: require('lucide-react').Clock,
        gradient: 'from-amber-500 to-orange-500',
        hoverEffect: false,
    },
    "VOIR L'ANALYSE": {
        label: "Voir la réponse",
        icon: require('lucide-react').Eye,
        gradient: 'from-emerald-600 to-teal-600',
        hoverEffect: true,
    },
    "VOIR LA RÉPONSE": {
        label: "Voir la réponse",
        icon: require('lucide-react').Eye,
        gradient: 'from-emerald-600 to-teal-600',
        hoverEffect: true,
    },
};

function buildShareUrl(choiceId?: string) {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    if (choiceId) url.searchParams.set('choiceId', choiceId);
    url.searchParams.set('r', String(Date.now()));
    return url.toString();
}

export function useConsultationButton(enrichedChoice: ConsultationChoice, onConsult: () => void) {
    const router = useRouter();
    const status = enrichedChoice.buttonStatus as ButtonStatus;
    const config = useMemo(() => BUTTON_CONFIGS[status] ?? BUTTON_CONFIGS.CONSULTER, [status]);
    const Icon = config.icon;
    const count = enrichedChoice.consultationCount ?? 0;

    const handleClick = useCallback(() => {
        if (status === 'RÉPONSE EN ATTENTE') return;
        if (status === "VOIR L'ANALYSE") {
            router.push(`/star/consultations/${enrichedChoice.consultationId}`);
            return;
        }
        onConsult();
    }, [status, enrichedChoice.consultationId, onConsult, router]);

    const [shareState, setShareState] = useState<ShareState>('idle');
    const resetTimerRef = useRef<number | null>(null);

    const clearResetTimer = useCallback(() => {
        if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
    }, []);

    const armResetTimer = useCallback(() => {
        clearResetTimer();
        resetTimerRef.current = window.setTimeout(() => setShareState('idle'), 1500);
    }, [clearResetTimer]);

    const shareUrl = useMemo(() => buildShareUrl(enrichedChoice.choiceId), [enrichedChoice.choiceId]);

    const shareText = useMemo(() => {
        const title = enrichedChoice.title?.trim() || 'Consultation';
        const desc = (enrichedChoice.description || '').trim();
        return desc ? `${title} — ${desc.slice(0, 200)}${desc.length > 200 ? '…' : ''}` : title;
    }, [enrichedChoice.title, enrichedChoice.description]);

    const shareLabel = useMemo(() => {
        if (shareState === 'copied') return 'LIEN COPIÉ';
        if (shareState === 'shared') return 'PARTAGÉ';
        if (shareState === 'error') return 'IMPOSSIBLE';
        return 'PARTAGER';
    }, [shareState]);

    const handleShare = useCallback(async () => {
        try {
            setShareState('idle');

            if (navigator.share) {
                await navigator.share({
                    title: enrichedChoice.title || 'Consultation',
                    text: shareText,
                    url: shareUrl,
                });
                setShareState('shared');
                armResetTimer();
                return;
            }

            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(shareUrl);
                setShareState('copied');
                armResetTimer();
                return;
            }

            window.prompt('Copiez ce lien :', shareUrl);
            setShareState('copied');
            armResetTimer();
        } catch {
            setShareState('error');
            armResetTimer();
        }
    }, [armResetTimer, enrichedChoice.title, shareText, shareUrl]);

    const isPending = status === 'RÉPONSE EN ATTENTE';
    const showHistory = enrichedChoice.frequence !== 'UNE_FOIS_VIE';

    return {
        status, config, Icon, count, shareLabel, isPending, showHistory,
        handleShare, handleClick,
    };
}