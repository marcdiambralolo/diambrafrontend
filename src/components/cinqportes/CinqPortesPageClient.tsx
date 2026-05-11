"use client";
import Loader from "@/app/loading";
import { useConsultationsByRubrique } from "@/hooks/consultations/doors/useConsultationsByRubrique";
import { DEFAULT_SPOTLIGHT_STYLE, useConsultationCardLogic } from "@/hooks/consultations/useConsultationCardLogic";
import { cx } from "@/lib/functions";
import { Consultation } from "@/lib/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle, Eye, Moon, Sun, Triangle } from "lucide-react";
import { memo, useCallback, useMemo } from "react";

export const porteIcons = [
  <Sun key="sun" className="w-7 h-7 text-[#2E5AA6] dark:text-[#4F83D1]" />,
  <ArrowUpCircle key="asc" className="w-7 h-7 text-[#2E5AA6] dark:text-[#4F83D1]" />,
  <ArrowDownCircle key="desc" className="w-7 h-7 text-[#2E5AA6] dark:text-[#4F83D1]" />,
  <Moon key="moon" className="w-7 h-7 text-[#2E5AA6] dark:text-[#4F83D1]" />,
  <Triangle key="mc" className="w-7 h-7 text-[#2E5AA6] dark:text-[#4F83D1]" />,
];

const CONSTANTS = {
  ANIMATION_DURATION: 0.3,
  STAGGER_DELAY: 0.05,
} as const;

const PageHeader = memo(() => (
  <motion.h1
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: CONSTANTS.ANIMATION_DURATION }}
    className="text-2xl mb-6 sm:text-4xl lg:text-5xl dark:text-white font-black text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400"
  >
    Les 5 Portes de mon Étoile
  </motion.h1>
));

export interface ConsultationCardProps {
  consultation: Consultation;
  index: number;
  onPrefetch: (consultation: Consultation) => void;
  retour: string;
}

function ConsultationCard({ consultation, index, onPrefetch, icon, retour }: ConsultationCardProps & { icon?: React.ReactNode }) {
  const {
    cardRef, derived, handleView, handleMouseMove, handleMouseLeave, handleMouseEnter,
  } = useConsultationCardLogic(consultation, onPrefetch, retour);

  return (
    <article
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onFocus={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cx(
        "group relative isolate overflow-hidden rounded-3xl p-5",
        "border border-white/40 dark:border-[color:var(--theme-border)]",
        "bg-gradient-to-br from-white/95 via-white/90 to-white/95",
        "dark:from-[#162A56] dark:via-[#13274C] dark:to-[#162A56]",
        "shadow-2xl shadow-black/5 dark:shadow-[0_18px_48px_-30px_rgba(3,10,25,0.88)]",
        "backdrop-blur-xl",
        "transition-transform duration-300 hover:-translate-y-0.5"
      )}
      style={DEFAULT_SPOTLIGHT_STYLE}
      aria-label={`Consultation`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#4F83D1]/14 to-[#9BC2FF]/6 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gradient-to-tr from-[#2E5AA6]/14 to-[#7BA9F1]/7 blur-3xl" />

        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(420px 280px at var(--sx) var(--sy), rgba(79,131,209,0.22), transparent 60%)",
          }}
        />
        <div className="absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-130%] transition-transform duration-700 group-hover:translate-x-[320%] dark:via-white/5" />
      </div>

      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-35"
        style={{
          background:
            "linear-gradient(90deg, rgba(46,90,166,0.85), rgba(79,131,209,0.88), rgba(155,194,255,0.7))",
        }}
      />
      <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-white/20 to-transparent" />

      <div className="relative z-10 flex flex-col items-center text-center w-full">
        {icon && (
          <div className="mb-2 flex items-center justify-center">{icon}</div>
        )}
        <div className="mb-4 flex flex-col items-center justify-center gap-4 w-full">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-center gap-2 w-full">
              <h3 className="line-clamp-1 text-lg font-black tracking-tight text-slate-900 dark:text-white w-full">
                {consultation.title}
              </h3>
            </div>
            <p className="mt-1 text-sm text-slate-600/90 dark:text-[#D1D5DB] w-full">
              {consultation.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 w-full">
          <button
            onClick={handleView}
            type="button"
            disabled={!derived.canView}
            className={cx(
              "group/btn w-full relative flex flex-1 items-center justify-center gap-3 rounded-2xl px-4 py-3",
              "outline-none focus-visible:ring-2 focus-visible:ring-[#4F83D1]/60",
              !derived.canView && "cursor-not-allowed opacity-60"
            )}
            aria-label={derived.viewLabel}
          >
            <div className={cx(
              "absolute inset-0 rounded-2xl shadow-lg transition-all",
              derived.canView
                ? "bg-gradient-to-r from-[#0F1C3F] to-[#162A56] group-hover/btn:from-[#163A74] group-hover/btn:to-[#4F83D1]"
                : "bg-gradient-to-r from-slate-500 to-slate-400"
            )} />
            <div className={cx(
              "absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-transparent transition-opacity",
              index ? "opacity-0 group-hover/btn:opacity-100" : "opacity-0"
            )} />
            <Eye className="relative h-4 w-4 text-white" />
            <span className="relative text-sm font-extrabold text-white">{derived.viewLabel}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

const ConsultationItem = memo(({ consultation, index, icon }: {
  consultation: Consultation;
  index: number;
  icon: React.ReactNode;
}) => {
  const getConsultationId = useCallback((c: Consultation): string => {
    return String(c._id ?? c.id ?? c.consultationId ?? index);
  }, [index]);

  const id = useMemo(() => getConsultationId(consultation), [consultation, getConsultationId]);

  return (
    <motion.li
      key={id}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: CONSTANTS.ANIMATION_DURATION,
        delay: index * CONSTANTS.STAGGER_DELAY
      }}
      className="w-full"
    >
      <ConsultationCard
        consultation={consultation}
        index={index}
        onPrefetch={() => { }}
        icon={icon}
        retour="cinqportes"
      />
    </motion.li>
  );
});

const ConsultationsList = memo(({ consultations }: {
  consultations: Consultation[];
}) => {
  const consultationsWithIcons = useMemo(() =>
    consultations.map((c, idx) => ({
      consultation: c,
      icon: porteIcons[idx % porteIcons.length],
      index: idx,
    })),
    [consultations]
  );

  if (consultations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-gray-500 dark:text-gray-400">
          Aucune consultation disponible pour le moment.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.ul
      role="list"
      className="w-full flex flex-col gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: CONSTANTS.ANIMATION_DURATION }}
    >
      <AnimatePresence mode="wait">
        {consultationsWithIcons.map(({ consultation, icon, index }) => (
          <ConsultationItem
            key={String(consultation._id ?? consultation.id ?? consultation.consultationId ?? index)}
            consultation={consultation}
            index={index}
            icon={icon}
          />
        ))}
      </AnimatePresence>
    </motion.ul>
  );
});

export default function CinqPortesPageClient() {
  const { loading, consultations } = useConsultationsByRubrique();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: CONSTANTS.ANIMATION_DURATION }}
      className="relative mx-auto w-full max-w-5xl px-4 py-8 text-slate-900 dark:bg-gradient-to-b dark:from-[#0C0B1D] dark:to-[#162A56] sm:px-6 sm:py-10"
    >
      <div className="container mx-auto">
        <PageHeader />

        <div className="w-full grid place-items-center px-2 mt-8">
          <ConsultationsList consultations={consultations} />
        </div>
      </div>
    </motion.main>
  );
}