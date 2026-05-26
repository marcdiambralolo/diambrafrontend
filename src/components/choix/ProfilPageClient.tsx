'use client';
import Loader from '@/app/loading';
import { useCategoryConsulterClient } from '@/hooks/choix/useCategoryConsulterClient';
import { formatDateFRJeu } from "@/lib/functions";
import { AnimatePresence } from 'framer-motion';
import { Users } from "lucide-react";
import { ActiveBanner, ActiveGame, EndedBanner, ErrorToast, GameHeader, OfferSelection, StatCard } from './Features';

export default function ProfilPageClient() {
  const {
    handleGoToMarket, handleEndMatch, handleNext, clearError, handleDragOver, handleDrop, removeFromSlot, setDragOverSlot,
    setIsDragging, setSelected, placeSelectedDigitInSlot, handleSubmitAndNavigate,
    currentError, availableQuantity, cardClasses, isSufficient, requiredQuantity, afficheselection,
    gamehasStarted, slots, selected, dragOverSlot, isDragging, error, mode, used, isComplete,
    loading, stats, startDate, endDate, gameConfig, lastEndedGame, showEnded, affichebanner,
  } = useCategoryConsulterClient();

  if (loading) return <Loader />;

  return (
    <div className="relative w-full mt-8 flex flex-col items-center justify-center sm:px-0 overflow-x-hidden dark:bg-none dark:bg-[#0C0B1D] dark:bg-gradient-to-b dark:from-[#0C0B1D] dark:to-[#162A56]">
      <GameHeader title="DIAMBRA WIN" />

      {(error) && (
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

      {afficheselection && (
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
          {affichebanner && (
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