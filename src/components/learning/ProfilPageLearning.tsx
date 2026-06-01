'use client';
import { useCommon } from '@/hooks/learning/useCommon';
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { HelpCircle } from "lucide-react";
import { memo } from 'react';
import BanniereCompetition from './bannierecompetition/BanniereCompetition';
import ResultatsPage from './endgame/ResultatsPage';
import TheGame from "./game/TheGame";
import HelpPanel from "./help/HelpPanel";
import Historique from './historique/Historique';
import LaBanniere from "./labanniere/LaBanniere";
import LaMise from "./mise/LaMise";

const StatusBadge = memo(({ text, color }: { text: string; color: string }) => (
  <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${color === 'red' ? 'bg-red-500' : 'bg-green-500'} text-white flex items-center gap-1`}>
    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
    {text}
  </div>
));

const FooterSection = memo(({ currentYear, onlineStatus }: { currentYear: number; onlineStatus: { text: string; color: string } }) => (
  <footer className="relative mt-4 bg-gradient-to-r from-gray-900 to-gray-900 rounded-xl p-4 text-center shadow-lg overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10" />
    <div className="relative flex items-center justify-between text-xs text-white">
      <span>© {currentYear}</span>
      <StatusBadge text={onlineStatus.text} color={onlineStatus.color} />
    </div>

    <p className="text-white mt-2">DIAMBRA CORPORATION • Tous droits réservés.</p>
  </footer>
));

const FooterImage = memo(() => {
  const { onlineStatus } = useCommon();
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full max-w-md mx-auto mt-2">
      <FooterSection currentYear={currentYear} onlineStatus={onlineStatus} />
    </div>
  );
});

const HeaderSection = memo(() => (
  <div className="flex flex-col items-center justify-center mt-2 mb-2">
    <div className="relative">
      <h1 className="text-xl  font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
        DIAMBRA LEARNING
      </h1>
      <div className="absolute -top-2 -right-6 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
    </div>

    <div className="flex items-center justify-center gap-2 mt-2">
      <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
      <div className="w-8 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
    </div>
  </div>
));

const HelpButton = memo(({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
    aria-label="Aide"
  >
    <HelpCircle className="w-6 h-6" />
  </button>
));

const ProfilPageLearning = memo(() => {
  const { gameStarted, jeuAcommencer, afficheaide, afficherAide, afficherJeu } = useMonEtoileStore();

  if (afficheaide) {
    return (
      <div className="w-full mx-auto max-w-md">
        <HeaderSection />
        <HelpPanel onClose={afficherJeu} />
        <FooterImage />
      </div>
    );
  }

  if (!jeuAcommencer) {
    return (
      <div className="w-full mx-auto max-w-md">
        <HeaderSection />
        <ResultatsPage />
        <BanniereCompetition />
        <Historique />
        <FooterImage />
        <HelpButton onClick={afficherAide} />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-md">
      <HeaderSection />
      {gameStarted ? <TheGame /> : <LaMise />}
      <LaBanniere />
      <FooterImage />
      <HelpButton onClick={afficherAide} />
    </div>
  );
});

export default ProfilPageLearning;