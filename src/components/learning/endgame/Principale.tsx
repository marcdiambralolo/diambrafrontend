"use client";
import { useGameGenerator } from "@/hooks/learning/endgame/useGameGenerator";
import { useCommon } from "@/hooks/learning/useCommon";
import { caldure, formatDate } from "@/lib/learning/functions";
import { MatchInfo } from "@/lib/learning/interface";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useMemo } from "react";
import {
  BackButton, EmptyStateEndGame, FooterSection, HeaderButton,
  InfoRowEndgame, MatchView, TitleSection
} from "../game/Features";

interface FinMatchViewProps {
  infomatch: MatchInfo[];
}

const FinMatchView = memo(({ infomatch }: FinMatchViewProps) => {
  const datefin = useMemo(() => new Date().toISOString(), []);
  const monniveau = useMemo(() => infomatch?.[0]?.niveau ?? 0, [infomatch]);
  const montpsglobal = useMemo(() => infomatch?.[0]?.tpsglobal ?? 0, [infomatch]);
  const madatedebut = useMemo(() => infomatch?.[0]?.datedebut, [infomatch]);

  const stats = useMemo(() => {
    let scores = 0, trouves = 0, rates = 0;
    for (const match of infomatch ?? []) {
      scores += match.score || 0;
      trouves += match.trouves || 0;
      rates += match.rates || 0;
    }
    return { scores, trouves, rates };
  }, [infomatch]);

  const summaryDetails = useMemo(() => [
    { label: "🎮 Niveau", value: monniveau },
    { label: "🏆 Score total", value: stats.scores.toFixed(0) },
    { label: "✓ Trouvés", value: stats.trouves },
    { label: "✗ Ratés", value: stats.rates },
    { label: "📊 Nombre de matchs", value: infomatch.length },
    { label: "📅 Date de début", value: formatDate(madatedebut || new Date().toISOString()) },
    { label: "📅 Date de fin", value: formatDate(datefin) },
    { label: "⏱️ Temps écoulé", value: caldure(datefin, madatedebut || datefin) },
  ], [monniveau, stats, infomatch.length, madatedebut, datefin]);

  const hasMatches = infomatch && infomatch.length > 0;

  if (!hasMatches) {
    return <EmptyStateEndGame />;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center px-2">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6 shadow-md"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-12 h-0.5 bg-gradient-to-r from-purple-400 to-transparent" />
          <h3 className="text-lg font-bold text-center text-purple-700">
            {montpsglobal === 4 ? "📊 RÉSUMÉ DE LA PARTIE" : "🏆 RÉSULTATS FINAUX"}
          </h3>
          <div className="w-12 h-0.5 bg-gradient-to-l from-purple-400 to-transparent" />
        </div>

        <div className={montpsglobal === 4 ? "grid grid-cols-2 gap-2" : "space-y-1"}>
          {summaryDetails.map((item) => (
            <InfoRowEndgame key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full space-y-4"
        >
          {infomatch.map((match, index) => (
            <MatchView
              key={match.numeromatch || index}
              matchData={match}
              index={index}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

FinMatchView.displayName = "FinMatchView";

export default function Principale() {
  const { onlineStatus } = useCommon();
  const { handleBack, handleClick, currentYear, displayMatches } = useGameGenerator();

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

        <div className="bg-white rounded-2xl shadow-xl p-4">
          <motion.div
            key="content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center"
          >
            <FinMatchView infomatch={displayMatches} />
            <div className="mt-4">
              <BackButton onClick={handleBack} />
            </div>
          </motion.div>
        </div>

        <FooterSection currentYear={currentYear} onlineStatus={onlineStatus} />
      </div>
    </motion.div>
  );
}