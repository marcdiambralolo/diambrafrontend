"use client";
import { useGameGenerator } from "@/hooks/learning/choix/useGameGenerator";
import { choix, niveauOptions } from "@/lib/learning/functions";
import { motion } from "framer-motion";
import { memo, useMemo } from "react";
import { FooterSection, FormField, HeaderButton, RadioButtonGroup, TitleSection } from "../game/Features";

interface GameFormViewProps {
  selectedGameType: number;
  niveau: number;
  setNiveau: (niveau: number) => void;
  lancerJeu: () => void;
}

const GameFormView = memo(({
  selectedGameType,
  niveau,
  setNiveau,
  lancerJeu
}: GameFormViewProps) => {

  const niveauOptionsList = useMemo(() =>
    niveauOptions.map((num) => ({ value: num, label: `${num}` })),
    []
  );

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-4 w-full max-w-md"
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="mb-4">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 text-center border border-purple-100">
          <p className="text-sm text-gray-500 mb-1">🎮 Jeu sélectionné</p>
          <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {choix(selectedGameType)}
          </p>
        </div>
      </div>

      <FormField label="📊 Niveau de difficulté">
        <RadioButtonGroup
          options={niveauOptionsList}
          selectedValue={niveau}
          onChange={setNiveau}
          name="niveau"
        />
      </FormField>

      <div className="mt-4 flex justify-center">
        <motion.button
          className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg font-bold px-8 py-3 rounded-xl shadow-lg transition-all duration-300"
          onClick={lancerJeu}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Démarrer le jeu"
        >
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span className="relative flex items-center gap-2">
            🚀 Démarrer le jeu
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
});

GameFormView.displayName = "GameFormView";

export default function Principale() {
  const {
    handleBack, handleClick, setNiveau, lancerJeu,
    currentYear, niveau, tpsglobal, onlineStatus,
  } = useGameGenerator();

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
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-xl opacity-30" />
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
          <div className="flex items-center justify-between p-4 pb-0">
            <HeaderButton onClick={handleClick} />
            <TitleSection />
            <div className="w-12" />
          </div>

          <div className="p-4 pt-4">
            <motion.div
              key="content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center"
            >
              <GameFormView
                selectedGameType={tpsglobal}
                niveau={niveau}
                setNiveau={setNiveau}
                lancerJeu={lancerJeu}
              />
              <motion.button
                onClick={handleBack}
                className="mt-6 px-6 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm font-medium text-gray-700"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ← Retour au menu
              </motion.button>
            </motion.div>
          </div>

          <FooterSection currentYear={currentYear} onlineStatus={onlineStatus} />
        </div>
      </div>

      <style jsx>{`
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