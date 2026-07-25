"use client";
import Loader from "@/app/loading";
import { useHistoriqueConsultations } from "@/hooks/learning/historique/useHistoriqueConsultations";
import { Calendar, Medal, Trophy } from "lucide-react";
import { memo } from "react";
import ErrorMessage from "../../commons/ErrorMessage";
import { BackButton } from "./components/BackButton";
import { ConsultationList } from "./components/ConsultationList";
import { StatisticsSection } from "./components/StatisticsSection";

function HistoriquePageClientImpl() {
  const {
    handleGoBack, loading, error, duplicateMap, hasConsultations, formattedEndDate,
    formattedStartDate, edition, advancedStats, rankedConsultations,
  } = useHistoriqueConsultations();

  if (loading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <div className="max-w-4xl mx-auto px-3 py-4 sm:px-4 sm:py-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-1.5 mb-4">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
            Édition terminée
          </span>
        </div>
      </div>

      {edition && (
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-purple-100 dark:border-purple-800 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Période de l'édition de jeu
                </p>
                <div className="pt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    <span>{formattedStartDate}</span>
                    <span className="text-gray-400">→</span>
                    <span>{formattedEndDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {advancedStats && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Medal className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                  {advancedStats.completedPlayers} participants
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <ConsultationList
        hasConsultations={hasConsultations}
        rankedConsultations={rankedConsultations}
        duplicateMap={duplicateMap}
      />

      <StatisticsSection advancedStats={advancedStats} />

      <BackButton onClick={handleGoBack} />
    </div>
  );
}

const HistoriquePageClient = memo(HistoriquePageClientImpl);
HistoriquePageClient.displayName = 'HistoriquePageClient';

export default HistoriquePageClient;