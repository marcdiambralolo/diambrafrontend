'use client';
import { useDiambraStore } from "@/lib/store/diambra.store";
import { memo } from 'react';
import LaMise from "./choix/LaMise";
import DashBoard from "./home/DashBoard";
import TheGame from "./startgame/ProfilPageLearning";
import { HeaderSection } from "./home/fixedcontent/HeaderSection";
import FixedContent from "./home/fixedcontent/FixedContent";

const ProfilPageLearning = memo(() => {
  const afficheChoix = useDiambraStore((state) => state.afficheChoix);
  const afficheGame = useDiambraStore((state) => state.afficheGame);

  return (
    <div className="w-full mx-auto max-w-md mb-8 mt-4">
      <HeaderSection />
      {afficheChoix && (<LaMise />)}
      {afficheGame && (<TheGame />)}
      <DashBoard />
      <FixedContent />
    </div>
  );
});

export default ProfilPageLearning;