'use client';
import { useAdminConsultationsPageFinished } from "@/hooks/learning/historique/useAdminConsultationsPageFinished";
import { memo } from 'react';
import EditionCard from "./components/EditionCard";
import ParticipationsSection from "./components/ParticipationsSection";
import TitleSection from "./components/TitleSection";
import WinnersSection from "./components/WinnersSection";
import Loader from "@/app/loading";

function Historique() {
  const { activeEdition, consultations, loading } = useAdminConsultationsPageFinished();

  if (loading) { return (<Loader />); }

  return (
    <div className="w-full mx-auto max-w-xl px-4">
      {activeEdition && (
        <>
          <EditionCard activeEdition={activeEdition} />
          <TitleSection />
          <WinnersSection consultations={consultations} />
          <ParticipationsSection
            consultations={consultations}
            activeEditionId={activeEdition?.id}
          />
        </>
      )}
    </div>
  );
}

export default memo(Historique);