'use client';
import { caldure, formatDate } from "@/lib/learning/functions";
import { MatchInfo } from "@/lib/learning/interface";
import { motion } from "framer-motion";
import { useState, useMemo, memo } from "react";
import InfoRow from "./InfoRow";
import UnecaseFixe from "./UnecaseFixe";

interface MatchViewProps {
  matchData: MatchInfo;
  option: number;
  niveau: number;
  datedebut: string;
  datefin: string;
}

interface PloaderProps {
  match: MatchInfo;
  niveau: number;
  initiale?: boolean;
}

const Ploader: React.FC<PloaderProps> = memo(({ match, niveau, initiale = false }) => {
  return (
    <div
      className="w-full grid"
      style={{
        gridTemplateColumns: `repeat(${niveau}, 1fr)`,
        gridTemplateRows: `repeat(${niveau}, 1fr)`,
      }}
    >
      {(initiale ? match?.listeCaseOpLabInitiale || [] : match?.listeCaseOpLab || []).map((c) => (
        <UnecaseFixe key={c.id} {...c} isLocked={!initiale} size="100%" pieces={match?.pieces || []} />
      ))}
    </div>
  );
});

Ploader.displayName = "Ploader";

const MatchView: React.FC<MatchViewProps> = memo(({ matchData, option, niveau, datedebut, datefin }) => {
  const [showFirstBoard, setShowFirstBoard] = useState(true);

  const formattedScore = useMemo(() => {
    if (!matchData?.score) return "0";
    return option === 0 && matchData.score % 1 === 0 ? matchData.score.toFixed(0) : matchData.score.toFixed(2);
  }, [matchData.score, option]);

  const timeElapsed = useMemo(() => {
    return caldure(datefin ?? "", datedebut ?? "");
  }, [datefin, datedebut]);

  return (
    <motion.div key={matchData.tpsglobal}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.7 }}
      className="w-full shadow-lg rounded-xl bg-white mt-4 hover:shadow-2xl transition-shadow"
    >
      <div className="w-full flex flex-col p-4 border max-w-md rounded-lg shadow-md bg-white">
        <InfoRow label="Type de Match" value={option === 0 ? "🔥Manuel" : "✅ Automatique"} />
        <InfoRow label="Score" value={formattedScore} />
        <InfoRow label="Trouvés" value={`${matchData.trouves ?? 0}/${matchData.numordrep ?? 0}`} />
        <InfoRow label="Ratés" value={matchData.rates ?? "0/0"} />
        <InfoRow label="Début du Jeu" value={formatDate(datedebut ?? " ")} />
        <InfoRow label="Fin du Jeu" value={formatDate(datefin ?? " ")} />
        <InfoRow label="Temps écoulé" value={timeElapsed} />

        <div className="mt-4 text-center font-bold w-full">
          {showFirstBoard ? (
            <Ploader niveau={niveau} match={matchData} />
          ) : (
            <Ploader match={matchData} niveau={niveau} initiale />
          )}
        </div>

        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded transition hover:bg-blue-600"
          onClick={() => setShowFirstBoard((prev) => !prev)}
          aria-label={showFirstBoard ? "Voir P2" : "Voir P1"}
        >
          {showFirstBoard ? "Voir P2" : "Voir P1"}
        </button>
      </div>
    </motion.div>
  );
});

MatchView.displayName = "MatchView";

export default MatchView;