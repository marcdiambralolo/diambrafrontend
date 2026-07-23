'use client';
import { useCompetitionValidation } from "@/hooks/learning/endgame/useCompetitionValidation";
import { CompetitionInfo } from "@/lib/interfaces";
import { memo, useMemo } from 'react';
import { CompetitionHeader, CompetitionStats, MessageToast, PermanentSuccessMessage } from "./Features";

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

export default CompetitionDetails;