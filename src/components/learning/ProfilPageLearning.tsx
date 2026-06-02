'use client';
 
import { APP_NAME, CURRENT_YEAR } from '@/lib/learning/constantes';
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { HelpCircle } from "lucide-react";
import { memo, useCallback, useMemo } from 'react';
import BanniereCompetition from './bannierecompetition/BanniereCompetition';
import ResultatsPage from './endgame/ResultatsPage';
import TheGame from "./game/TheGame";
import HelpPanel from "./help/HelpPanel";
import Historique from './historique/Historique';
import LaBanniere from "./labanniere/LaBanniere";
import LaMise from "./mise/LaMise";
import { useCommon } from '@/hooks/learning/home/useCommon';

const STATUS_CONFIG = {
  online: { text: 'EN LIGNE', color: 'green' },
  offline: { text: 'HORS LIGNE', color: 'red' }
} as const;

const StatusBadge = memo(({ text, color }: { text: string; color: string }) => (
  <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg bg-${color === 'red' ? 'red' : 'green'}-500 text-white flex items-center gap-1`}>
    <div className={`w-1.5 h-1.5 bg-white rounded-full ${color === 'green' ? 'bg-opacity-100' : 'bg-opacity-100'}`} />
    {text}
  </div>
));

const FooterSection = memo(({ onlineStatus }: { onlineStatus: { text: string; color: string } }) => (
  <footer className="relative mt-4 bg-gradient-to-r from-gray-900 to-gray-900 rounded-xl p-4 text-center shadow-lg overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10" />
    <div className="relative flex items-center justify-between text-xs text-white">
      <span>© {CURRENT_YEAR}</span>
      <StatusBadge text={onlineStatus.text} color={onlineStatus.color} />
    </div>
    <p className="text-white mt-2">DIAMBRA CORPORATION • Tous droits réservés.</p>
  </footer>
));

const FooterImage = memo(() => {
  const { onlineStatus } = useCommon();
  const status = useMemo(() =>
    onlineStatus ? STATUS_CONFIG.online : STATUS_CONFIG.offline,
    [onlineStatus]
  );

  return (
    <div className="w-full max-w-md mx-auto mt-2">
      <FooterSection onlineStatus={status} />
    </div>
  );
});

const HeaderSection = memo(() => (
  <div className="flex flex-col items-center justify-center mt-2 mb-2">
    <div className="relative">
      <h1 className="text-xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
        {APP_NAME}
      </h1>
      <div className="absolute -top-2 -right-6 w-2 h-2 bg-yellow-400 rounded-full opacity-75" />
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
    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
    aria-label="Aide"
    type="button"
  >
    <HelpCircle className="w-6 h-6" aria-hidden="true" />
  </button>
));

const ProfilPageLearning = memo(() => {
  const { gameStarted, jeuAcommencer, afficheaide, afficherAide, afficherJeu } = useMonEtoileStore();

  const handleHelpClick = useCallback(() => {
    afficherAide();
  }, [afficherAide]);

  const handleCloseHelp = useCallback(() => {
    afficherJeu();
  }, [afficherJeu]);

  const helpView = useMemo(() => (
    <>
      <HeaderSection />
      <HelpPanel onClose={handleCloseHelp} />
      <FooterImage />
    </>
  ), [handleCloseHelp]);

  const competitionView = useMemo(() => (
    <>
      <HeaderSection />
      <ResultatsPage />
      <BanniereCompetition />
      <Historique />
      <FooterImage />
      <HelpButton onClick={handleHelpClick} />
    </>
  ), [handleHelpClick]);

  const gameView = useMemo(() => (
    <>
      <HeaderSection />
      {gameStarted ? <TheGame /> : <LaMise />}
      <LaBanniere />
      <FooterImage />
      <HelpButton onClick={handleHelpClick} />
    </>
  ), [gameStarted, handleHelpClick]);

  if (afficheaide) {
    return <div className="w-full mx-auto max-w-md">{helpView}</div>;
  }

  if (!jeuAcommencer) {
    return <div className="w-full mx-auto max-w-md">{competitionView}</div>;
  }

  return <div className="w-full mx-auto max-w-md">{gameView}</div>;
});

export default ProfilPageLearning;