'use client';
import Loader from '@/app/loading';
import { ANIMATION_CONFIG, useCategoryConsulterClient } from '@/hooks/choix/useCategoryConsulterClient';
import { DIGITS } from "@/hooks/game/useNumberGridGame";
import { useProfilUser } from "@/hooks/profil/work/useProfilUser";
import { formatDateFRJeu } from "@/lib/functions";
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, ChevronRight, Circle, Coins,
  Gift, Rocket, ShoppingBag, Sparkles, Star, Trophy, Users, Zap
} from "lucide-react";
import { ActiveBanner, DigitButton, EndedBanner, ErrorToast, GameHeader, SlotCard, StatCard, StatusBanner } from './Features';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

interface ActiveGameProps {
  slots: (number | null)[];
  selected: number | null;
  dragOverSlot: number | null;
  mode: 'drag' | 'click';
  isDragging: boolean;
  isComplete: boolean;
  used: Set<number>;
  onDragOver: (e: any, index: number) => void;
  onDrop: (e: any, index: number) => void;
  onPlace: (index: number) => void;
  onRemove: (index: number) => void;
  onDigitSelect: (digit: number) => void;
  onValidate: () => void;
  setDragOverSlot: (index: number | null) => void;
  setIsDragging: (dragging: boolean) => void;
}

const ActiveGame = ({
  slots, selected, dragOverSlot, mode, isDragging, isComplete, used,
  onDragOver, onDrop, onPlace, onRemove, onDigitSelect, onValidate,
  setDragOverSlot, setIsDragging,
}: ActiveGameProps) => (
  <div className="bg-gradient-to-br from-gray-50 via-white to-purple-50/30 px-2 py-4 sm:py-6">
    <div className="max-w-4xl mx-auto space-y-8">
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
            onDragOver={(e: any) => mode === 'drag' && onDragOver(e, i)}
            onDragLeave={() => mode === 'drag' && setDragOverSlot(null)}
            onDrop={(e: any) => mode === 'drag' && onDrop(e, i)}
            onPlace={() => {
              if (mode === 'click' && value === null && selected !== null) {
                onPlace(i);
              } else if (mode === 'click' && value !== null) {
                onRemove(i);
              }
            }}
            onRemove={() => onRemove(i)}
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
          onClick={onValidate}
        >
          <span className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Valider
            <Rocket className="w-5 h-5" />
          </span>
        </motion.button>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
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
                const dragStart = (window as any).handleDragStart;
                dragStart?.(e, d);
              } : undefined}
              onDragEnd={() => setIsDragging(false)}
              onClick={() => {
                if (mode === 'click' && !used.has(d)) {
                  onDigitSelect(d);
                }
              }}
            />
          ))}
        </div>
      </motion.div>

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

interface OfferSelectionProps {
  isSufficient: boolean;
  requiredQuantity: number;
  availableQuantity: number;
  cardClasses: string;
  onNext: () => void;
  onGoToMarket: () => void;
}

const OfferSelection = ({
  isSufficient, requiredQuantity, availableQuantity,
  cardClasses, onNext, onGoToMarket
}: OfferSelectionProps) => (
  <>
    <div className="mb-2 mt-6">
      <StatusBanner
        isSufficient={isSufficient}
        requiredQuantity={requiredQuantity}
        availableQuantity={availableQuantity}
      />
    </div>

    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: ANIMATION_CONFIG.duration.normal }}
        disabled={!isSufficient}
        className={cardClasses}
      >
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

        <div className="flex-shrink-0">
          {isSufficient ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded-full bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] p-1.5">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </motion.div>
          ) : (
            <div className="rounded-full border-2 border-gray-300 dark:border-gray-600 p-1.5">
              <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Coins className="w-3.5 h-3.5" />
              <span>Jetons requis : <strong className="text-gray-800 dark:text-gray-200">{requiredQuantity}</strong></span>
            </div>
            <div className={`flex items-center gap-2 text-xs ${isSufficient ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              <Gift className="w-3.5 h-3.5" />
              <span><strong>{availableQuantity}</strong> disponible(s)</span>
            </div>
          </div>
        </div>

        {isSufficient ? (
          <motion.div animate={{ x: [0, -5, 0] }} transition={{ duration: 1, repeat: Infinity }} className="flex-shrink-0">
            <Zap className="w-5 h-5 text-[#2E5AA6] dark:text-[#9BC2FF]" />
          </motion.div>
        ) : (
          <div className="flex-shrink-0">
            <div className="px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold">
              {availableQuantity}/{requiredQuantity}
            </div>
          </div>
        )}
      </motion.button>
    </motion.div>

    <div className="mt-8 space-y-3">
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={onNext}
        disabled={!isSufficient}
        className={`
          w-full h-12 rounded-xl mb-4 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98]
          ${isSufficient
            ? "bg-gradient-to-r from-[#2E5AA6] via-[#3A6BB8] to-[#4F83D1] text-white shadow-lg shadow-[#2E5AA6]/30 hover:shadow-xl hover:scale-[1.02] group cursor-pointer"
            : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
          }
        `}
      >
        <span>Jouer Maintenant</span>
        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isSufficient ? "group-hover:translate-x-1" : ""}`} />
      </motion.button>

      {!isSufficient && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-xs text-red-500 dark:text-red-400 mt-2">
          Vous ne disposez pas d'assez de jetons.
        </motion.p>
      )}

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={onGoToMarket}
        className="group w-full h-10 flex items-center justify-center gap-2 rounded-xl border-2 border-[#DDE7FA] bg-[#EEF4FF] text-sm font-semibold text-[#2E5AA6] transition-all duration-300 active:scale-[0.98] hover:bg-[#DDE7FA] dark:border-[#2E5AA6]/45 dark:bg-[#0F1C3F]/35 dark:text-[#9BC2FF] dark:hover:bg-[#162A56]/45"
      >
        <ShoppingBag className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
        <span>Acquérir des jetons</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </motion.button>
    </div>
  </>
);

