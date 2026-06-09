'use client';
import { useStatsDataWithCache } from "@/hooks/cache/useStatsDataWithCache";
import { COLORS } from "@/lib/learning/constantes";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { Users } from "lucide-react";
import { memo } from 'react';
import { FooterSection, HeaderSection, HelpButton } from './commons/Features';
import { StatCard } from "./commons/FixedContent";
import Historique from './historique/Historique';
import Bandeau from './home/Bandeau';
import FeuilleDeMatch from "./home/FeuilleDematch";

const ProfilPageLearning = memo(() => {
  const { stats } = useStatsDataWithCache();
  const afficheStat = useMonEtoileStore((state) => state.afficheStat);

  return (
    <div className="w-full mx-auto max-w-md mb-8 mt-4">
      <HeaderSection />
      <Bandeau />
      <FeuilleDeMatch />

      <div className="fixed-bottom-content w-full space-y-4">
        {afficheStat && (<StatCard
          value={stats?.subscribers ?? null}
          label="Inscrits"
          icon={<Users className="w-4 h-4" aria-hidden="true" />}
          color={COLORS.subscribers}
        />)}
        <Historique />
        <FooterSection />
        <HelpButton />
      </div>
    </div>
  );
});

export default ProfilPageLearning;