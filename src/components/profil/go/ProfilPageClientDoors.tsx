"use client";
import { useSlide4SectionDoorsGo } from "@/hooks/cinqetoiles/useSlide4SectionDoorsGo";
import { AnimatePresence, motion } from 'framer-motion';
import { Compass, Moon, ShieldCheck, Sparkles, Star, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function ProfilPageClientDoors() {
  const { progress, isDone, isError, particles } = useSlide4SectionDoorsGo();

  const [step, setStep] = useState(0);

  const cosmicSteps = [
    {
      label: "Connexion aux données de naissance…",
      sublabel: "Synchronisation du temps et du lieu…",
      icon: <Sparkles className="w-12 h-12 text-[#FFD600]" />,
      gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
      starColor: "#FFD600"
    },
    {
      label: "Calcul des positions planétaires…",
      sublabel: "Génération de la carte du ciel…",
      icon: <Compass className="w-12 h-12 text-[#FFD600]" />,
      gradient: "from-[#0f3460] via-[#16213e] to-[#1a1a2e]",
      starColor: "#4F83D1"
    },
    {
      label: "Détermination des maisons astrologiques…",
      sublabel: "Analyse des aspects planétaires…",
      icon: <Zap className="w-12 h-12 text-[#FFD600]" />,
      gradient: "from-[#16213e] via-[#1a1a2e] to-[#0f3460]",
      starColor: "#FFD600"
    },
    {
      label: "Détermination des  aspects astrologiques…",
      sublabel: "Construction de votre profil astral…",
      icon: <Moon className="w-12 h-12 text-[#FFD600]" />,
      gradient: "from-[#0f3460] via-[#1a1a2e] to-[#16213e]",
      starColor: "#E2E8F0"
    },
    {
      label: "Compilation de votre analyse astrologique…",
      sublabel: "Finalisation du thème natal…",
      icon: <Star className="w-12 h-12 text-[#FFD600]" />,
      gradient: "from-[#1a1a2e] via-[#0f3460] to-[#16213e]",
      starColor: "#FFD600"
    },
  ];

  useEffect(() => {
    if (isDone || isError) return;
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % cosmicSteps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [cosmicSteps.length, isDone, isError]);

  const stepProgress = useMemo(() => ((step + 1) / cosmicSteps.length) * 100, [step, cosmicSteps.length]);

  if (!isDone && !isError) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="loading-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        >
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${cosmicSteps[step].gradient}`}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            style={{ backgroundSize: '200% 200%' }}
          />

          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(255,214,0,0.1) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
          />

          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-white"
              style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0, 1, 0],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut"
              }}
            />
          ))}

          <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl mx-auto px-6 text-center">
            <motion.div
              className="relative mb-8"
              animate={{
                rotateY: [0, 360],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <div className="absolute inset-0 blur-2xl bg-[#FFD600]/20 rounded-full" />
              {cosmicSteps[step].icon}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-3"
            >
              <motion.h2
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FFD600] to-[#FFA500] bg-clip-text text-transparent"
              >
                {cosmicSteps[step].label}
              </motion.h2>
              <motion.p
                key={`sub-${step}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-lg text-[#E5E7EB]/80 font-light"
              >
                {cosmicSteps[step].sublabel}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 space-y-4 w-full"
            >
              <p className="text-[#AFC0DE] text-sm">
                {progress.message || 'Préparation de votre lecture astrale personnalisée...'}
              </p>

              <div className="w-full max-w-md mx-auto">
                <div className="h-1 bg-[#2E5AA6]/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#FFD600] to-[#FFA500] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${stepProgress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-[#AFC0DE]/60">
                  <span>Étape {step + 1}</span>
                  <span>sur {cosmicSteps.length}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-12 flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <ShieldCheck className="w-4 h-4 text-[#FFD600]" />
              <span className="text-xs text-[#AFC0DE]">Connexion sécurisée & chiffrée</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-8 text-xs text-[#AFC0DE]/50 italic"
            >
              Ne fermez pas cette page — l'univers travaille pour vous ✨
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto w-full max-w-3xl mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white/10 backdrop-blur-sm shadow-[0_24px_70px_-40px_rgba(2,6,23,0.35)] dark:border-[color:var(--theme-border)] dark:bg-[#0F1C3F]/90 dark:text-[#E5E7EB]"
      >
        <div className="px-6 pb-5 pt-6 sm:px-8 relative z-20">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-[color:var(--theme-border)] dark:bg-[#13274C] dark:text-[#DDE7FA]">
                <ShieldCheck className="h-4 w-4 text-slate-900 dark:text-[#9BC2FF]" />
                Traitement sécurisé en cours...
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-[#AFC0DE]">
                {progress.message || 'Connexion cosmique en cours…'}
              </p>
            </div>
          </div>

          {isError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-5 rounded-2xl border border-rose-200 bg-white px-4 py-3 dark:border-rose-500/30 dark:bg-[#16233E]"
            >
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">Une erreur est survenue</div>
              <div className="mt-1 text-sm text-slate-700 dark:text-[#DDE7FA]">
                {progress.error || 'Veuillez réessayer.'}
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
}