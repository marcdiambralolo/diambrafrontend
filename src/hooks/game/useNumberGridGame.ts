import { api } from "@/lib/api/client";
import { Consultation } from "@/lib/interfaces";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const SLOT_COUNT = 4;
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
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
    const gameId = params?.id as string;

    // Récupération de l'ID depuis l'URL
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

    const dragStartRef = useRef<{ value: number; index?: number } | null>(null);
    const timerRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const stats = JSON.parse(saved) as GameStats;
            setCompletionCount(stats.completions);
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

    const used = useMemo(
        () => new Set(slots.filter((v): v is number => v !== null)),
        [slots]
    );

    const isComplete = useMemo(
        () => slots.every(s => s !== null) && new Set(slots).size === SLOT_COUNT,
        [slots]
    );

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

    const playSound = (type: 'place' | 'remove' | 'success') => {
        if (!soundEnabled) return;

        const audio = new Audio();
        switch (type) {
            case 'place':
                audio.src = 'data:audio/wav;base64,U3RlYWx0aCBzb3VuZA==';
                break;
            case 'remove':
                audio.src = 'data:audio/wav;base64,U3RlYWx0aCBzb3VuZA==';
                break;
            case 'success':
                audio.src = 'data:audio/wav;base64,U3RlYWx0aCBzb3VuZA==';
                break;
        }
        audio.volume = 0.3;
        audio.play().catch(() => { });
    };

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
    }, [selected, used]);

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
    }, [used]);

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
    }, []);

 const handleSubmitAndNavigate = useCallback(async () => {
    if (!gameId) {
        console.error("No game ID found");
        return;
    }

    try {
        // Récupérer d'abord la consultation existante
        const { data  } = await api.get(`/consultations/${gameId}`);
        const existingConsultation: Consultation = data  as Consultation ;
         const combinaisonWithZeros = slots
            .map(slot => slot !== null ? slot.toString() : '0')
            .join('');
        // Formater le temps
        const formattedTimeSpent = formatTime(elapsedTime);
        
        // Pour PUT, envoyer TOUS les champs
        const payload = {
            ...existingConsultation, // Garder tous les champs existants
            combinaison: combinaisonWithZeros,
            timeSpent: formattedTimeSpent,
        };
        
        
        
        console.log('Sending full payload for PUT:', payload);
        
        await api.put(`/consultations/${gameId}`, payload);
        
        router.push('/star/monprofil');
    } catch (error: any) {
        console.error('Error saving consultation:', error);
        if (error.response?.data) {
            console.error('API Error details:', error.response.data);
        }
    }
}, [gameId, elapsedTime, router]);


    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const tenths = Math.floor((seconds % 1) * 10);
        return mins > 0
            ? `${mins}:${secs.toString().padStart(2, '0')}.${tenths}`
            : `${secs}.${tenths}s`;
    };

    return {
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
        dragStartRef,
        timerRef,
        used,
        isComplete,
        placeSelectedDigitInSlot,
        handleDragStart,
        handleDrop,
        handleDragOver,
        removeFromSlot,
        formatTime,
        DIGITS,
        SLOT_COUNT,
        handleSubmitAndNavigate
    };
}
