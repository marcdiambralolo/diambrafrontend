"use client";
import { cx } from "@/lib/functions";
import {
  ArrowLeft, Brain, ChevronRight, Grid, Info, MousePointerClick,
  Move, Target, Trophy as TrophyIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import CacheLink from "../commons/CacheLink";

const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white transition-all duration-300 " +
  "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg active:scale-95 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2";

function ConicPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-[28px] p-[1px] bg-gradient-to-br from-purple-100 via-white to-indigo-50 shadow-sm", className)}>
      <div className="relative overflow-hidden rounded-[28px] border border-purple-100 bg-white p-5 sm:p-7 shadow-lg">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(circle at 1px 1px, #e9d5ff 1px, transparent 0)", backgroundSize: "14px 14px" }}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

function Pill({ icon, title, desc, tooltip }: { icon: React.ReactNode; title: string; desc: string; tooltip?: string }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="group relative flex items-start gap-3 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <div className="text-[12px] font-bold text-purple-900">{title}</div>
          {tooltip && (
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-purple-400 hover:text-purple-600 transition"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="mt-1 text-[13px] leading-relaxed text-purple-700">{desc}</div>
      </div>
      {tooltip && showTooltip && (
        <div className="absolute left-0 top-full mt-2 z-10 w-48 rounded-lg bg-purple-900 px-3 py-2 text-xs text-white shadow-lg">
          {tooltip}
        </div>
      )}
    </div>
  );
}

export default function AboutPageClient() {
  useScrollReveal();

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/50 text-purple-900 overflow-x-hidden">
      <nav className="sticky top-0 z-30 border-b border-purple-100 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3">
          <CacheLink href="/star/profil" className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-800 transition">
            <ArrowLeft className="h-4 w-4" />Retour au jeu
          </CacheLink>
          <div className="hidden sm:flex items-center gap-2 text-[13px] font-bold">
            {["jeu", "regles", "stats", "pourquoi"].map((item) => (
              <a key={item} className="text-purple-500 hover:text-purple-800 transition capitalize" href={`#${item}`}>
                {item === "regles" ? "Règles" : item === "pourquoi" ? "Pourquoi jouer ?" : item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <section className="text-center reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <h1 className="text-balance text-4xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent sm:text-6xl">
            DIAMBRA WIN
          </h1>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CacheLink href="/star/profil" className={btnPrimary}>
              Jouez maintenant! <ChevronRight className="h-4 w-4" />
            </CacheLink>
          </div>
        </section>
        <section id="regles" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-black text-purple-900">📜 Règles du jeu</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-purple-600">
              4 cases, 10 chiffres, 1 combinaison gagnante
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Pill
              icon={<Grid className="h-5 w-5" />}
              title="4 cases à remplir"
              desc="Chaque partie comporte 4 cases vides à compléter."
              tooltip="Les cases sont numérotées de 1 à 4"
            />
            <Pill
              icon={<Brain className="h-5 w-5" />}
              title="Chiffres de 0 à 9"
              desc="10 chiffres disponibles, mais seulement 4 seront utilisés."
              tooltip="10 chiffres disponibles, mais seulement 4 seront utilisés."
            />
            <Pill
              icon={<TrophyIcon className="h-5 w-5" />}
              title="Pas de répétition"
              desc="Un même chiffre ne peut être utilisé qu'une seule fois."
              tooltip="10 chiffres disponibles, mais seulement 4 seront utilisés."
            />
          </div>
        </section>

        <section id="jeu" className="mt-12 sm:mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
          <ConicPanel>
            <h2 className="text-2xl font-black text-purple-900">🎯 Comment jouer ?</h2>
            <p className="mt-3 text-sm leading-relaxed text-purple-700">
              Remplissez les quatre cases avec des chiffres de 0 à 9 sans jamais les répéter.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MousePointerClick className="h-5 w-5 text-purple-600" />
                  <h3 className="font-bold text-purple-800">Mode Clic</h3>
                </div>
                <p className="text-sm text-purple-600">Sélectionnez un chiffre, puis cliquez sur une case vide pour le placer.</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Move className="h-5 w-5 text-purple-600" />
                  <h3 className="font-bold text-purple-800">Mode Glisser-Déposer</h3>
                </div>
                <p className="text-sm text-purple-600">Glissez un chiffre directement dans la case de votre choix.</p>
              </div>
            </div>
          </ConicPanel>
        </section>

        <section id="stats" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
          <ConicPanel>
            <h2 className="text-2xl font-black text-purple-900">📊 Le jeu en chiffres</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="text-center p-4 rounded-2xl bg-purple-50">
                <div className="text-4xl font-black text-purple-600">10</div>
                <div className="text-sm font-semibold text-purple-700 mt-1">chiffres disponibles</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-indigo-50">
                <div className="text-4xl font-black text-indigo-600">4</div>
                <div className="text-sm font-semibold text-indigo-700 mt-1">cases à remplir</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-purple-50">
                <div className="text-4xl font-black text-purple-600">5 040</div>
                <div className="text-sm font-semibold text-purple-700 mt-1">combinaisons possibles</div>
              </div>
            </div>
          </ConicPanel>
        </section>

        <section className="mt-12 text-center reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-400">
          <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
            <h2 className="text-2xl font-black">Prêt à jouer ?</h2>
            <CacheLink href="/star/profil" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white text-purple-700 rounded-2xl font-bold hover:shadow-lg transition-all hover:scale-105">
              Commencez la partie! <ChevronRight className="h-4 w-4" />
            </CacheLink>
          </div>
        </section>
      </div>
    </main>
  );
}