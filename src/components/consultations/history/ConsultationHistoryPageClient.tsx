'use client';
import { useAnalysesByChoice } from '@/hooks/consultations/useAnalysesByChoice';
import type { Analysis } from "@/lib/interfaces";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import MarkdownCard from "../content/MarkdownCard";

export function ConsultationHistoryLoading() {

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <motion.div
            className="absolute inset-0 rounded-full border-3 border-transparent border-r-[#4F83D1] border-t-[#2E5AA6]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-1 rounded-full border-2 border-b-[#9BC2FF] border-transparent opacity-75"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm font-medium text-gray-600 dark:text-[#D1D5DB]"
        >
          Chargement des analyses…
        </motion.div>
        <div className="w-full max-w-3xl mt-8 space-y-3">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="rounded-xl border border-blue-100/30 bg-gradient-to-r from-blue-50/50 to-slate-50/50 p-4 dark:border-[color:var(--theme-border)] dark:from-[#13274C] dark:to-[#162A56]"
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="space-y-2"
              >
                <div className="h-5 bg-gray-300/40 dark:bg-gray-600/40 rounded-lg w-2/3" />
                <div className="h-4 bg-gray-300/30 dark:bg-gray-600/30 rounded-lg w-full" />
                <div className="h-4 bg-gray-300/30 dark:bg-gray-600/30 rounded-lg w-5/6" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

interface ConsultationHistoryErrorProps {
  error: string;
}

export function ConsultationHistoryError({ error }: ConsultationHistoryErrorProps) {

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl"
    >
      <div className="rounded-lg border border-red-200/60 bg-gradient-to-r from-red-50/80 to-orange-50/60 dark:from-red-950/40 dark:to-orange-950/30 px-4 py-4 dark:border-red-800/40">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-700 dark:text-red-300 mb-1">
              Erreur lors du chargement
            </h4>

            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface NavButtonProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export function NavButton({ title, onClick, disabled, children }: NavButtonProps) {

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-xl border",
        "border-slate-200 bg-white/70 text-slate-700 shadow-sm backdrop-blur",
        "hover:bg-white hover:shadow-md",
        "dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10",
        "transition-all",
        disabled ? "opacity-40 cursor-not-allowed hover:shadow-sm" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function extractMarkdown(c: Analysis): string | null {
  const v = c?.texte ?? null;
  const s = typeof v === "string" ? v.trim() : "";
  return s ? s : null;
}

export interface ConsultationContentProps {
  analyse: Analysis;
}

function ConsultationContentHistory({ analyse }: ConsultationContentProps) {
  const markdown = useMemo(() => extractMarkdown(analyse), [analyse]);

  return (
    <div className="mt-4">
      <MarkdownCard markdown={markdown!} />
    </div>
  );
}

function getAnalysisKey(analysis: Analysis | null, index: number): string {
  if (!analysis) return String(index);
  if (typeof analysis._id === 'string' && analysis._id) return analysis._id;
  if (typeof analysis.id === 'string' && analysis.id) return analysis.id;
  return String(index);
}

interface AnalysisPagerProps {
  analyses: Analysis[];
  total?: number;
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  className?: string;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const cardVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 28 : -28, filter: "blur(2px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -28 : 28, filter: "blur(2px)" }),
};

const AnalysisPager = memo(function AnalysisPager({
  analyses,
  total,
  initialIndex,
  onIndexChange,
  className,
}: AnalysisPagerProps) {
  const reduced = useReducedMotion();

  const count = analyses.length;
  const defaultIndex = useMemo(() => {
    if (!count) return 0;
    if (typeof initialIndex === "number") return clamp(initialIndex, 0, count - 1);
    return 0;
  }, [count, initialIndex]);

  const [index, setIndex] = useState(defaultIndex);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    setIndex((i) => clamp(i, 0, Math.max(0, count - 1)));
  }, [count]);

  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  const current = analyses[index] ?? null;
  const canPrev = index > 0;
  const canNext = index < count - 1;

  const goTo = useCallback(
    (nextIndex: number) => {
      const safe = clamp(nextIndex, 0, Math.max(0, count - 1));
      if (safe === index) return;
      setDir(safe > index ? 1 : -1);
      setIndex(safe);
    },
    [count, index],
  );

  const prev = useCallback(() => { if (canPrev) goTo(index - 1); }, [canPrev, goTo, index]);
  const next = useCallback(() => { if (canNext) goTo(index + 1); }, [canNext, goTo, index]);
  const first = useCallback(() => goTo(0), [goTo]);
  const last = useCallback(() => goTo(count - 1), [count, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!count) return;
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Home") first();
      else if (e.key === "End") last();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, prev, next, first, last]);

  const dragThreshold = 60;

  if (count === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Aucune analyse disponible pour ce choix.
        </div>
      </div>
    );
  }

  return (
    <section className={["w-full max-w-4xl", className].filter(Boolean).join(" ")}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-slate-600 dark:text-slate-300/80">
            Analyse <span className="font-semibold text-slate-900 dark:text-white">{index + 1}</span>
            <span className="text-slate-400 dark:text-white/30"> / </span>
            <span className="font-semibold text-slate-900 dark:text-white">{count}</span>

            {typeof total === "number" && total > count ? (
              <span className="ml-2 text-[11px] text-slate-500 dark:text-white/50">
                (total {total})
              </span>
            ) : null}
          </div>

          <div className="mt-1 h-1.5 w-40 max-w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#163A74] via-[#2E5AA6] to-[#4F83D1] transition-[width] duration-300"
              style={{ width: `${Math.round(((index + 1) / count) * 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <NavButton title="Première" onClick={first} disabled={!canPrev}>
            <ChevronsLeft className="h-4 w-4" />
          </NavButton>
          <NavButton title="Précédente" onClick={prev} disabled={!canPrev}>
            <ChevronLeft className="h-4 w-4" />
          </NavButton>
          <NavButton title="Suivante" onClick={next} disabled={!canNext}>
            <ChevronRight className="h-4 w-4" />
          </NavButton>
          <NavButton title="Dernière" onClick={last} disabled={!canNext}>
            <ChevronsRight className="h-4 w-4" />
          </NavButton>
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={getAnalysisKey(current, index)}
            custom={dir}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={
              reduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 520, damping: 44, mass: 0.9 }
            }
            drag={reduced ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (reduced) return;
              const dx = info.offset.x;
              if (dx > dragThreshold) prev();
              else if (dx < -dragThreshold) next();
            }}
            className="will-change-transform"
          >
            {current ? <ConsultationContentHistory analyse={current} /> : null}
          </motion.div>
        </AnimatePresence>

        {!reduced && count > 1 ? (
          <div className="pointer-events-none mt-3 text-center text-[11px] text-slate-500 dark:text-white/40">
            Glisse à gauche/droite ou utilise ← →
          </div>
        ) : null}
      </div>
    </section>
  );
});

interface AnalysisListProps {
  analyses: Analysis[];
  total: number;
}

export function AnalysisList({ analyses, total }: AnalysisListProps) {
  return <AnalysisPager analyses={analyses} total={total} initialIndex={0} />;
}

export default function ConsultationHistoryPageClient() {
  const { loading, error, analyses, total } = useAnalysesByChoice();

  return (
    <main className="w-full min-h-[60vh] flex flex-col items-center justify-start p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Historique de consultation
      </h1>

      {loading && <ConsultationHistoryLoading />}
      {!loading && error && <ConsultationHistoryError error={error} />}
      {!loading && !error && <AnalysisList analyses={analyses} total={total} />}
    </main>
  );
}