export default function ProfilPageClient() {
  const {
    handleGoToMarket, handleNext, clearError, handleDragOver, handleDrop, removeFromSlot, setDragOverSlot,
    setIsDragging, setSelected, placeSelectedDigitInSlot, handleSubmitAndNavigate,
    dataLoading, dataError, showError, currentError, availableQuantity, cardClasses, isSufficient, requiredQuantity,
    gamehasStarted, slots, selected, dragOverSlot, isDragging, mode, used, isComplete,
  } = useCategoryConsulterClient();

  const {
    handleEndMatch, loading, stats, startDate, endDate, gameConfig,
    loadingLastEnded, lastEndedGame, showEnded, showActive,
  } = useProfilUser();

  if (loading || loadingLastEnded || dataLoading) return <Loader />;

  return (
    <div className="relative w-full mt-8 flex flex-col items-center justify-center sm:px-0 overflow-x-hidden dark:bg-none dark:bg-[#0C0B1D] dark:bg-gradient-to-b dark:from-[#0C0B1D] dark:to-[#162A56]">
      <GameHeader title="DIAMBRA WIN" />

      {(showError || !!dataError) && (
        <ErrorToast message={currentError!} onClose={clearError} />
      )}

      {!showEnded && gamehasStarted && (
        <ActiveGame
          slots={slots}
          selected={selected}
          dragOverSlot={dragOverSlot}
          mode={mode}
          isDragging={isDragging}
          isComplete={isComplete}
          used={used}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onPlace={placeSelectedDigitInSlot}
          onRemove={removeFromSlot}
          onDigitSelect={(digit) => setSelected(selected === digit ? null : digit)}
          onValidate={handleSubmitAndNavigate}
          setDragOverSlot={setDragOverSlot}
          setIsDragging={setIsDragging}
        />
      )}

      {!showEnded && !gamehasStarted && (
        <OfferSelection
          isSufficient={isSufficient}
          requiredQuantity={requiredQuantity}
          availableQuantity={availableQuantity}
          cardClasses={cardClasses}
          onNext={handleNext}
          onGoToMarket={handleGoToMarket}
        />
      )}

      <div className="fixed inset-0 overflow-hidden pointer-events-none mt-4">
        <div className="absolute top-10 left-10 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-30 animate-ping" />
        <div className="absolute top-20 right-16 w-2 h-2 bg-pink-400 rounded-full opacity-30 animate-ping delay-75" />
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-30 animate-ping delay-150" />
      </div>

      <div className="max-w-md mx-auto mt-8">
        <AnimatePresence mode="wait">
          {showActive && endDate && startDate && (
            <ActiveBanner
              key="active"
              endDate={endDate}
              handleEndMatch={handleEndMatch}
              startDate={startDate}
              formatDate={formatDateFRJeu}
              gameConfig={gameConfig}
            />
          )}

          {showEnded && (
            <EndedBanner key="ended" lastEndedGame={lastEndedGame} />
          )}
        </AnimatePresence>

        <StatCard
          value={stats?.subscribers ?? null}
          label="Inscrits"
          icon={<Users className="w-3.5 h-3.5" />}
          loading={loading}
          color="from-purple-600 to-indigo-600"
          delay={0.2}
        />
      </div>
    </div>
  );
}