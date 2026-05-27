"use client";
import Loader from "@/app/loading";
import { useCommon } from "@/hooks/learning/useCommon";
import { useGameGenerator } from "@/hooks/learning/useGameGenerator";
import { caldure, formatDate } from "@/lib/learning/functions";
import { MatchInfo } from "@/lib/learning/interface";
import { Space } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { Home } from "lucide-react";
import { memo, useMemo, useState } from "react";
import UnecaseFixe from "../game/UnecaseFixe";

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

const InfoRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
  <div className="flex justify-between py-2 border-b border-gray-200">
    <span className="font-semibold text-gray-700">{label}:</span>
    <span className="text-gray-900">{value ?? 'N/A'}</span>
  </div>
);

interface FinMatchViewProps {
  niveau: number;
  datedebut: string;
  tpsglobal: number;
  infomatch: MatchInfo[];
}

const FinMatchView = memo(({
  niveau,
  datedebut,
  tpsglobal,
  infomatch
}: FinMatchViewProps) => {

  const { sommeScores, sommeTrouves, sommeRates } = useMemo(() => {
    let scores = 0, trouves = 0, rates = 0;
    for (const m of infomatch ?? []) {
      scores += m.score || 0;
      trouves += m.trouves || 0;
      rates += m.rates || 0;
    }
    return { sommeScores: scores, sommeTrouves: trouves, sommeRates: rates };
  }, [infomatch]);

  const datedefin = useMemo(() => new Date().toISOString(), []);

  const details = [
    { label: "Niveau", value: niveau },
    { label: "Score", value: sommeScores.toFixed(0) },
    { label: "Trouvés", value: `${sommeTrouves}/${infomatch.length * niveau ** 2}` },
    { label: "Ratés", value: sommeRates },
    { label: "Nombre de matchs", value: infomatch.length },
    { label: "Date de début", value: formatDate(datedebut) },
    { label: "Date de fin", value: formatDate(datedefin) },
    { label: "Temps écoulé", value: caldure(datedefin, datedebut || "01/01/1970") },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      <div className="p-4 text-black max-w-md">
        {tpsglobal === 4 &&
          details.map((item) => (
            <InfoRow key={item.label} label={item.label} value={item.value} />
          ))}
      </div>
      <AnimatePresence mode="wait">
        {infomatch && infomatch.length > 0 ? (
          <Space direction="vertical" size="middle" className="w-full flex flex-col items-center">
            {infomatch.map((match) => (
              <MatchView
                key={match.numeromatch || match.numordrep}
                matchData={match}
                option={0}
                niveau={niveau}
                datedebut={datedebut}
                datefin={datedefin}
              />
            ))}
          </Space>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center text-gray-600 text-lg font-semibold mt-6 uppercase"
            role="alert"
            aria-live="polite"
          >
            Aucun jeu disponible
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default function Principale() {
  const { onlineStatus } = useCommon();
  const {
    handleBack, handleClick, currentYear,
    loading, niveau, tpsglobal,
    infomatch, datedebut,
  } = useGameGenerator();

  if (loading) return <Loader />;

  return (
    <motion.div
      key="main"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, type: "spring" }}
      className=" w-full flex items-center justify-center"
    >
      <div className="relative w-full mx-auto max-w-md mt-8 bg-white">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={handleClick}
            className="group relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Retour à l'accueil"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Home className="relative w-5 h-5 text-white" />
          </motion.button>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              DIAMBRA LEARNING
            </span>
          </div>
          <div className="w-12" />
        </div>

        <div className="p-2">
          <motion.div
            key="content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >

            <AnimatePresence mode="wait">

              <FinMatchView
                niveau={niveau}
                datedebut={datedebut}
                tpsglobal={tpsglobal}
                infomatch={infomatch}
              />

            </AnimatePresence>
            <button
              onClick={handleBack}
              className="mb-4 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm font-medium text-gray-700"
            >
              ← Retour au menu
            </button>
          </motion.div>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-2xl shadow-xl group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
          <footer className="relative mt-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 text-center shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10" />
            <div className="relative flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span>© {currentYear}</span>
              </div>

              <div className=" right-4 z-10">
                <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${onlineStatus.color === 'red' ? 'bg-red-500' : 'bg-green-500'} text-white flex items-center gap-1`}>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  {onlineStatus.text}
                </div>
              </div>
            </div>
            <p className="relative text-gray-500 text-[10px] mt-2">
              DIAMBRA CORPORATION • Tous droits réservés
            </p>
          </footer>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </motion.div>
  );
}