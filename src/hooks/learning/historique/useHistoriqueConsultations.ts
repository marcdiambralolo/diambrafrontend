import { useCallback } from "react";
import { useConsultationDuplicates } from "./useConsultationDuplicates";
import { useConsultationStats } from "./useConsultationStats";
import { useConsultationsApi } from "./useConsultationsApi";
import { useEditionFormat } from "./useEditionFormat";

export function useHistoriqueConsultations() {
  const { data, loading, error, refetch } = useConsultationsApi();
  const { sortedConsultations, duplicateMap } = useConsultationDuplicates(data?.consultations);
  const { timeSpentStats, participantStats, advancedStats, rankedConsultations } =
    useConsultationStats(sortedConsultations, data?.stats);
  const { edition, formattedStartDate, formattedEndDate } = useEditionFormat(data?.latestEdition);

  const handleGoBack = useCallback(() => {
    window.history.back();
  }, []);

  return {
    refetch, handleGoBack, loading, error, sortedConsultations, duplicateMap,
    hasConsultations: sortedConsultations.length > 0, stats: data?.stats,
    timeSpentStats, participantStats, advancedStats, rankedConsultations,
    edition, formattedStartDate, formattedEndDate,
  };
}