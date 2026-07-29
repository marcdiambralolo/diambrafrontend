"use client";
import Loader from "@/app/loading";
import {  useHistoriqueConsultations } from "@/hooks/learning/historique/useHistoriqueConsultations";
import { memo } from "react";
import ErrorMessage from "../../commons/ErrorMessage";
import { BackButton } from "./components/BackButton";
import { ConsultationList } from "./components/ConsultationList";
import EditionBadge from "./components/EditionBadge";
import EditionHeader from "./components/EditionHeader";
import { StatisticsSection } from "./components/StatisticsSection";
import { Edition } from "@/lib/learning/interface";

interface HistoriquePageData {
  isLoading: boolean;
  hasError: boolean;
  hasConsultations: boolean;
  edition: Edition | undefined;
  startDate: string;
  endDate: string;
  participantsCount?: number;
  rankedConsultations: any[];
  duplicateMap: any;
  advancedStats: any;
  onGoBack: () => void;
}

const useHistoriquePageData = (): HistoriquePageData => {
  const {
    handleGoBack, loading, error, duplicateMap, hasConsultations, formattedEndDate,
    formattedStartDate, edition, advancedStats, rankedConsultations,
  } = useHistoriqueConsultations();

  return {
    isLoading: loading,
    hasError: !!error,
    hasConsultations,
    edition,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    participantsCount: advancedStats?.completedPlayers,
    rankedConsultations,
    duplicateMap,
    advancedStats,
    onGoBack: handleGoBack,
  };
};

function HistoriquePageClientImpl() {
  const data = useHistoriquePageData();

  if (data.isLoading) return <Loader />;
  if (data.hasError) return <ErrorMessage />;

  const renderEditionHeader = () => {
    if (!data.edition) return null;

    return (
      <EditionHeader
        startDate={data.startDate}
        endDate={data.endDate}
        participantsCount={data.participantsCount}
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-3 py-4 sm:px-4 sm:py-8">
      <div className="text-center">
        <EditionBadge />
      </div>

      {renderEditionHeader()}

      <ConsultationList
        hasConsultations={data.hasConsultations}
        rankedConsultations={data.rankedConsultations}
        duplicateMap={data.duplicateMap}
      />

      <StatisticsSection advancedStats={data.advancedStats} />

      <BackButton onClick={data.onGoBack} />
    </div>
  );
}

const HistoriquePageClient = memo(HistoriquePageClientImpl);

export default HistoriquePageClient;