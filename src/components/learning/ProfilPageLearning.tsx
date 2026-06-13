'use client';
import { SKELETON_CLASSES } from "@/lib/learning/constantes";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import dynamic from 'next/dynamic';
import { Suspense, memo } from 'react';
import { HeaderSection } from './commons/Features';
import DashBoard from "./home/DashBoard";
import FixedContent from "./home/FixedContent";

const LaMise = dynamic(
  () => import('./choix/LaMise'),
  {
    loading: () => <div className={SKELETON_CLASSES.choix} />,
    ssr: false,
  }
);

const TheGame = dynamic(
  () => import('./startgame/ProfilPageLearning'),
  {
    loading: () => <div className={SKELETON_CLASSES.game} />,
    ssr: false,
  }
);

const selectAfficheChoix = (state: any) => state.afficheChoix;
const selectAfficheGame = (state: any) => state.afficheGame;
const selectAfficheStat = (state: any) => state.afficheStat;

const ProfilPageLearning = memo(() => {
  const afficheChoix = useMonEtoileStore(selectAfficheChoix);
  const afficheGame = useMonEtoileStore(selectAfficheGame);
  const afficheStat = useMonEtoileStore(selectAfficheStat);

  return (
    <div className="w-full mx-auto max-w-md mb-8 mt-4">
      <HeaderSection />

      {afficheChoix && (
        <Suspense fallback={<div className={SKELETON_CLASSES.choix} />}>
          <LaMise />
        </Suspense>
      )}
      {afficheGame && (
        <Suspense fallback={<div className={SKELETON_CLASSES.game} />}>
          <TheGame />
        </Suspense>
      )}

      <DashBoard />
      <FixedContent afficheStats={afficheStat} />
    </div>
  );
});

export default ProfilPageLearning;