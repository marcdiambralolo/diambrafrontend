'use client';
import { useEndGameGenerator } from "@/hooks/learning/endgame/useEndGameGenerator";
import { LOAD_MORE_INCREMENT } from "@/lib/learning/constantes";
import { CompetitionDetails, } from '../commons/Features';

const FeuilleDeMatch = () => {
  const { handleValidateCompetition, handleLoadMore, competitionList, hasMore, remainingCount, } = useEndGameGenerator();

  return (
    <div className="w-full mx-auto max-w-md pb-20">
      <div className="space-y-3 animate-in fade-in duration-300">

        <div className="competition-list space-y-2">
          {competitionList?.map((competition, index) => (
            <div
              key={competition.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-in slide-in-from-bottom-4 fade-in duration-300"
            >
              <CompetitionDetails
                competition={competition}
                onValidate={handleValidateCompetition}
              />
            </div>
          ))}
        </div>
        
        {hasMore && (
          <button
            onClick={handleLoadMore}
            className="w-full py-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Charger ${Math.min(LOAD_MORE_INCREMENT, remainingCount)} compétitions supplémentaires`}
          >
            Voir plus ({remainingCount} restantes)
          </button>
        )}
      </div>
    </div>
  );
};

export default FeuilleDeMatch;