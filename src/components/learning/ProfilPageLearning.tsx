'use client';
import { memo } from 'react';
import { FooterSection, HelpButton } from './commons/Features';
import Historique from './historique/Historique';
import Bandeau from './home/Bandeau';
import FeuilleDeMatch from "./home/FeuilleDematch";
import HeaderWithToast from "./home/HeaderWithToast";
import LaBanniere from './home/LaBanniere';

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