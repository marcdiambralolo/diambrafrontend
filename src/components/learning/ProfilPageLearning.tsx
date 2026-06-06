'use client';
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { memo } from 'react';
import { FooterSection, HelpButton } from './commons/Features';
import Historique from './historique/Historique';
import Bandeau from './home/Bandeau';
import FeuilleDeMatch from "./home/FeuilleDematch";
import HeaderWithToast from "./home/HeaderWithToast";
import LaBanniere from './home/LaBanniere';

const ProfilPageLearning = () => {
  const afficheBanana = useMonEtoileStore((state) => state.afficheBanana);

  return (
    <div className="w-full mx-auto max-w-md pb-20 min-h-screen">
      <div className="flex flex-col items-center justify-center mb-8 space-y-4">
        <HeaderWithToast />
        <Bandeau />
        <FeuilleDeMatch />

        <div className="fixed-bottom-content w-full space-y-4">
          <LaBanniere affichebanner={afficheBanana} />
          <Historique />
          <FooterSection />
          <HelpButton />
        </div>
      </div>
    </div>
  );
};

export const metadata = {
  title: 'Apprentissage | DIAMBRA',
  description: 'Plateforme d\'apprentissage interactive avec compétitions et récompenses',
  robots: 'index, follow',
};

export default memo(ProfilPageLearning);