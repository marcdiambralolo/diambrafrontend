'use client';
import { APP_NAME } from "@/lib/learning/constantes";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { memo } from 'react';
import LaMise from "./choix/LaMise";
import DashBoard from "./home/DashBoard";
import FixedContent from "./home/FixedContent";
import TheGame from "./startgame/ProfilPageLearning";

const HeaderSection = memo(() => (
  <div className="flex flex-col items-center justify-center mt-2 mb-2">
    <h1 className="text-xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
      {APP_NAME}
    </h1>
    <div className="flex items-center justify-center gap-2 mt-2">
      <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
      <div className="w-8 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
    </div>
  </div>
));

const ProfilPageLearning = memo(() => {
  const afficheChoix = useMonEtoileStore((state) => state.afficheChoix);
  const afficheGame = useMonEtoileStore((state) => state.afficheGame);

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