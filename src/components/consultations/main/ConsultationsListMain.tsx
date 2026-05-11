"use client";
import { DEFAULT_SPOTLIGHT_STYLE, useConsultationCardLogic } from "@/hooks/consultations/useConsultationCardLogic";
import { useConsultationsListPage } from "@/hooks/consultations/useConsultationsListPage";
import { cx } from "@/lib/functions";
import type { Consultation } from "@/lib/interfaces";
import { Eye, Loader2, Sparkles } from 'lucide-react';
import { memo } from "react";

export interface ConsultationCardProps {
  consultation: Consultation;
  index: number;
  onPrefetch: (consultation: Consultation) => void;
  retour?: string;
}

function ConsultationCard({ consultation, index, onPrefetch, retour }: ConsultationCardProps) {
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

interface ConsultationsEmptyProps {
  consultationsLength: number;
}

export function ConsultationsEmpty({ consultationsLength }: ConsultationsEmptyProps) {

  return (
    <div className="theme-dark-card rounded-3xl border border-white/20 bg-white/10 p-12 text-center backdrop-blur-lg dark:bg-[color:var(--theme-layer-3)]/78"    >
      <Sparkles className="mx-auto mb-4 h-16 w-16 text-[#9BC2FF]" />
      <h3 className="text-2xl font-bold text-white mb-2">
        {consultationsLength === 0
          ? 'Aucune consultation pour le moment'
          : 'Aucun résultat trouvé'}
      </h3>

      <p className="mb-6 text-[#D1D5DB]">
        {consultationsLength === 0
          ? 'Créez votre première consultation pour commencer votre voyage de découverte.'
          : 'Essayez de modifier vos filtres de recherche'}
      </p>
    </div>
  );
}

export function ConsultationsListLoading() {

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#102044] via-[#0F1C3F] to-[#070B1A]">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
        <p className="text-lg text-[#E5E7EB]">Chargement de vos consultations...</p>
      </div>
    </div>
  );
}

const ConsultationsListMain = memo(function ConsultationsListMain() {
  const { consultations, loading, count, prefetchConsultation } = useConsultationsListPage();

  if (loading) { return (<ConsultationsListLoading />); }

  return (
    <main className="flex flex-col items-center justify-center w-full px-1 sm:px-2 py-2 sm:py-4"    >
      <section className="w-full max-w-md sm:max-w-2xl mx-auto">
        <div className={cx(
          "relative overflow-hidden rounded-2xl border ",
          "border-slate-200/80 bg-blue shadow-lg shadow-black/10 backdrop-blur-md",
          "dark:border-[color:var(--theme-border)] dark:bg-[color:var(--theme-layer-2)] dark:shadow-black/40"
        )}>
          <div className="relative z-10 flex flex-col items-center gap-2 bg-gradient-to-br from-[#163A74] via-[#2E5AA6] to-[#4F83D1] p-2 text-center sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4F83D1] to-[#9BC2FF] shadow-2xl">
                  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" /><line x1="9" x2="15" y1="9" y2="9" /><line x1="9" x2="15" y1="13" y2="13" /><line x1="9" x2="13" y1="17" y2="17" /></svg>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-1">Mes Consultations</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#4F83D1]/10 blur-2xl" />
      </section>

      <section className="w-full max-w-md sm:max-w-2xl mx-auto mt-2 flex flex-col items-center justify-center">
        {count === 0 ? (
          <div key="empty" className="w-full">
            <ConsultationsEmpty consultationsLength={count} />
          </div>
        ) : (
          <div key="list" className="w-full">
            <div className={cx("flex flex-col gap-2 sm:gap-3 w-full items-center justify-center")} >
              {consultations.map((consultation, index) => {
                return (
                  <div className="w-full" key={String(consultation?._id ?? consultation?.id ?? `${index}`)}>
                    <ConsultationCard
                      consultation={consultation}
                      index={index}
                      onPrefetch={prefetchConsultation}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
});

export default ConsultationsListMain;