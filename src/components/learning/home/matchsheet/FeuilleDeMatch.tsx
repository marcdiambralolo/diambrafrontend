'use client';
import { useCompetitionValidation } from "@/hooks/learning/endgame/useCompetitionValidation";
import { useEndGameGenerator } from "@/hooks/learning/endgame/useEndGameGenerator";
import { CompetitionInfo } from "@/lib/interfaces";
import { memo, useMemo } from 'react';
import { CompetitionHeader, CompetitionStats, LoadMoreButton, MessageToast, PermanentSuccessMessage } from "./Features";

interface CompetitionDetailsProps {
    competition: CompetitionInfo;
    priority?: boolean;
}

const CompetitionDetails = memo(({ competition, priority = false }: CompetitionDetailsProps) => {
    const {
        handleCloseMessage, handleClosePermanentMessage, handleValidate, formattedStartDate,
        isLoading, isValidated, validationMessage, showPermanentMessage, formattedFinishedDate,
    } = useCompetitionValidation(competition);

    const containerClass = useMemo(() => {
        const base = "bg-white dark:bg-gray-800/50 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-800";
        if (priority) {
            return `${base} ring-2 ring-purple-500/20 shadow-lg border-purple-100`;
        }
        return base;
    }, [priority]);

    return (
        <div className={containerClass}>
            {!isValidated && (
                <MessageToast message={validationMessage} onClose={handleCloseMessage} />
            )}
            <div className="p-2 space-y-2">
                <CompetitionHeader
                    name={competition.name!}
                    onValidate={handleValidate}
                    isLoading={isLoading}
                    isValidated={isValidated!}
                />
                {isValidated && showPermanentMessage && (
                    <PermanentSuccessMessage
                        competitionName={competition.name!}
                        onClose={handleClosePermanentMessage}
                    />
                )}
                <CompetitionStats
                    startDate={formattedStartDate}
                    finishedDate={formattedFinishedDate!}
                />
            </div>
        </div>
    );
});

const FeuilleDeMatch = memo(() => {
    const {
        handleLoadMoreClick, competitionList, hasMore, remainingCount, isLoadingMore, hasValidatedGame,
    } = useEndGameGenerator();

    return (
        <div className="w-full mx-auto max-w-md px-4 sm:px-0">
            <div className="space-y-4">
                {competitionList?.map((competition, idx) => (
                    <CompetitionDetails
                        key={competition.id}
                        competition={competition}
                        priority={idx === 0}
                    />
                ))}

                {!hasValidatedGame && hasMore && (
                    <LoadMoreButton
                        onClick={handleLoadMoreClick}
                        remainingCount={remainingCount}
                        isLoading={isLoadingMore}
                    />
                )}
            </div>
        </div>
    );
});

export default FeuilleDeMatch;