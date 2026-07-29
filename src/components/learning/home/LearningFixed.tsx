'use client';
import { memo } from 'react';
import { FooterSection } from "../commons/Features";
import Historique from "../historique/Historique";
import Horloge from "./dashboard/Horloge";
import { HelpButton } from "./fixedcontent/HelpButton";
import { StatsSection } from "./fixedcontent/StatsSection";
import FeuilleDeMatch from "./matchsheet/FeuilleDeMatch";

const LearningFixed = memo(() => {

  return (
    <footer className="fixed-bottom-content w-full mx-auto max-w-md space-y-4 space-x-2">
      <Horloge />
      <FeuilleDeMatch />
      <StatsSection />
      <Historique />
      <FooterSection />
      <HelpButton />
    </footer>
  );
});

export default LearningFixed;