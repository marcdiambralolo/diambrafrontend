'use client';
import { useCompetitionValidation } from '@/hooks/learning/endgame/useCompetitionValidation';
import { memo } from 'react';
import CompetitionHeader from './CompetitionHeader';
import CompetitionStats from './CompetitionStats';
import MessageToast from './MessageToast';
import PermanentSuccessMessage from './PermanentSuccessMessage';
import { CompetitionInfo, User } from '@/lib/interfaces';

interface CompetitionDetailsProps {
  competition: CompetitionInfo;
  priority?: boolean;
  user: User | null;
}

const CompetitionDetails = memo(function CompetitionDetails({
  competition,
  priority = false,
  user,
}: CompetitionDetailsProps) {
  const {
    handleCloseMessage, handleClosePermanentMessage, handleValidate,
    formattedStartDate, isLoading, isValidated, validationMessage,
    showPermanentMessage, formattedFinishedDate,
  } = useCompetitionValidation(competition);

  const containerClass = `bg-white dark:bg-gray-800/50 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-800 ${priority ? 'ring-2 ring-purple-500/20 shadow-lg border-purple-100' : ''}`;

  return (
    <div className={containerClass}>
      {!isValidated && (
        <MessageToast message={validationMessage} onClose={handleCloseMessage} />
      )}

      <div className="p-3 space-y-3">
        <CompetitionHeader
          name={competition.displayName ?? ''}
          onValidate={handleValidate}
          isLoading={isLoading}
          isValidated={Boolean(isValidated)}
        />

        {isValidated && showPermanentMessage && (
          <PermanentSuccessMessage
            competitionName={competition.name ?? ''}
            onClose={handleClosePermanentMessage}
          />
        )}

        <CompetitionStats
          startDate={formattedStartDate}
          finishedDate={formattedFinishedDate ?? ''}
          timeSpent={competition.timeSpent}
          punChangeCount={competition.punChangeCount}
          user={user}
        />
      </div>
    </div>
  );
});

export default CompetitionDetails;