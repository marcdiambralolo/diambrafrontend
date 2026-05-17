"use client";
import { AnimatePresence, motion } from "framer-motion";
import { MousePointerClick, Move, Sparkles, Target, Trash2, Trophy, Volume2, VolumeX, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const SLOT_COUNT = 4;
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const STORAGE_KEY = "number-grid-stats";

interface GameStats {
  completions: number;
  bestTime: number | null;
  totalMoves: number;
}

export function NumberGridGame() {
  const router = useRouter();
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


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds % 1) * 10);
    return mins > 0
      ? `${mins}:${secs.toString().padStart(2, '0')}.${tenths}`
      : `${secs}.${tenths}s`;
  };

  return (
    <div
      className="mx-auto max-w-6xl space-y-6 sm:space-y-6"
      onDragOver={(e) => e.preventDefault()}
    >
      <h1 className="text-2xl sm:text-3xl text-center font-black bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
        Diambra Win
      </h1>

      <div className="flex justify-center gap-3 sm:gap-6 flex-wrap">
        {slots.map((value, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            <div
              onDragOver={(e) => mode === 'drag' && handleDragOver(e, i)}
              onDragLeave={() => mode === 'drag' && setDragOverSlot(null)}
              onDrop={(e) => mode === 'drag' && handleDrop(e, i)}
              onClick={() => {
                if (mode === 'click' && value === null && selected !== null) {
                  placeSelectedDigitInSlot(i);
                } else if (mode === 'click' && value !== null) {
                  removeFromSlot(i);
                }
              }}
              className={`
                h-24 w-20 sm:h-32 sm:w-28 flex items-center justify-center rounded-2xl border-3 transition-all duration-300 cursor-pointer
                ${value !== null
                  ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl"
                  : dragOverSlot === i && mode === 'drag'
                    ? "border-purple-500 bg-purple-100 shadow-lg ring-4 ring-purple-300 scale-105"
                    : selected !== null && mode === 'click' && value === null
                      ? "border-purple-400 bg-purple-100 shadow-lg ring-2 ring-purple-300"
                      : "border-2 border-dashed border-purple-300 bg-white/50 hover:bg-purple-50 hover:border-purple-400"
                }
              `}
            >
              {value !== null ? (
                <>
                  <span
                    draggable={mode === 'drag'}
                    // @ts-ignore
                    onDragStart={mode === 'drag' ? (e: React.DragEvent<HTMLSpanElement>) => handleDragStart(e, value, i) : undefined}
                    className="text-4xl sm:text-6xl font-black cursor-grab active:cursor-grabbing select-none"
                  >
                    {value}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromSlot(i);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg transition-all hover:scale-110 hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              ) : (
                <Target className="text-purple-300 w-8 h-8 sm:w-10 sm:h-10" />
              )}
            </div>
            {mode === 'click' && selected !== null && value === null && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-xs text-purple-500 font-semibold whitespace-nowrap"
              >
                ↓ Déposer ↓
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
 
      <div className="flex justify-center mb-4">
        <button
          className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={!isComplete}
          onClick={() => router.push('/star/monprofil')}
        >
          Valider
        </button>
      </div>
 
      <div className="space-y-3">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-purple-600">
          {mode === 'click' ? "🖱️ Choisissez un chiffre à placer" : "🎯 Glissez un chiffre vers une case vide"}
        </p>
        <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
          {DIGITS.map(d => {
            const isUsed = used.has(d);
            const isSelected = selected === d;
            return (
              <motion.button
                key={d}
                whileHover={!isUsed ? { scale: 1.1 } : {}}
                whileTap={!isUsed ? { scale: 0.95 } : {}}
                draggable={mode === 'drag' && !isUsed}
                disabled={isUsed}
                // @ts-ignore
                onDragStart={mode === 'drag' && !isUsed ? (e: React.DragEvent<HTMLButtonElement>) => handleDragStart(e, d) : undefined}
                onDragEnd={() => setIsDragging(false)}
                onClick={() => {
                  if (mode === 'click' && !isUsed) {
                    setSelected(isSelected ? null : d);
                  }
                }}
                className={`
                  relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl font-bold transition-all duration-300 text-lg sm:text-xl
                  ${isUsed
                    ? "bg-gray-100 text-gray-400 line-through cursor-not-allowed opacity-50"
                    : isSelected && mode === 'click'
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl ring-4 ring-purple-300 scale-110"
                      : "border-2 border-purple-200 bg-white text-purple-700 hover:border-purple-400 hover:shadow-lg"
                  }
                `}
              >
                {d}
                {!isUsed && mode === 'click' && !isSelected && (
                  <MousePointerClick className="absolute -top-1 -right-1 w-4 h-4 text-purple-500" />
                )}
                {!isUsed && mode === 'drag' && (
                  <Move className="absolute -top-1 -right-1 w-4 h-4 text-purple-500" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {mode === 'click' && selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center text-sm font-bold text-purple-600 bg-gradient-to-r from-purple-100 to-indigo-100 p-3 rounded-xl shadow-md"
          >
            ✨ Chiffre {selected} sélectionné — cliquez sur une case vide pour le placer ✨
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-gray-600 text-sm  mx-auto text-center">
        Placez les chiffres de 0 à 9 dans les 4 cases
      </p>

      <div className="flex justify-center gap-3 flex-wrap">
        <div className="flex gap-2 bg-white/50 backdrop-blur-sm rounded-full p-1 shadow-md">
          <button
            onClick={() => setMode('click')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${mode === 'click'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <MousePointerClick className="w-4 h-4" />
            <span className="font-semibold">Clic</span>
          </button>
          <button
            onClick={() => setMode('drag')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${mode === 'drag'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <Move className="w-4 h-4" />
            <span className="font-semibold">Glisser</span>
          </button>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="bg-white/50 backdrop-blur-sm p-2 rounded-full shadow-md hover:scale-105 transition-transform"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 text-purple-600" /> : <VolumeX className="w-5 h-5 text-gray-600" />}
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="text-center text-xs text-purple-600 bg-white/50 backdrop-blur-sm p-3 rounded-xl max-w-md">
          💡 Astuce : {mode === 'click'
            ? "Cliquez sur un chiffre pour le sélectionner, puis sur une case vide pour le placer. Cliquez sur une case remplie pour la vider."
            : "Glissez les chiffres vers les cases vides. Vous pouvez aussi échanger deux cases en glissant l'une sur l'autre."}
        </div>
      </div>

      <div className="text-center space-y-3">
        <div className="flex justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-full shadow-sm">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold text-emerald-700">{used.size}/{SLOT_COUNT} placés</span>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-2 rounded-full shadow-sm">
            <Zap className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-bold text-blue-700">{moveCount} mouvements</span>
          </div>
          {startTime && !isComplete && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 px-4 py-2 rounded-full shadow-sm">
              <span className="text-sm font-bold text-orange-700">⏱️ {formatTime(elapsedTime)}</span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-5 py-2 rounded-full shadow-lg font-semibold"
          >
            Déposez sur une case
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}