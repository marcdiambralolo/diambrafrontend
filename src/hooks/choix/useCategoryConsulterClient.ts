import { createCategoryConsultation, getCategoryErrorMessage } from '@/hooks/categorie/categoryConsultation.shared';
import { api } from '@/lib/api/client';
import { walletService } from '@/lib/api/services/wallet.service';
import { QUERY_KEYS, queryClient } from '@/lib/cache/queryClient';
import type { Consultation, OfferingAlternative, WalletOffering } from '@/lib/interfaces';
import { LastEndedGame } from "@/lib/interfaces";
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useStatsDataWithCache } from '../cache/useStatsDataWithCache';
import { useGameConfig } from '../profil/useGameConfig';

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

const BASE_CLASSES = "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group";
const INSUFFICIENT_CLASSES = "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60 cursor-not-allowed";
const SUFFICIENT_CLASSES = "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#9BC2FF] hover:shadow-xl hover:shadow-[#4F83D1]/10 active:scale-[0.98] cursor-pointer";

interface State {
    loading: boolean;
    error: string | null;
    showError: boolean;
    walletOfferings: WalletOffering[];
}

interface DragData {
    value: number;
    fromSlot?: number;
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
    spring: { type: 'spring' as const, stiffness: 280, damping: 22 },
    duration: { fast: 0.2, normal: 0.3 }
} as const;

export const toastVariants = {
    hidden: { opacity: 0, x: 100, scale: 0.9 },
    visible: { opacity: 1, x: 0, scale: 1, transition: ANIMATION_CONFIG.spring },
    exit: { opacity: 0, x: 100, scale: 0.95, transition: { duration: ANIMATION_CONFIG.duration.fast } }
} as const;

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

const createEmptySlots = (): (number | null)[] => Array.from({ length: SLOT_COUNT }, () => null);

