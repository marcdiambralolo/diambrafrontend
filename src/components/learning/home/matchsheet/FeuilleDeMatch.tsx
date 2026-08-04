'use client';
import { useEndGameGenerator } from "@/hooks/learning/endgame/useEndGameGenerator";
import { memo } from 'react';
import CompetitionDetails from "./CompetitionDetails";
import LoadMoreButton from "./LoadMoreButton";

const FeuilleDeMatch = memo(() => {
    const {
        handleLoadMoreClick, competitionList, hasMore, remainingCount, isLoadingMore, user,
    } = useEndGameGenerator();

    return (
        <div className="w-full mx-auto max-w-md px-4 sm:px-0">
            <div className="space-y-4">
                {competitionList?.map((competition, idx) => (
                    <CompetitionDetails
                        key={competition.id}
                        competition={competition}
                        priority={idx === 0}
                        user={user}
                    />
                ))}

                {hasMore && (
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