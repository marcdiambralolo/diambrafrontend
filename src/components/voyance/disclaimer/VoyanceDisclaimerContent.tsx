"use client";
import CacheLink from '@/components/commons/CacheLink';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Brain, Gamepad2, Target, Zap, Shield, Sparkles, Star, Info, CheckCircle, Trophy, Grid, Move, MousePointerClick } from 'lucide-react';
import { useRef, useState } from 'react';

const DiceFallback = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`flex items-center justify-center rounded-full bg-purple-100 shadow-lg shadow-purple-200/50 ${className}`}>
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-md animate-pulse"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="1.5" fill="white" />
      <circle cx="16" cy="8" r="1.5" fill="white" />
      <circle cx="8" cy="16" r="1.5" fill="white" />
      <circle cx="16" cy="16" r="1.5" fill="white" />
      <circle cx="12" cy="12" r="1.5" fill="white" />
    </svg>
  </div>
);

const InfoCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-[28px] border border-purple-100 bg-white p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 sm:p-6"
    >
      {children}
    </motion.div>
  );
};

export default function GameDisclaimerContent() {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/50 py-8 px-4 sm:py-12">
      <div className="mx-auto max-w-4xl">

        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-hidden rounded-[36px] border border-purple-100 bg-white shadow-2xl shadow-purple-200/50"
        >

          <div className="relative border-b border-purple-100 bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/40 px-6 py-8 text-center sm:px-10 sm:py-10">
            {/* Éléments décoratifs */}
            <div className="absolute top-4 right-4 opacity-30">
              <DiceFallback className="w-8 h-8" />
            </div>
            <div className="absolute bottom-4 left-4 opacity-20">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/80 px-5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-purple-700 backdrop-blur-sm"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              Règles du jeu
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-5 text-4xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent sm:text-5xl"
            >
              COMMENT JOUER
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-3 text-sm text-purple-500 max-w-md mx-auto"
            >
              Maîtrisez l'art de la combinaison parfaite
            </motion.p>
          </div>

          {/* Corps du contenu */}
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="space-y-6 text-base font-medium leading-relaxed text-purple-600 sm:text-lg">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-purple-700"
              >
                <span className="font-black text-purple-600">QUATRE CASES</span> est un jeu de logique où vous devez remplir <span className="font-bold text-purple-800">4 cases</span> avec des chiffres de <span className="font-bold text-purple-800">0 à 9</span>, sans jamais en répéter aucun.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                Deux modes de jeu sont à votre disposition pour une expérience personnalisée.
              </motion.p>

              <InfoCard delay={0.7}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="rounded-2xl bg-purple-100 p-2.5">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-black text-purple-800 text-lg mb-3">🎮 Deux façons de jouer :</p>
                    <ul className="space-y-3 text-purple-600">
                      {[
                        { mode: "Mode Clic", desc: "Sélectionnez un chiffre, puis cliquez sur une case vide pour le placer.", icon: MousePointerClick },
                        { mode: "Mode Glisser-Déposer", desc: "Glissez directement un chiffre vers la case de votre choix.", icon: Move },
                        { mode: "Modification", desc: "Cliquez sur une case remplie pour la vider et changer votre combinaison.", icon: Zap },
                      ].map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + idx * 0.1 }}
                          className="flex items-start gap-2.5 group cursor-pointer"
                          onMouseEnter={() => setShowTooltip(item.desc)}
                          onMouseLeave={() => setShowTooltip(null)}
                        >
                          <item.icon className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <div>
                            <span className="font-bold text-purple-800">{item.mode}</span>
                            <span className="text-sm sm:text-base ml-2">{item.desc}</span>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </InfoCard>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 p-5"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-purple-100 p-2">
                      <Trophy className="w-5 h-5 text-purple-500" />
                    </div>
                    <span className="font-black text-purple-700">Objectif du jeu</span>
                  </div>
                  <p className="flex-1 text-sm text-purple-600">
                    Trouvez la combinaison gagnante en utilisant votre logique ! Chaque partie est unique avec 5 040 combinaisons possibles.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 p-5"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-purple-100 p-2">
                      <Grid className="w-5 h-5 text-purple-500" />
                    </div>
                    <span className="font-black text-purple-700">Règles essentielles</span>
                  </div>
                  <ul className="flex-1 text-sm text-purple-600 space-y-1">
                    <li>✓ 4 cases à remplir</li>
                    <li>✓ Chiffres de 0 à 9</li>
                    <li>✓ Pas de répétition possible</li>
                    <li>✓ Une seule solution par partie</li>
                  </ul>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="font-semibold text-purple-800 bg-purple-50/50 -mx-5 px-5 py-3 rounded-xl"
              >
                <Brain className="w-4 h-4 text-purple-500 inline mr-2" />
                Entraînez votre cerveau avec ce puzzle addictif ! Idéal pour une pause cérébrale de quelques minutes.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="mt-10 flex justify-center sm:justify-end"
            >
              <CacheLink
                href="/game"
                className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-[20px] bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 px-8 py-3 text-sm font-extrabold uppercase tracking-[0.16em] text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-400/50 focus:outline-none focus:ring-4 focus:ring-purple-300/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  Commencer à jouer
                  <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </CacheLink>
            </motion.div>
          </div>
        </motion.section>
        
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-purple-800 px-4 py-2 text-xs text-white shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Info className="w-3 h-3" />
                {showTooltip}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}