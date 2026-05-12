"use client";

import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, RefreshCw, Zap, Target, Trophy, Sparkles, MousePointerClick, Move } from "lucide-react";

const SLOT_COUNT = 4;
const DIGITS = [0,1,2,3,4,5,6,7,8,9] as const;

export function NumberGridGame() {

  const [slots, setSlots] = useState<(number | null)[]>(
    () => Array.from({ length: SLOT_COUNT }, () => null)
  );

  const [selected, setSelected] = useState<number | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [completionCount, setCompletionCount] = useState(0);
  const [mode, setMode] = useState<'drag' | 'click'>('click');

  const dragStartRef = useRef<{ value:number; index?:number } | null>(null);

  const used = useMemo(
    () => new Set(slots.filter((v): v is number => v !== null)),
    [slots]
  );

  const isComplete = useMemo(
    () => slots.every(s => s !== null),
    [slots]
  );

  useEffect(() => {
    if (isComplete) {
      const uniqueValues = new Set(slots);
      if (uniqueValues.size === SLOT_COUNT) {
      //  setShowSuccess(true);
       // setCompletionCount(prev => prev + 1);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    }
  }, [isComplete, slots]);

  /* =============================
      PLACEMENT PAR CLIC
  ==============================*/
  const placeSelectedDigitInSlot = useCallback((slotIndex: number) => {
    if (selected === null) return;
    if (used.has(selected)) {
      // Le chiffre est déjà utilisé, ne rien faire
      return;
    }

    setSlots(prev => {
      const next = [...prev];
      const currentSlotValue = next[slotIndex];

      // Si la case est déjà remplie, ne rien faire (ou on pourrait échanger, mais on laisse simple)
      if (currentSlotValue !== null) {
        return prev;
      }

      next[slotIndex] = selected;
      return next;
    });

    // Désélectionner après placement
    setSelected(null);
  }, [selected, used]);

  /* =============================
      DRAG START
  ==============================*/
  const handleDragStart = (
    e: React.DragEvent<HTMLSpanElement> | React.DragEvent<HTMLButtonElement>,
    value: number,
    fromSlot?: number
  ) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ value, fromSlot })
    );
    e.dataTransfer.effectAllowed = "move";

    dragStartRef.current = { value, index: fromSlot };
    setIsDragging(true);

    const dragIcon = document.createElement("div");
    dragIcon.textContent = value.toString();
    dragIcon.className =
      "fixed top-0 left-0 bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold";

    document.body.appendChild(dragIcon);
    e.dataTransfer.setDragImage(dragIcon, 20, 20);

    setTimeout(() => document.body.removeChild(dragIcon), 0);
  };

  /* =============================
      DROP
  ==============================*/
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
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
        const currentSlotValue = next[index];

        // swap entre cases
        if (fromSlot !== undefined) {
          const movingValue = next[fromSlot];
          const targetValue = next[index];

          // Vérifier si on peut échanger
          if (movingValue !== null && targetValue !== null) {
            // Échange entre deux cases remplies
            next[fromSlot] = targetValue;
            next[index] = movingValue;
          } else if (movingValue !== null && targetValue === null) {
            // Déplacement d'une case remplie vers une case vide
            next[fromSlot] = null;
            next[index] = movingValue;
          }
          return next;
        }

        // depuis la grille - placer un nouveau chiffre
        if (value !== undefined && !used.has(value) && currentSlotValue === null) {
          next[index] = value;
          setSelected(null);
        }

        return next;
      });

    } catch(err) {
      console.error("Drop error:", err);
    }

    dragStartRef.current = null;
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverSlot(index);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const removeFromSlot = (index: number) => {
    setSlots(prev => {
      const next = [...prev];
      const removedValue = next[index];
      next[index] = null;
      return next;
    });
    setSelected(null);
  };

  const reset = useCallback(() => {
    setSlots(Array.from({ length: SLOT_COUNT }, () => null));
    setSelected(null);
    setCompletionCount(0);
    setShowSuccess(false);
  }, []);

  /* =============================
      UI
  ==============================*/
  return (
    <div
      className="mx-auto max-w-4xl p-8 space-y-8"
      onDragOver={(e) => e.preventDefault()}
    >
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl shadow-2xl">
              <p className="text-2xl font-bold">🎉 Félicitations ! 🎉</p>
              <p className="text-sm">Combinaison parfaite !</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="text-center space-y-3">
        <div className="flex justify-center gap-3">
          <div className="flex items-center gap-1 bg-gradient-to-r from-purple-100 to-indigo-100 px-3 py-1 rounded-full">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-semibold text-purple-700">{completionCount} succès</span>
          </div>
          <div className="flex items-center gap-1 bg-gradient-to-r from-emerald-100 to-teal-100 px-3 py-1 rounded-full">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-700">{used.size}/4 placés</span>
          </div>
        </div>

        <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Quatre Cases
        </h1>
        <p className="text-gray-600 text-sm">
          Choisissez un chiffre, puis cliquez sur une case vide pour le placer — ou glissez-déposez !
        </p>
      </div>

      {/* MODE SELECTOR */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setMode('click')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
            mode === 'click'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <MousePointerClick className="w-4 h-4" />
          Mode Clic
        </button>
        <button
          onClick={() => setMode('drag')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
            mode === 'drag'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Move className="w-4 h-4" />
          Mode Glisser
        </button>
      </div>

      {/* SLOTS */}
      <div className="flex justify-center gap-5">
        {slots.map((value, i) => (
          <div key={i} className="relative">
            <div
              onDragOver={(e) => mode === 'drag' && handleDragOver(e, i)}
              onDragLeave={mode === 'drag' ? handleDragLeave : undefined}
              onDrop={(e) => mode === 'drag' && handleDrop(e, i)}
              onClick={() => {
                if (mode === 'click' && value === null && selected !== null) {
                  placeSelectedDigitInSlot(i);
                } else if (mode === 'click' && value !== null) {
                  removeFromSlot(i);
                }
              }}
              className={`
                h-28 w-24 flex items-center justify-center rounded-2xl border-2 transition-all duration-300 cursor-pointer
                ${value !== null
                  ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg"
                  : dragOverSlot === i && mode === 'drag'
                  ? "border-purple-500 bg-purple-100 shadow-md"
                  : selected !== null && mode === 'click' && value === null
                  ? "border-purple-400 bg-purple-100 shadow-md ring-2 ring-purple-300"
                  : "border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100"
                }
              `}
            >
              {value !== null ? (
                <>
                  <span
                    draggable={mode === 'drag'}
                    onDragStart={(e: React.DragEvent<HTMLSpanElement>) => mode === 'drag' && handleDragStart(e, value, i)}
                    className="text-5xl font-black cursor-grab active:cursor-grabbing select-none"
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
                    <Trash2 size={14} />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <Target className="text-purple-300 w-8 h-8 mx-auto" />
                  {mode === 'click' && selected !== null && (
                    <span className="text-xs text-purple-500 mt-1 block animate-pulse">
                      Cliquez pour placer
                    </span>
                  )}
                </div>
              )}
            </div>
            {mode === 'click' && selected !== null && value === null && (
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-purple-500 whitespace-nowrap">
                ↓ Déposer ici ↓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* DIGITS */}
      <div className="space-y-3">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-purple-600">
          {mode === 'click' ? "🖱️ Choisissez un chiffre" : "🎯 Glissez un chiffre vers une case"}
        </p>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
          {DIGITS.map(d => {
            const isUsed = used.has(d);
            const isSelected = selected === d;
            
            return (
              <button
                key={d}
                draggable={mode === 'drag' && !isUsed}
                disabled={isUsed}
                onDragStart={(e: React.DragEvent<HTMLButtonElement>) => mode === 'drag' && !isUsed && handleDragStart(e, d)}
                onDragEnd={() => setIsDragging(false)}
                onClick={() => {
                  if (mode === 'click' && !isUsed) {
                    setSelected(isSelected ? null : d);
                  }
                }}
                className={`
                  relative h-14 rounded-xl font-bold transition-all duration-300
                  ${isUsed
                    ? "bg-gray-100 text-gray-400 line-through cursor-not-allowed opacity-60"
                    : isSelected && mode === 'click'
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg ring-2 ring-purple-400 ring-offset-2 scale-105"
                    : "border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 text-purple-700 hover:border-purple-400 hover:shadow-md hover:scale-105"
                  }
                `}
              >
                <span className="text-xl">{d}</span>
                {!isUsed && mode === 'click' && !isSelected && (
                  <MousePointerClick className="absolute -top-2 -right-2 w-4 h-4 text-purple-500" />
                )}
                {!isUsed && mode === 'drag' && (
                  <Move className="absolute -top-2 -right-2 w-4 h-4 text-purple-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* INDICATEUR DE SÉLECTION EN MODE CLIC */}
      {mode === 'click' && selected !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm font-semibold text-purple-600 bg-purple-50 p-2 rounded-lg"
        >
          ✨ Chiffre {selected} sélectionné — cliquez sur une case vide pour le placer ✨
        </motion.div>
      )}

      <div className="text-center">
        <button
          onClick={reset}
          className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-2.5 rounded-full flex items-center gap-2 mx-auto font-semibold text-gray-700 shadow-md transition-all hover:shadow-lg hover:scale-105"
        >
          <RefreshCw size={16} />
          Nouvelle partie
        </button>
      </div>

      <div className="text-center text-xs text-purple-600 bg-purple-50 p-3 rounded-lg">
        💡 Astuce : {mode === 'click' 
          ? "Cliquez sur un chiffre pour le sélectionner, puis cliquez sur une case vide pour le placer." 
          : "Glissez les chiffres vers les cases vides. Cliquez sur une case remplie pour la vider."}
      </div>

      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg"
          >
            Déposez sur une case vide
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}