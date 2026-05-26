import { useState, useCallback, useEffect, useRef } from 'react';
import { SLOT_COUNT } from './useCategoryConsulterClient';

const createEmptySlots = (): (number | null)[] => Array.from({ length: SLOT_COUNT }, () => null);

interface DragData {
    value: number;
    fromSlot?: number;
}

interface GameState {
    slots: (number | null)[];
    selected: number | null;
    dragOverSlot: number | null;
    isDragging: boolean;
    mode: 'drag' | 'click';
    startTime: number | null;
    elapsedTime: number;
    isSubmitting: boolean;
}

export function useGameEngine() {
    const timerRef = useRef<NodeJS.Timeout>();
    const dragStartRef = useRef<DragData | null>(null);
    const slotsRef = useRef<(number | null)[]>(createEmptySlots());

    const [gameState, setGameState] = useState<GameState>({
        slots: createEmptySlots(),
        selected: null,
        dragOverSlot: null,
        isDragging: false,
        mode: 'click',
        startTime: null,
        elapsedTime: 0,
        isSubmitting: false,
    });

    useEffect(() => {
        slotsRef.current = gameState.slots;
    }, [gameState.slots]);

    const updateGameState = useCallback((updater: Partial<GameState>) => {
        setGameState(prev => ({ ...prev, ...updater }));
    }, []);

    const used = new Set(gameState.slots.filter((v): v is number => v !== null));
    const isComplete = gameState.slots.every(s => s !== null) && new Set(gameState.slots).size === SLOT_COUNT;
    const combinaison = gameState.slots.map(slot => slot !== null ? slot.toString() : '0').join('');

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const tenths = Math.floor((seconds % 1) * 10);
        return mins > 0
            ? `${mins}:${secs.toString().padStart(2, '0')}.${tenths}`
            : `${secs}.${tenths}s`;
    };

    const formattedTime = formatTime(gameState.elapsedTime);

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

    return {
        gameState,
        updateGameState,
        used,
        isComplete,
        combinaison,
        formattedTime,
        placeSelectedDigitInSlot,
        removeFromSlot,
        handleDrop,
        handleDragOver,
        setDragOverSlot: (value: number | null) => updateGameState({ dragOverSlot: value }),
        setIsDragging: (value: boolean) => updateGameState({ isDragging: value }),
        setSelected: (value: number | null) => updateGameState({ selected: value }),
        setMode: (value: 'drag' | 'click') => updateGameState({ mode: value }),
    };
}