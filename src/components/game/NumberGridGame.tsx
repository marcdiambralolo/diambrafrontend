"use client";
import { DIGITS, formatTime, SLOT_COUNT, useNumberGridGame } from "@/hooks/game/useNumberGridGame";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  MousePointerClick, Move,
  Rocket,
  Sparkles,
  Star,
  Target, Trash2,
  Trophy,
  Volume2, VolumeX,
  Zap
} from "lucide-react";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const SlotCard = ({ value, index, mode, selected, dragOverSlot, onDragOver, onDrop, onDragLeave, onPlace, onRemove }: any) => (
  <motion.div
    initial={{ scale: 0, rotateY: 180 }}
    animate={{ scale: 1, rotateY: 0 }}
    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
    whileHover={{ scale: 1.02 }}
    className="relative"
  >
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onPlace}
      className={`
        h-24 w-20 sm:h-32 sm:w-28 flex items-center justify-center rounded-2xl 
        transition-all duration-300 cursor-pointer backdrop-blur-sm
        ${value !== null
          ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl ring-2 ring-purple-400/50"
          : dragOverSlot === index && mode === 'drag'
            ? "border-3 border-purple-500 bg-purple-100 shadow-xl ring-4 ring-purple-300 scale-105"
            : selected !== null && mode === 'click' && value === null
              ? "border-3 border-purple-400 bg-purple-100 shadow-lg ring-2 ring-purple-300 scale-105"
              : "border-2 border-dashed border-purple-300 bg-white/80 hover:bg-purple-50 hover:border-purple-400 hover:shadow-lg"
        }
      `}
    >
      {value !== null ? (
        <>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-4xl sm:text-6xl font-black cursor-grab active:cursor-grabbing select-none drop-shadow-lg"
          >
            {value}
          </motion.span>
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg transition-all hover:scale-110 hover:bg-red-600 hover:shadow-xl"
          >
            <Trash2 size={16} />
          </button>
        </>
      ) : (
        <div className="text-center">
          <Target className="text-purple-300 w-8 h-8 sm:w-10 sm:h-10 mx-auto" />
          {mode === 'click' && selected !== null && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-xs text-purple-500 font-semibold whitespace-nowrap"
            >
              ↓ Déposer ↓
            </motion.span>
          )}
        </div>
      )}
    </div>
  </motion.div>
);

const DigitButton = ({ digit, isUsed, isSelected, mode, onDragStart, onDragEnd, onClick }: any) => (
  <motion.button
    whileHover={!isUsed ? { scale: 1.1, y: -2 } : {}}
    whileTap={!isUsed ? { scale: 0.95 } : {}}
    draggable={mode === 'drag' && !isUsed}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    onClick={onClick}
    disabled={isUsed}
    className={`
      relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl font-black transition-all duration-300 text-lg sm:text-xl
      ${isUsed
        ? "bg-gray-100 text-gray-400 line-through cursor-not-allowed opacity-50"
        : isSelected && mode === 'click'
          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl ring-4 ring-purple-300 scale-110"
          : "border-2 border-purple-200 bg-white text-purple-700 hover:border-purple-400 hover:shadow-lg hover:bg-purple-50"
      }
    `}
  >
    {digit}
    {!isUsed && mode === 'click' && !isSelected && (
      <MousePointerClick className="absolute -top-1 -right-1 w-4 h-4 text-purple-500" />
    )}
    {!isUsed && mode === 'drag' && (
      <Move className="absolute -top-1 -right-1 w-4 h-4 text-purple-500" />
    )}
  </motion.button>
);

