'use client';
import { useDiambraStore } from "@/lib/store/diambra.store";
import { memo } from 'react';
import LaMise from "./choix/LaMise";
import { HeaderSection } from "./home/fixedcontent/HeaderSection";
import LearningFixed from "./home/LearningFixed";
import TheGame from "./startgame/ProfilPageLearning";

interface ContentRendererProps {
  showChoix: boolean;
  showGame: boolean;
}

const ContentRenderer = memo(({ showChoix, showGame }: ContentRendererProps) => {
  if (showChoix) return <LaMise />;
  if (showGame) return <TheGame />;

  return null;
});

const ProfilPageLearning = memo(() => {
  const afficheGame = useDiambraStore((state) => state.afficheGame);
  const afficheChoix = useDiambraStore((state) => state.afficheChoix);

  const hasContent = afficheChoix || afficheGame;

  return (
    <div className="w-full mx-auto max-w-md mb-8 mt-4">
      <HeaderSection />
      {hasContent && (
        <div className="mt-4">
          <ContentRenderer showChoix={afficheChoix} showGame={afficheGame} />
        </div>
      )}
      <LearningFixed />
    </div>
  );
});

export default ProfilPageLearning;