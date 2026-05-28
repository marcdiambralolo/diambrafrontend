"use client";
import Loader from "@/app/loading";
import { useCommon } from "@/hooks/learning/useCommon";
import { useGameGenerator } from "@/hooks/learning/useGameGenerator";
import { choix, formatTime } from "@/lib/learning/functions";
import { Case, MatchInfo } from "@/lib/learning/interface";
import { BarChartOutlined, TrophyOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { memo, useMemo } from "react";
import {
  ActionButton, BackButton, FooterSection, HeaderButton,
  InfoRowGame, ObjectiveCard, Ploader, PloaderFixe, TitleSection
} from "./Features";

interface GamePlayViewProps {
  cases: Case[];
  casesun: Case[];
  pieces: string[];
  selectedCase: Case | null;
  selectCase: (c: Case | null) => void;
  showPun: boolean;
  toggleShowPun: () => void;
  lockSelectedCase: () => void;
  timeElapsed: number;
  niveau: number;
  matchEncours: number;
  infomatch: MatchInfo[];
  tpsglobal: number;
}

const GamePlayView = memo(({
  tpsglobal,
  cases,
  casesun,
  pieces,
  selectedCase,
  selectCase,
  showPun,
  toggleShowPun,
  lockSelectedCase,
  timeElapsed,
  niveau,
  matchEncours,
  infomatch
}: GamePlayViewProps) => {

  const currentGameType = useMemo(() => {
    if (!infomatch?.length || matchEncours === undefined || !infomatch[matchEncours]) {
      return "Aucun match en cours";
    }
    return choix(infomatch[matchEncours].tpsglobal || 0);
  }, [infomatch, matchEncours]);

  return (
    <div className="flex flex-col items-center justify-center w-full py-4 mb-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center px-4"
      >
        <div className="mb-4">
          {showPun ? (
            <PloaderFixe niveau={niveau} casesun={casesun} pieces={pieces} />
          ) : (
            <Ploader
              niveau={niveau}
              cases={cases}
              selectedCase={selectedCase}
              selectCase={selectCase}
              pieces={pieces}
              tpsglobal={tpsglobal}
            />
          )}
        </div>

        <div className="flex flex-col items-center justify-center w-full mt-4">
          <h2 className="text-xs font-bold text-blue-700 mb-3 tracking-wide">
            {showPun ? "👤 Plateau P1 (Référence)" : "🕹️ Plateau P2"}
          </h2>

          <div className="flex items-center justify-center gap-3 flex-wrap">


            <ActionButton
              onClick={toggleShowPun}
              variant="secondary"
              ariaLabel={showPun ? "Jouer" : "Voir P1"}
            >
              {showPun ? "Jouer" : "Voir P1"}
            </ActionButton>

            {!showPun && (
              <ActionButton
                onClick={lockSelectedCase}
                variant="primary"
                ariaLabel="Ajuster la sélection"
              >
                Ajuster
              </ActionButton>
            )}
            
            <div className="font-bold text-blue-600 flex items-center gap-2 text-lg bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-sm">⏱</span>
              <span>{formatTime(timeElapsed)}</span>
            </div>
          </div>

          <div className="mt-4 w-full space-y-3">
            {cases && cases.length > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-4">
                  <span>Progression</span>
                  <span>{cases.filter(c => c.isLocked).length}/{cases.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(cases.filter(c => c.isLocked).length / cases.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <ObjectiveCard />

            <InfoRowGame
              icon={<TrophyOutlined />}
              iconBg="bg-yellow-100 dark:bg-yellow-900/30"
              iconColor="text-yellow-600 dark:text-yellow-400"
              label="JEU EN COURS"
              value={currentGameType}
            />

            <InfoRowGame
              icon={<BarChartOutlined />}
              iconBg="bg-green-100 dark:bg-green-900/30"
              iconColor="text-green-600 dark:text-green-400"
              label="NIVEAU DU JEU"
              value={niveau ?? "N/A"}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
});

GamePlayView.displayName = "GamePlayView";

const Principale = memo(() => {
  const { onlineStatus } = useCommon();
  const { handleBack, handleClick, currentYear, loading, gamePlayProps } = useGameGenerator();

  if (loading) { return <Loader />; }

  return (
    <motion.div
      key="main"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
    >
      <div className="relative w-full mx-auto max-w-md">
        <div className="flex items-center justify-between mb-6">
          <HeaderButton onClick={handleClick} />
          <TitleSection />
          <div className="w-12" />
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <motion.div
            key="content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center"
          >
            <GamePlayView {...gamePlayProps} />
            <BackButton onClick={handleBack} />
          </motion.div>
        </div>

        <FooterSection currentYear={currentYear} onlineStatus={onlineStatus} />
      </div>
    </motion.div>
  );
});

Principale.displayName = "Principale";

export default Principale;