export function NumberGridGame() {
  const {
    slots, selected, dragOverSlot, isDragging, mode, soundEnabled, moveCount,
    elapsedTime, used, isComplete,
    handleDragOver, handleDrop, removeFromSlot, setDragOverSlot, setIsDragging,
    setSelected, setMode, setSoundEnabled, placeSelectedDigitInSlot, handleSubmitAndNavigate
  } = useNumberGridGame();

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-purple-50/30 px-2 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 shadow-sm">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-black uppercase tracking-wider text-purple-700">
              DIAMBRA WIN
            </span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
        </motion.div>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex justify-center gap-3 sm:gap-6 flex-wrap"
        >
          {slots.map((value, i) => (
            <SlotCard
              key={i}
              value={value}
              index={i}
              mode={mode}
              selected={selected}
              dragOverSlot={dragOverSlot}
              onDragOver={(e: any) => mode === 'drag' && handleDragOver(e, i)}
              onDragLeave={() => mode === 'drag' && setDragOverSlot(null)}
              onDrop={(e: any) => mode === 'drag' && handleDrop(e, i)}
              onPlace={() => {
                if (mode === 'click' && value === null && selected !== null) {
                  placeSelectedDigitInSlot(i);
                } else if (mode === 'click' && value !== null) {
                  removeFromSlot(i);
                }
              }}
              onRemove={() => removeFromSlot(i)}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              px-10 py-4 rounded-xl font-bold text-white shadow-xl transition-all duration-300
              ${isComplete
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-500/30"
                : "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-60"
              }
            `}
            disabled={!isComplete}
            onClick={handleSubmitAndNavigate}
          >
            <span className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Valider la combinaison
              <Rocket className="w-5 h-5" />
            </span>
          </motion.button>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <p className="text-center text-xs font-bold uppercase tracking-wider text-purple-600">
            {mode === 'click' ? "🖱️ Chiffres disponibles" : "🎯 Glissez les chiffres"}
          </p>
          <div className="flex gap-2 sm:gap-3 justify-center flex-wrap max-w-xl mx-auto">
            {DIGITS.map(d => (
              <DigitButton
                key={d}
                digit={d}
                isUsed={used.has(d)}
                isSelected={selected === d}
                mode={mode}
                onDragStart={mode === 'drag' && !used.has(d) ? (e: any) => {
                  // @ts-ignore
                  const dragStart = (window as any).handleDragStart;
                  dragStart?.(e, d);
                } : undefined}
                onDragEnd={() => setIsDragging(false)}
                onClick={() => {
                  if (mode === 'click' && !used.has(d)) {
                    setSelected(selected === d ? null : d);
                  }
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Message de sélection */}
        <AnimatePresence>
          {mode === 'click' && selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 px-6 py-3 rounded-full shadow-md">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-bold text-purple-700">
                  Chiffre {selected} sélectionné — cliquez sur une case vide
                </span>
                <Sparkles className="w-4 h-4 text-purple-500" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3 max-w-md mx-auto"
        >
          <div className="text-center p-3 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 shadow-sm">
            <Sparkles className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <div className="text-2xl font-black text-purple-700">{used.size}/{SLOT_COUNT}</div>
            <div className="text-[10px] font-medium text-purple-500">Placés</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
            <Zap className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <div className="text-2xl font-black text-blue-700">{moveCount}</div>
            <div className="text-[10px] font-medium text-blue-500">Mouvements</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm">
            <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <div className="text-2xl font-black text-amber-700">{formatTime(elapsedTime)}</div>
            <div className="text-[10px] font-medium text-amber-500">Temps</div>
          </div>
        </motion.div>

        {/* Contrôles */}
        <div className="flex justify-center gap-4 flex-wrap">
          <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md border border-purple-100">
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
            className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:scale-105 transition-all border border-purple-100"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-purple-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Astuce */}
        <div className="text-center">
          <div className="inline-block bg-white/80 backdrop-blur-sm px-5 py-3 rounded-xl shadow-sm border border-purple-100">
            <p className="text-xs text-purple-600">
              💡 Astuce : {mode === 'click'
                ? "Cliquez sur un chiffre, puis sur une case vide pour le placer"
                : "Glissez les chiffres vers les cases vides"}
            </p>
          </div>
        </div>

        {/* Indicateur de glisser */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full shadow-xl font-bold text-sm z-50"
            >
              Déposez sur une case
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}