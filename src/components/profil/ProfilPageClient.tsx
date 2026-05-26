'use client';
import { useAdminConsultationsPageFinished } from "@/hooks/profil/ended/useAdminConsultationsPageFinished";
import {
  BannersSection, EditionCard, ErrorState, HeaderSection, ParticipationsSection, TitleSection, WinnersSection,
} from "./Features";

export default function ProfilPageClient() {
  const {
    handleOpenGame, handleEndMatch, handleRefresh,
    stats, startDate, endDate, gameConfig, lastEndedGame,
    showEnded, consultations, activeEdition, winners, error,
    hasWinners, winningCombination, hasNotStartedEdition, gameStarted,
  } = useAdminConsultationsPageFinished();

  if (error) {
    return <ErrorState onRefresh={handleRefresh} />;
  }

  return (
    <main className="bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-950 dark:to-purple-950/20 px-2 py-4">
      <HeaderSection />

      <BannersSection
        showNotStarted={hasNotStartedEdition as boolean}
        showActive={gameStarted}
        showEnded={showEnded}
        startDate={startDate}
        endDate={endDate}
        gameConfig={gameConfig}
        lastEndedGame={lastEndedGame}
        stats={stats}
        onOpenGame={handleOpenGame}
        onEndMatch={handleEndMatch}
      />

      <div className="relative max-w-8xl mx-auto p-2 mt-4">
        {activeEdition && (
          <EditionCard
            activeEdition={activeEdition}
            winningCombination={winningCombination}
          />
        )}

        <TitleSection showEnded={showEnded} />

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