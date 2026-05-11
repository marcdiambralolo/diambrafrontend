'use client';
import { useConsultationResult } from '@/hooks/consultations/useConsultationResult';
import { cx } from '@/lib/functions';
import { Analysis } from '@/lib/interfaces';
import { motion, useReducedMotion,Variants  } from 'framer-motion';
import { AlertCircle, ArrowLeft, Moon, Sparkles, Star, Stars } from 'lucide-react';
import React, { memo } from 'react';
import MarkdownCard from '../content/MarkdownCard';

interface ConsultationErrorProps {
  error: string;
  onRetry?: () => void;
}

export const ConsultationError: React.FC<ConsultationErrorProps> = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
    <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
    <div className="text-red-700 dark:text-red-400 font-semibold mb-2">{error}</div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 px-4 py-2 rounded bg-red-100 hover:bg-red-200 text-red-700 font-medium shadow"
      >
        Réessayer
      </button>
    )}
  </div>
);

export const DM = {
  shell: 'relative mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10',
  btnSecondary:
    'inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-500 hover:text-black hover:-translate-y-0.5 hover:border-black',
  ring:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06101d]',

  page: 'min-h-screen bg-[#06101d] text-white',
  panel:
    'relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,22,41,0.96),rgba(6,14,28,0.98))] shadow-[0_24px_90px_rgba(0,0,0,0.42)]',
  panelSoft:
    'relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,22,41,0.90),rgba(7,15,29,0.94))] shadow-[0_18px_56px_rgba(0,0,0,0.28)]',
  badge:
    'inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/90',
  btnPrimary:
    'inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/25 bg-[linear-gradient(135deg,#91ebff_0%,#5cbcff_38%,#7c5cff_100%)] px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_35px_rgba(76,169,255,0.36)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(76,169,255,0.48)] active:translate-y-0',
  btnWarning:
    'inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300/20 bg-[linear-gradient(135deg,#fbbf24,#f59e0b,#ea580c)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_-20px_rgba(234,88,12,0.70)] transition-all duration-300 hover:-translate-y-0.5',
};

export function LoadingScreen() {
  return (<CosmicLoader />);
}

const orbitVariants: Variants = {
  rotate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

const planetVariants: (delay: number) => Variants = (delay: number) => ({
  orbit: {
    rotate: 360,
    transition: {
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "linear"
    }
  }
});

const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const CosmicLoader = memo(() => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white p-4">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.42, 0.2],
        }}
        transition={{
          duration: 4.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-violet-500/30 to-fuchsia-500/20 blur-3xl sm:h-96 sm:w-96"
      />

      <motion.div
        animate={{
          scale: [1, 1.28, 1],
          opacity: [0.16, 0.36, 0.16],
        }}
        transition={{
          duration: 5.4,
          delay: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-indigo-500/24 to-purple-400/14 blur-3xl sm:h-96 sm:w-96"
      />

      <motion.div
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.08, 0.22, 0.08],
        }}
        transition={{
          duration: 6.2,
          delay: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[10%] left-[18%] h-56 w-56 rounded-full bg-gradient-to-r from-amber-200/10 to-violet-300/10 blur-3xl sm:h-80 sm:w-80"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-violet-200/15 p-6 text-center shadow-[0_20px_80px_rgba(76,29,149,0.35)] backdrop-blur-2xl sm:rounded-[2rem] sm:p-10 bg-gradient-to-br from-[#14051F] via-[#24103A] to-[#090511]"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-200/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_36%)]" />

        <div className="relative mx-auto mb-6 h-28 w-28 sm:mb-8 sm:h-36 sm:w-36">
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.18, 0.32, 0.18],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full border border-violet-300/15"
          />

          <motion.div
            variants={pulseVariants}
            animate="pulse"
            className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-purple-400 shadow-2xl shadow-violet-500/30 sm:h-16 sm:w-16"
          >
            <Stars className="h-6 w-6 text-white sm:h-8 sm:w-8" strokeWidth={2.5} />
          </motion.div>

          <motion.div
            variants={orbitVariants}
            animate="rotate"
            className="absolute inset-0 rounded-full border-2 border-dashed border-violet-300/25"
          >
            <motion.div
              variants={planetVariants(0)}
              animate="orbit"
              className="absolute -top-2 left-1/2 -ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 shadow-lg shadow-violet-500/20 sm:h-5 sm:w-5"
            >
              <Moon className="h-3 w-3 text-white sm:h-4 sm:w-4" fill="white" />
            </motion.div>
          </motion.div>

          <motion.div
            variants={orbitVariants}
            animate="rotate"
            className="absolute inset-4 rounded-full border-2 border-dashed border-fuchsia-300/20"
            style={{ animationDirection: "reverse" }}
          >
            <motion.div
              variants={planetVariants(0.5)}
              animate="orbit"
              className="absolute -top-1.5 left-1/2 -ml-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-400 to-pink-300 shadow-lg sm:h-4 sm:w-4"
            >
              <Sparkles className="h-2 w-2 text-white sm:h-3 sm:w-3" fill="white" />
            </motion.div>
          </motion.div>

          <motion.div
            variants={orbitVariants}
            animate="rotate"
            className="absolute inset-8 rounded-full border-2 border-dashed border-indigo-200/20"
          >
            <motion.div
              variants={planetVariants(1)}
              animate="orbit"
              className="absolute -top-1 left-1/2 -ml-1 flex h-2 w-2 items-center justify-center rounded-full bg-gradient-to-r from-amber-200 to-violet-300 shadow-lg sm:h-3 sm:w-3"
            >
              <Star className="h-1.5 w-1.5 text-white sm:h-2 sm:w-2" fill="white" />
            </motion.div>
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-3 bg-gradient-to-r from-white via-violet-100 to-fuchsia-200 bg-clip-text text-xl font-black tracking-tight text-transparent sm:mb-4 sm:text-2xl lg:text-3xl"
        >
          Harmonisation de votre analyse en cours.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6 text-sm text-violet-100/80 sm:text-base"
        >
          Les énergies s'alignent pour préparer votre guidance. Veuillez patienter...
        </motion.p>

        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.45, 1],
                opacity: [0.35, 1, 0.35],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-200 shadow-[0_0_14px_rgba(216,180,254,0.45)] sm:h-2.5 sm:w-2.5"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
});

export function extractMarkdown(c: Analysis): string | null {
  const v = c?.texte ?? null;
  const s = typeof v === "string" ? v.trim() : "";
  return s ? s : null;
}

export default function ConsultationResultPageClient() {
  const reduceMotion = useReducedMotion();
  const { handleBack, loading, error, markdown } = useConsultationResult();

  if (loading || !markdown) return <LoadingScreen />;

  if (error) {
    return (
      <ConsultationError error={error} onRetry={handleBack} />
    );
  }

  return (
    <div className={cx('text-white', 'relative overflow-hidden')}>
      <div className={DM.shell}>
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.32 }}
          className="relative z-10 space-y-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleBack}
              className={cx(DM.ring, DM.btnSecondary, 'bg-black')}
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>
          </div>
          <MarkdownCard markdown={markdown} />
        </motion.div>
      </div>
    </div>
  );
}