import { fmtDuration } from '@/lib/functions';
import { useMemo } from 'react';
import { ProgressState } from '../cinqetoiles/useSlide4SectionDoors';

export const STAGES = [
    { key: 'idle', label: 'Préparation', hint: 'Initialisation du traitement' },
    { key: 'done', label: 'Terminé', hint: 'Votre analyse est prête' },
];

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export function usePaymentProcessingProgress(progress: ProgressState) {
    const percent = clamp(Number.isFinite(progress.percent) ? progress.percent : 0, 0, 100);
    const isDone = progress.stage === 'done';
    const isError = progress.stage === 'error';
    const canCancel = !isDone && !isError;
    const startedAt = progress.startedAt ?? Date.now();
    const updatedAt = progress.updatedAt ?? progress.lastUpdatedAt ?? Date.now();
    const elapsedMs = Math.max(0, updatedAt - startedAt);

    const eta = useMemo(() => {
        if (percent <= 1) return null;
        if (percent >= 99) return 'quelques secondes';

        const total = elapsedMs / (percent / 100);
        const remain = Math.max(0, total - elapsedMs);
        return fmtDuration(remain);
    }, [elapsedMs, percent]);

    const stageIndex = useMemo(() => STAGES.findIndex((s) => s.key === progress.stage), [progress.stage]);

    return { percent, isDone, isError, canCancel, eta, stageIndex, };
}