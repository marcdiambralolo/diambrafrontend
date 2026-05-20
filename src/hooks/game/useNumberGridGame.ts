import { api } from "@/lib/api/client";
import { Consultation } from "@/lib/interfaces";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const SLOT_COUNT = 4;
export const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const STORAGE_KEY = "number-grid-stats";

interface GameStats {
    completions: number;
    bestTime: number | null;
    totalMoves: number;
}

export const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds % 1) * 10);
    return mins > 0
        ? `${mins}:${secs.toString().padStart(2, '0')}.${tenths}`
        : `${secs}.${tenths}s`;
};

export function useNumberGridGame() {
    const router = useRouter();
    const params = useParams();
        const searchParams = useSearchParams(); // 👈 Pour les query strings
    
    // Mémoïsation des IDs pour éviter les recalculs
    const gameId = useMemo(() => params?.id as string, [params?.id]);
      const monjeuId = useMemo(() => searchParams?.get('monjeu') as string, [searchParams]);

    // État du jeu
    const [slots, setSlots] = useState<(number | null)[]>(
        () => Array.from({ length: SLOT_COUNT }, () => null)
    );
    const [selected, setSelected] = useState<number | null>(null);
    const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [completionCount, setCompletionCount] = useState(0);
    const [mode, setMode] = useState<'drag' | 'click'>('click');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [moveCount, setMoveCount] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dragStartRef = useRef<{ value: number; index?: number } | null>(null);
    const timerRef = useRef<NodeJS.Timeout>();
    const isMountedRef = useRef(true);

    // Nettoyage au démontage
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Chargement des statistiques sauvegardées
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const stats = JSON.parse(saved) as GameStats;
                setCompletionCount(stats.completions);
            } catch (e) {
                console.error("Erreur lors du chargement des stats:", e);
            }
        }
    }, []);

    const saveStats = useCallback((completions: number) => {
        const stats: GameStats = {
            completions,
            bestTime: null,
            totalMoves: 0,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }, []);

    // Valeurs dérivées mémoïsées
    const used = useMemo(
        () => new Set(slots.filter((v): v is number => v !== null)),
        [slots]
    );

    const isComplete = useMemo(
        () => slots.every(s => s !== null) && new Set(slots).size === SLOT_COUNT,
        [slots]
    );

    const combinaison = useMemo(
        () => slots.map(slot => slot !== null ? slot.toString() : '0').join(''),
        [slots]
    );

    const formattedTime = useMemo(
        () => formatTime(elapsedTime),
        [elapsedTime]
    );

    // Gestion du timer
    useEffect(() => {
        if (!isComplete && slots.some(s => s !== null) && !startTime) {
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

    // Gestion de la complétion
    useEffect(() => {
        if (isComplete) {
            playSound('success');
            setCompletionCount(prev => {
                const newCount = prev + 1;
                saveStats(newCount);
                return newCount;
            });
        }
    }, [isComplete, saveStats]);

    const playSound = useCallback((type: 'place' | 'remove' | 'success') => {
        if (!soundEnabled) return;

        const audio = new Audio();
        const soundMap = {
            place: 'data:audio/wav;base64,U3RlYWx0aCBzb3VuZA==',
            remove: 'data:audio/wav;base64,U3RlYWx0aCBzb3VuZA==',
            success: 'data:audio/wav;base64,U3RlYWx0aCBzb3VuZA==',
        };
        audio.src = soundMap[type];
        audio.volume = 0.3;
        audio.play().catch(() => { });
    }, [soundEnabled]);

    const placeSelectedDigitInSlot = useCallback((slotIndex: number) => {
        if (selected === null) return;
        if (used.has(selected)) return;

        setSlots(prev => {
            const next = [...prev];
            if (next[slotIndex] !== null) return prev;
            next[slotIndex] = selected;
            return next;
        });

        setMoveCount(prev => prev + 1);
        setSelected(null);
        playSound('place');
    }, [selected, used, playSound]);

    const handleDragStart = useCallback((
        e: React.DragEvent<HTMLElement>,
        value: number,
        fromSlot?: number
    ) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ value, fromSlot }));
        e.dataTransfer.effectAllowed = "move";

        dragStartRef.current = { value, index: fromSlot };
        setIsDragging(true);

        const dragIcon = document.createElement("div");
        dragIcon.textContent = value.toString();
        dragIcon.className = "fixed top-0 left-0 bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg";
        document.body.appendChild(dragIcon);
        e.dataTransfer.setDragImage(dragIcon, 20, 20);
        setTimeout(() => document.body.removeChild(dragIcon), 0);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverSlot(null);
        setIsDragging(false);

        try {
            const rawData = e.dataTransfer.getData("text/plain");
            if (!rawData) return;

            const { value, fromSlot } = JSON.parse(rawData);

            setSlots(prev => {
                const next = [...prev];

                if (fromSlot !== undefined) {
                    const movingValue = next[fromSlot];
                    const targetValue = next[index];

                    if (movingValue !== null && targetValue !== null) {
                        next[fromSlot] = targetValue;
                        next[index] = movingValue;
                        playSound('place');
                    } else if (movingValue !== null && targetValue === null) {
                        next[fromSlot] = null;
                        next[index] = movingValue;
                        playSound('place');
                    }
                    setMoveCount(prev => prev + 1);
                    return next;
                }

                if (value !== undefined && !used.has(value) && next[index] === null) {
                    next[index] = value;
                    setSelected(null);
                    setMoveCount(prev => prev + 1);
                    playSound('place');
                }

                return next;
            });
        } catch (err) {
            console.error("Drop error:", err);
        }

        dragStartRef.current = null;
    }, [used, playSound]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDragOverSlot(index);
    }, []);

    const removeFromSlot = useCallback((index: number) => {
        setSlots(prev => {
            const next = [...prev];
            next[index] = null;
            return next;
        });
        setSelected(null);
        setMoveCount(prev => prev + 1);
        playSound('remove');
    }, [playSound]);

    const resetGame = useCallback(() => {
        setSlots(Array.from({ length: SLOT_COUNT }, () => null));
        setSelected(null);
        setMoveCount(0);
        setStartTime(null);
        setElapsedTime(0);
        setIsDragging(false);
        setDragOverSlot(null);
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    const handleSubmitAndNavigate = useCallback(async () => {
        // Déterminer l'ID à utiliser
        
        if (!gameId) {
            console.error("No ID found");
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // Récupérer la consultation existante
            const { data } = await api.get(`/consultations/${gameId}`);
            const existingConsultation: Consultation = data as Consultation;

            const payload = {
                ...existingConsultation,
                combinaison,
                timeSpent: formattedTime,
            };

            await api.put(`/consultations/${gameId}`, payload);
 
            // Navigation selon le contexte
            if (monjeuId) {
                router.push(`/star/monprofil/${monjeuId}`);
            } else if (gameId) {
                router.push(`/star/monprofil?gameId=${gameId}`);
            } else {
                router.push('/star/monprofil');
            }
        } catch (error: any) {
            console.error('Error saving consultation:', error);
            if (error.response?.data) {
                console.error('API Error details:', error.response.data);
            }
        } finally {
            if (isMountedRef.current) {
                setIsSubmitting(false);
            }
        }
    }, [gameId, monjeuId, combinaison, formattedTime, router, isSubmitting]);

    return {
        // IDs mémoïsés
        gameId,
        monjeuId,
        
        // État du jeu
        slots,
        setSlots,
        selected,
        setSelected,
        dragOverSlot,
        setDragOverSlot,
        isDragging,
        setIsDragging,
        completionCount,
        setCompletionCount,
        mode,
        setMode,
        soundEnabled,
        setSoundEnabled,
        moveCount,
        setMoveCount,
        startTime,
        setStartTime,
        elapsedTime,
        setElapsedTime,
        
        // Références
        dragStartRef,
        timerRef,
        
        // Valeurs dérivées
        used,
        isComplete,
        combinaison,
        formattedTime,
        
        // Handlers optimisés
        placeSelectedDigitInSlot,
        handleDragStart,
        handleDrop,
        handleDragOver,
        removeFromSlot,
        resetGame,
        handleSubmitAndNavigate,
        
        // Utilitaires
        formatTime,
        DIGITS,
        SLOT_COUNT,
        
        // État de soumission
        isSubmitting,
    };
}