'use client';
import { useEndGameGenerator } from "@/hooks/learning/endgame/useEndGameGenerator";
import { memo, useCallback } from 'react';
import { FooterSection, HeaderSection, HelpButton, MessageToast } from './commons/Features';
import Historique from './historique/Historique';
import Bandeau from './home/Bandeau';
import LaBanniere from './home/LaBanniere';
import FeuilleDeMatch from "./home/FeuilleDematch";

const HeaderWithToast = () => {
  const { validateMessage, clearValidateMessage } = useEndGameGenerator();

  const handleCloseToast = useCallback(() => {
    clearValidateMessage();
  }, [clearValidateMessage]);

  return (
    <>
      {validateMessage && (
        <MessageToast
          message={validateMessage}
          onClose={handleCloseToast}
        />
      )}
      <HeaderSection />
    </>
  );
};

const ProfilPageLearning = memo(() => {

  return (
    <div className="w-full mx-auto max-w-md  mb-8 mt-4">
      <HeaderWithToast />
      <Bandeau />
      <FeuilleDeMatch />

      <div className="fixed-bottom-content w-full space-y-4">
        <LaBanniere />
        <Historique />
        <FooterSection />
        <HelpButton />
      </div>
    </div>
  );
});

export default ProfilPageLearning;