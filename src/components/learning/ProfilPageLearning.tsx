'use client';
import Loader from "@/app/loading";
import { useGameConfig } from "@/hooks/learning/home/useGameConfig";
import { APP_NAME } from "@/lib/learning/constantes";
import { useDiambraStore } from "@/lib/store/diambra.store";
import { memo } from 'react';
import LaMise from "./choix/LaMise";
import LearningFixed from "./home/LearningFixed";
import TheGame from "./startgame/ProfilPageLearning";

export const HeaderSection = memo(function HeaderSection() {
  return (
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
  );
});

const ProfilPageLearning = () => {
  const { isLoading, } = useGameConfig();

  const afficheChoix = useDiambraStore((state) => state.afficheChoix);
  const afficheGame = useDiambraStore((state) => state.afficheGame);

  if (isLoading) return <Loader />;

  return (
    <div className="w-full mx-auto max-w-md mb-8 mt-4">
      <HeaderSection />

      {afficheChoix && (<LaMise />)}
      {afficheGame && (<TheGame />)}

      <LearningFixed />
    </div>
  );
};

export default ProfilPageLearning;