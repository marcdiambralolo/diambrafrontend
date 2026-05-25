'use client';
import { useAdminConsultationsPageFinished } from "@/hooks/profil/ended/useAdminConsultationsPageFinished";
import { LoadingSkeleton } from "../admin/consultations/ConsultationsPageClientEnded";
import {
  BannersSection, EditionCard, ErrorState, HeaderSection, ParticipationsSection, TitleSection, WinnersSection,
} from "./Features";

export default function ProfilPageClient() {
  const {
    handleOpenGame, handleEndMatch, handleRefresh,
    stats, startDate, endDate, gameConfig, lastEndedGame, isLoading,
    showEnded, consultations, activeEdition, winners,  error,
    hasWinners, winningCombination, hasActiveEdition, hasNotStartedEdition,
  } = useAdminConsultationsPageFinished();

  if (isLoading) return <LoadingSkeleton />;

  if (error) {
    return <ErrorState onRefresh={handleRefresh} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-950 dark:to-purple-950/20 px-4 py-6">
      <HeaderSection />

      <BannersSection
        showNotStarted={hasNotStartedEdition as boolean}
        showActive={hasActiveEdition as boolean}
        showEnded={showEnded}
        startDate={startDate}
        endDate={endDate}
        gameConfig={gameConfig}
        lastEndedGame={lastEndedGame}
        stats={stats}
        profilLoading={isLoading}
        onOpenGame={handleOpenGame}
        onEndMatch={handleEndMatch}
      />

      <div className="relative max-w-7xl mx-auto p-6">
        <TitleSection showEnded={showEnded} />

        {activeEdition && (
          <EditionCard
            activeEdition={activeEdition}
            winningCombination={winningCombination}
          />
        )}

        <WinnersSection
          hasWinners={hasWinners!}
          winningCombination={winningCombination}
          winners={winners}
          consultations={consultations}
        />

        <ParticipationsSection
          consultations={consultations}
          activeEditionId={activeEdition?.id}
        />
      </div>
    </main>
  );
}