import { createCategoryConsultation, getCategoryErrorMessage } from '@/hooks/categorie/categoryConsultation.shared';
import { api } from '@/lib/api/client';
import { walletService } from '@/lib/api/services/wallet.service';
import { QUERY_KEYS, queryClient } from '@/lib/cache/queryClient';
import type { Consultation, OfferingAlternative, WalletOffering } from '@/lib/interfaces';
import { Variants } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const SLOT_COUNT = 4;
export const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

const POT_CONFIG: OfferingAlternative = {
    offeringId: '6945ae01b8af14d5f56cec09',
    quantity: 1,
    name: 'Partie Quatre Cases',
    price: 200,
    createdAt: '',
    updatedAt: '',
    _id: '69ada22a910a174365e2a216',
} as const;

interface State {
    loading: boolean;
    error: string | null;
    showError: boolean;
    walletOfferings: WalletOffering[];
}

interface DragData {
    value: number;
    fromSlot?: number;
    toSlot?: number;
    index?: number;
}

export const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds % 1) * 10);

    return mins > 0
        ? `${mins}:${secs.toString().padStart(2, '0')}.${tenths}`
        : `${secs}.${tenths}s`;
};

export const ANIMATION_CONFIG = {
    spring: {
        type: 'spring' as const,
        stiffness: 280,
        damping: 22
    },
    duration: {
        fast: 0.2,
        normal: 0.3
    }
} as const;

export const toastVariants: Variants = {
    hidden: { opacity: 0, x: 100, scale: 0.9 },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: ANIMATION_CONFIG.spring
    },
    exit: {
        opacity: 0,
        x: 100,
        scale: 0.95,
        transition: { duration: ANIMATION_CONFIG.duration.fast }
    }
};

const getOfferingId = (alternative: OfferingAlternative): string => {
    const offeringId = alternative.offeringId;
    if (offeringId && typeof offeringId === 'object' && '_id' in offeringId) {
        return (offeringId as { _id: string })._id;
    }
    return offeringId as string;
};

const initialState: State = {
    loading: true,
    error: null,
    showError: false,
    walletOfferings: [],
};

