"use client";

import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, RefreshCw, Zap, Target, Trophy, Sparkles } from "lucide-react";

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
       // setShowSuccess(true);
        //setCompletionCount(prev => prev + 1);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    }
  }, [isComplete, slots]);

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
      next[index] = null;
      return next;
    });
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
          Glissez-déposez les chiffres dans les cases vides
        </p>
      </div>

      {/* SLOTS */}
      <div className="flex justify-center gap-5">
        {slots.map((value, i) => (
          <div key={i} className="relative">
            <div
              onDragOver={(e) => handleDragOver(e, i)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, i)}
              className={`
                h-28 w-24 flex items-center justify-center rounded-2xl border-2 transition-all duration-300 cursor-pointer
                ${value !== null
                  ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg"
                  : dragOverSlot === i
                  ? "border-purple-500 bg-purple-100 shadow-md"
                  : "border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100"
                }
              `}
            >
              {value !== null ? (
                <>
                  <span
                    draggable
                    onDragStart={(e: React.DragEvent<HTMLSpanElement>) => handleDragStart(e, value, i)}
                    className="text-5xl font-black cursor-grab active:cursor-grabbing select-none"
                  >
                    {value}
                  </span>
                  <button
                    onClick={() => removeFromSlot(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg transition-all hover:scale-110 hover:bg-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              ) : (
                <Target className="text-purple-300 w-8 h-8" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* DIGITS */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
        {DIGITS.map(d => {
          const isUsed = used.has(d);
          const isSelected = selected === d;
          
          return (
            <button
              key={d}
              draggable={!isUsed}
              disabled={isUsed}
              onDragStart={(e: React.DragEvent<HTMLButtonElement>) => !isUsed && handleDragStart(e, d)}
              onDragEnd={() => setIsDragging(false)}
              onClick={() => !isUsed && setSelected(isSelected ? null : d)}
              className={`
                relative h-14 rounded-xl font-bold transition-all duration-300
                ${isUsed
                  ? "bg-gray-100 text-gray-400 line-through cursor-not-allowed opacity-60"
                  : isSelected
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg ring-2 ring-purple-400 ring-offset-2"
                  : "border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 text-purple-700 hover:border-purple-400 hover:shadow-md hover:scale-105"
                }
              `}
            >
              <span className="text-xl">{d}</span>
              {!isUsed && !isSelected && (
                <Zap className="absolute -top-1 -right-1 w-3 h-3 text-yellow-500" />
              )}
            </button>
          );
        })}
      </div>

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
        💡 Astuce : Glissez les chiffres vers les cases vides. Cliquez sur une case remplie pour la vider.
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