export function useCategoryConsulterClient() {
    const params = useParams();
    const router = useRouter();
    const [, startTransition] = useTransition();

    const { stats, isLoading: statsLoading } = useStatsDataWithCache();
    const { data: gameConfig, isLoading: configLoading } = useGameConfig();

    const isMountedRef = useRef(true);
    const timerRef = useRef<NodeJS.Timeout>();
    const dragStartRef = useRef<DragData | null>(null);
    const slotsRef = useRef<(number | null)[]>(createEmptySlots());

    const [walletState, setWalletState] = useState<State>(initialState);
    const [gameStarted, setGameStarted] = useState(false);
    const [matchFinished, setMatchFinished] = useState(false);
    const [lastEndedGame, setLastEndedGame] = useState<LastEndedGame | null>(null);
    const [loadingLastEnded, setLoadingLastEnded] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [gameState, setGameState] = useState({
        slots: createEmptySlots(),
        selected: null as number | null,
        dragOverSlot: null as number | null,
        isDragging: false,
        mode: 'click' as 'drag' | 'click',
        startTime: null as number | null,
        elapsedTime: 0,
        isSubmitting: false,
    });

    useEffect(() => {
        slotsRef.current = gameState.slots;
    }, [gameState.slots]);

    const monidjeu = useMemo(() => {
        if (!params?.id) return null;
        return Array.isArray(params.id) ? params.id[0] : params.id;
    }, [params?.id]);

    const walletMap = useMemo(() => {
        const map = new Map<string, number>();
        walletState.walletOfferings.forEach(w => map.set(w.offeringId, w.quantity));
        return map;
    }, [walletState.walletOfferings]);

    const availableQuantity = useMemo(() =>
        walletMap.get(getOfferingId(POT_CONFIG)) || 0,
        [walletMap]
    );

    const isSufficient = useMemo(() =>
        availableQuantity >= POT_CONFIG.quantity,
        [availableQuantity]
    );

    const cardClasses = useMemo(() =>
        `${BASE_CLASSES} ${isSufficient ? SUFFICIENT_CLASSES : INSUFFICIENT_CLASSES}`,
        [isSufficient]
    );

    const used = useMemo(() =>
        new Set(gameState.slots.filter((v): v is number => v !== null)),
        [gameState.slots]
    );

    const isComplete = useMemo(() =>
        gameState.slots.every(s => s !== null) && new Set(gameState.slots).size === SLOT_COUNT,
        [gameState.slots]
    );

    const combinaison = useMemo(() =>
        gameState.slots.map(slot => slot !== null ? slot.toString() : '0').join(''),
        [gameState.slots]
    );

    const formattedTime = useMemo(() =>
        formatTime(gameState.elapsedTime),
        [gameState.elapsedTime]
    );

    const startDate = useMemo(() => gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null, [gameConfig?.startgameDate]);
    const endDate = useMemo(() => gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null, [gameConfig?.endgameDate]);
    const now = useMemo(() => new Date(), []);

    const isGameActive = useMemo(() =>
        gameConfig?.isActive === true &&
        gameConfig?.status === 'active' &&
        startDate !== null &&
        endDate !== null &&
        now >= startDate &&
        now <= endDate,
        [gameConfig?.isActive, gameConfig?.status, startDate, endDate, now]
    );

    const isGameEnded = useMemo(() =>
        gameConfig?.status === 'ended' || (endDate !== null && now > endDate),
        [gameConfig?.status, endDate, now]
    );

    const isGameNotStarted = useMemo(() =>
        gameConfig?.status === 'pending' || (startDate !== null && now < startDate),
        [gameConfig?.status, startDate, now]
    );

    const clearError = useCallback(() => {
        setWalletState(prev => ({ ...prev, showError: false, error: null }));
    }, []);

    const updateGameState = useCallback((updater: Partial<typeof gameState>) => {
        setGameState(prev => ({ ...prev, ...updater }));
    }, []);

    const placeSelectedDigitInSlot = useCallback((slotIndex: number) => {
        const { selected, slots } = gameState;
        if (selected === null || used.has(selected) || slots[slotIndex] !== null) return;

        const newSlots = [...slots];
        newSlots[slotIndex] = selected;

        updateGameState({
            slots: newSlots,
            selected: null,
        });
    }, [gameState.selected, gameState.slots, used, updateGameState]);

    const removeFromSlot = useCallback((index: number) => {
        const newSlots = [...gameState.slots];
        newSlots[index] = null;
        updateGameState({
            slots: newSlots,
            selected: null,
        });
    }, [gameState.slots, updateGameState]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        e.stopPropagation();

        updateGameState({
            dragOverSlot: null,
            isDragging: false,
        });

        try {
            const rawData = e.dataTransfer.getData("text/plain");
            if (!rawData) return;

            const { value, fromSlot } = JSON.parse(rawData) as DragData;

            setGameState(prev => {
                const nextSlots = [...prev.slots];

                if (fromSlot !== undefined) {
                    const movingValue = nextSlots[fromSlot];
                    const targetValue = nextSlots[index];

                    if (movingValue !== null) {
                        if (targetValue !== null) {
                            nextSlots[fromSlot] = targetValue;
                            nextSlots[index] = movingValue;
                        } else {
                            nextSlots[fromSlot] = null;
                            nextSlots[index] = movingValue;
                        }
                    }
                    return { ...prev, slots: nextSlots };
                }

                if (value !== undefined && !used.has(value) && nextSlots[index] === null) {
                    nextSlots[index] = value;
                    return { ...prev, slots: nextSlots, selected: null };
                }

                return prev;
            });
        } catch (err) {
            console.error("Drop error:", err);
        }

        dragStartRef.current = null;
    }, [used, updateGameState]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        updateGameState({ dragOverSlot: index });
    }, [updateGameState]);

    const handleValidation = useCallback(() => {
        setGameStarted(true);
    }, []);

    const handleNext = useCallback(() => {
        if (isSufficient) {
            handleValidation();
        }
    }, [isSufficient, handleValidation]);

    const handleGoToMarket = useCallback(() => {
        router.push(`/star/marcheoffrandes?monjeu=${monidjeu}`);
    }, [router, monidjeu]);

    const handleSubmitAndNavigate = useCallback(async () => {
        if (gameState.isSubmitting) return;

        updateGameState({ isSubmitting: true });
        setWalletState(prev => ({ ...prev, loading: true, error: null, showError: false }));

        try {
            const consultationId = await createCategoryConsultation(monidjeu || '');
            if (!consultationId) throw new Error('Impossible de créer la consultation');

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
            const payload = {
                ...(data as Consultation),
                combinaison,
                timeSpent: formattedTime,
            };

            await api.put(`/consultations/${consultationId}`, payload);

            startTransition(() => {
                if (monidjeu) {
                    router.push(`/star/monprofil/${monidjeu}`);
                } else {
                    router.push(`/star/monprofil?gameId=${consultationId}`);
                }
            });
        } catch (error: any) {
            console.error('Error saving consultation:', error);
        } finally {
            if (isMountedRef.current) {
                updateGameState({ isSubmitting: false });
                setWalletState(prev => ({ ...prev, loading: false }));
            }
        }
    }, [monidjeu, combinaison, formattedTime, router, gameState.isSubmitting, updateGameState]);

    const fetchLastEndedGame = useCallback(async () => {
        try {
            const response = await api.get('/game-configurations/last-ended');
            const data = response.data as { success: boolean; hasEndedEdition: boolean; configuration: LastEndedGame };

            setLastEndedGame(data?.hasEndedEdition ? data.configuration : null);
        } catch (error) {
            console.error('Erreur lors de la récupération du dernier jeu terminé:', error);
            setLastEndedGame(null);
        } finally {
            setLoadingLastEnded(false);
        }
    }, []);

    const handleEndMatch = useCallback(() => {
        if (!matchFinished) {
            setMatchFinished(true);
        }
        setRefreshTrigger(prev => prev + 1);
    }, [matchFinished]);

    useEffect(() => {
        const hasStarted = gameState.slots.some(s => s !== null);

        if (!isComplete && hasStarted && !gameState.startTime) {
            updateGameState({ startTime: Date.now() });
        }

        if (isComplete && gameState.startTime) {
            const elapsed = (Date.now() - gameState.startTime) / 1000;
            updateGameState({ elapsedTime: elapsed });
            if (timerRef.current) clearInterval(timerRef.current);
        } else if (!isComplete && gameState.startTime) {
            timerRef.current = setInterval(() => {
                updateGameState({ elapsedTime: (Date.now() - gameState.startTime!) / 1000 });
            }, 100);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isComplete, gameState.startTime, gameState.slots, updateGameState]);

    useEffect(() => {
        isMountedRef.current = true;

        const loadWalletOfferings = async () => {
            try {
                const walletRes = await walletService.getUnusedWalletOfferings();
                if (isMountedRef.current) {
                    setWalletState(prev => ({ ...prev, walletOfferings: walletRes, loading: false }));
                }
            } catch (err) {
                console.error('Erreur chargement wallet:', err);
                if (isMountedRef.current) {
                    setWalletState(prev => ({
                        ...prev,
                        error: getCategoryErrorMessage(err, 'Erreur lors du chargement'),
                        showError: true,
                        loading: false,
                    }));
                }
            }
        };

        loadWalletOfferings();
        fetchLastEndedGame();

        return () => {
            isMountedRef.current = false;
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [fetchLastEndedGame]);

    useEffect(() => {
        if (refreshTrigger > 0) {
            fetchLastEndedGame();
        }
    }, [refreshTrigger, fetchLastEndedGame]);

    const showEnded = isGameEnded || (!isGameActive && !isGameNotStarted && lastEndedGame !== null);
    const afficheselection = !showEnded && !gameStarted;
    const affichebanner = isGameActive && !isGameEnded && endDate && startDate;

    return {
        setDragOverSlot: (value: number | null) => updateGameState({ dragOverSlot: value }),
        setIsDragging: (value: boolean) => updateGameState({ isDragging: value }),
        setSelected: (value: number | null) => updateGameState({ selected: value }),
        setMode: (value: 'drag' | 'click') => updateGameState({ mode: value }),
        dataLoading: walletState.loading,
        dataError: walletState.error, showError: walletState.showError,
        currentError: walletState.showError ? walletState.error : null,
        requiredQuantity: POT_CONFIG.quantity,
        gamehasStarted: gameStarted,
        slots: gameState.slots, mode: gameState.mode,
        selected: gameState.selected,
        dragOverSlot: gameState.dragOverSlot,
        isDragging: gameState.isDragging, error: walletState.showError,
        loading: statsLoading || configLoading || loadingLastEnded || walletState.loading,
        handleGoToMarket, handleNext, clearError, handleDragOver, handleDrop, removeFromSlot,
        placeSelectedDigitInSlot, handleSubmitAndNavigate, handleEndMatch,
        availableQuantity, cardClasses, isSufficient, afficheselection, used, isComplete,
        stats, startDate, endDate, gameConfig, lastEndedGame, showEnded, affichebanner,
    };
}