export function useCategoryConsulterClient() {
    const params = useParams();
    const router = useRouter();

    const isMountedRef = useRef(true);
    const timerRef = useRef<NodeJS.Timeout>();
    const dragStartRef = useRef<DragData | null>(null);

    const monidjeu = useMemo(() => {
        if (!params?.id) return null;
        return Array.isArray(params.id) ? params.id[0] : params.id;
    }, [params?.id]);

    const [state, setState] = useState<State>(initialState);
    const [gamehasStarted, setGamehasStarted] = useState(false);
    const [slots, setSlots] = useState<(number | null)[]>(() =>
        Array.from({ length: SLOT_COUNT }, () => null)
    );
    const [selected, setSelected] = useState<number | null>(null);
    const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [mode, setMode] = useState<'drag' | 'click'>('click');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const walletMap = useMemo(() => {
        const map = new Map<string, number>();
        state.walletOfferings.forEach(w => map.set(w.offeringId, w.quantity));
        return map;
    }, [state.walletOfferings]);

    const availableQuantity = useMemo(() =>
        walletMap.get(getOfferingId(POT_CONFIG)) || 0,
        [walletMap]
    );

    const requiredQuantity = POT_CONFIG.quantity;
    const isSufficient = availableQuantity >= requiredQuantity;

    const cardClasses = useMemo(() => {
        const baseClasses = "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group";
        const insufficientClasses = "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60 cursor-not-allowed";
        const sufficientClasses = "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#9BC2FF] hover:shadow-xl hover:shadow-[#4F83D1]/10 active:scale-[0.98] cursor-pointer";

        return `${baseClasses} ${isSufficient ? sufficientClasses : insufficientClasses}`;
    }, [isSufficient]);

    const used = useMemo(() =>
        new Set(slots.filter((v): v is number => v !== null)),
        [slots]
    );

    const isComplete = useMemo(() =>
        slots.every(s => s !== null) && new Set(slots).size === SLOT_COUNT,
        [slots]
    );

    const combinaison = useMemo(() =>
        slots.map(slot => slot !== null ? slot.toString() : '0').join(''),
        [slots]
    );

    const formattedTime = useMemo(() =>
        formatTime(elapsedTime),
        [elapsedTime]
    );

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, showError: false, error: null }));
    }, []);

    const placeSelectedDigitInSlot = useCallback((slotIndex: number) => {
        if (selected === null || used.has(selected)) return;

        setSlots(prev => {
            if (prev[slotIndex] !== null) return prev;
            const next = [...prev];
            next[slotIndex] = selected;
            return next;
        });

        setSelected(null);
    }, [selected, used,]);

    const removeFromSlot = useCallback((index: number) => {
        setSlots(prev => {
            const next = [...prev];
            next[index] = null;
            return next;
        });
        setSelected(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverSlot(null);
        setIsDragging(false);

        try {
            const rawData = e.dataTransfer.getData("text/plain");
            if (!rawData) return;

            const { value, fromSlot } = JSON.parse(rawData) as DragData;

            setSlots(prev => {
                const next = [...prev];

                if (fromSlot !== undefined) {
                    const movingValue = next[fromSlot];
                    const targetValue = next[index];

                    if (movingValue !== null) {
                        if (targetValue !== null) {
                            // Échange
                            next[fromSlot] = targetValue;
                            next[index] = movingValue;
                        } else {
                            // Déplacement
                            next[fromSlot] = null;
                            next[index] = movingValue;
                        }
                    }
                    return next;
                }

                if (value !== undefined && !used.has(value) && next[index] === null) {
                    next[index] = value;
                    setSelected(null);
                }

                return next;
            });
        } catch (err) {
            console.error("Drop error:", err);
        }

        dragStartRef.current = null;
    }, [used,]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDragOverSlot(index);
    }, []);

    const handleValidation = useCallback(async () => {
        setGamehasStarted(true);
    }, [setGamehasStarted]);

    const handleNext = useCallback(() => {
        if (isSufficient) {
            handleValidation();
        }
    }, [isSufficient, handleValidation]);

    const handleGoToMarket = useCallback(() => {
        router.push(`/star/marcheoffrandes?monjeu=${monidjeu}`);
    }, [router, monidjeu]);

    const handleSubmitAndNavigate = useCallback(async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setState(prev => ({ ...prev, loading: true, error: null, showError: false }));

        try {
            const consultationId = await createCategoryConsultation(monidjeu || '');
            if (!consultationId) {
                throw new Error('Impossible de créer la consultation');
            }
            const consumeRes = await walletService.validateConsultationOfferings(consultationId, [{
                offeringId: getOfferingId(POT_CONFIG),
                quantity: POT_CONFIG.quantity,
            }]);

            if (!consumeRes.success) {
                throw new Error(consumeRes.message || 'Erreur lors de la consommation');
            }

            queryClient.removeQueries({ queryKey: QUERY_KEYS.WALLET_TRANSACTIONS, exact: true });
            queryClient.removeQueries({ queryKey: QUERY_KEYS.WALLET_UNUSED_OFFERINGS, exact: true });

            const { data } = await api.get(`/consultations/${consultationId}`);
            const existingConsultation = data as Consultation;

            const payload = {
                ...existingConsultation,
                combinaison,
                timeSpent: formattedTime,
            };

            await api.put(`/consultations/${consultationId}`, payload);

            if (monidjeu) {
                router.push(`/star/monprofil/${monidjeu}`);
            } else if (consultationId) {
                router.push(`/star/monprofil?gameId=${consultationId}`);
            } else {
                router.push('/star/monprofil');
            }

        } catch (error: any) {
            console.error('Error saving consultation:', error);
        } finally {
            if (isMountedRef.current) {
                setIsSubmitting(false);
            }
        }
    }, [monidjeu, combinaison, formattedTime, router, isSubmitting]);

    useEffect(() => {
        isMountedRef.current = true;

        const loadWalletOfferings = async () => {
            try {
                const walletRes = await walletService.getUnusedWalletOfferings();
                if (isMountedRef.current) {
                    setState(prev => ({
                        ...prev,
                        walletOfferings: walletRes,
                        loading: false
                    }));
                }
            } catch (err) {
                console.error('Erreur chargement wallet:', err);
                if (isMountedRef.current) {
                    setState(prev => ({
                        ...prev,
                        error: getCategoryErrorMessage(err, 'Erreur lors du chargement'),
                        showError: true,
                        loading: false,
                    }));
                }
            }
        };

        loadWalletOfferings();

        return () => {
            isMountedRef.current = false;
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    useEffect(() => {
        const hasStarted = slots.some(s => s !== null);

        if (!isComplete && hasStarted && !startTime) {
            setStartTime(Date.now());
        }

        if (isComplete && startTime) {
            const elapsed = (Date.now() - startTime) / 1000;
            setElapsedTime(elapsed);
            if (timerRef.current) clearInterval(timerRef.current);
        } else if (!isComplete && startTime) {
            timerRef.current = setInterval(() => {
                setElapsedTime((Date.now() - startTime!) / 1000);
            }, 100);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isComplete, startTime, slots]);

    return {
        handleGoToMarket, handleNext, clearError, handleDragOver, handleDrop, removeFromSlot, setDragOverSlot,
        setIsDragging, setSelected, setMode, placeSelectedDigitInSlot, handleSubmitAndNavigate,
        dataLoading: state.loading, dataError: state.error, showError: state.showError,
        currentError: state.showError ? state.error : null, cardClasses, isSufficient, requiredQuantity,
        gamehasStarted, monidjeu, availableQuantity, slots, selected, dragOverSlot, isDragging, mode, used, isComplete,
    };
}