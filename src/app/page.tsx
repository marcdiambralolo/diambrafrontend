"use client";

import Link from "next/link";
import { Sparkles, Zap, Brain, Target, ArrowRight } from "lucide-react";

const PARTICLE_COUNT = 20;

/** Positions et timings déterministes (évite Math.random au rendu — règle de pureté React). */
function particleMotion(i: number) {
  const top = (i * 47 + 13) % 100;
  const left = (i * 71 + 29) % 100;
  const delay = ((i * 19) % 50) / 10;
  const duration = 3 + ((i * 17) % 40) / 10;
  return {
    top: `${top}%`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  } as const;
}

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950/30 to-indigo-950 px-4 py-12 sm:py-16">
      {/* Effet de fond animé */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl animate-pulse delay-700" />
      </div>

      {/* Particules flottantes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
          <div
            key={i}
            className="animate-float absolute h-1 w-1 rounded-full bg-white/20"
            style={particleMotion(i)}
          />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-2xl animate-fade-in-up">
        {/* Badge décoratif */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Défi cérébral</span>
            <Zap className="h-3.5 w-3.5" />
          </div>
        </div>

        <article className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 shadow-[0_8px_32px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 sm:p-12">
          {/* Effet de brillance au hover */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

          <div className="relative text-center">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text">
              <Target className="h-3 w-3 text-purple-400" />
              PRÉSENTATION
              <Brain className="h-3 w-3 text-indigo-400" />
            </p>

            <h1 className="mt-4 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
              Quatre cases
            </h1>

            <div className="mt-6 mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />

            <p className="mx-auto mt-6 max-w-md text-pretty text-center text-lg leading-relaxed text-white/80">
              Un mini-jeu de logique : remplissez quatre cases avec des chiffres de{" "}
              <span className="font-bold text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text">
                0 à 9
              </span>
              , sans en répéter aucun. Simple, rapide, idéal pour une pause cérébrale.
            </p>

            {/* Cartes des règles animées */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: "🎯",
                  title: "Placement",
                  text: "Sélectionnez un chiffre dans la grille, puis touchez une case vide",
                  color: "from-purple-500/20 to-purple-600/20",
                },
                {
                  icon: "🔄",
                  title: "Unicité",
                  text: "Chaque chiffre ne peut être utilisé qu'une seule fois par partie",
                  color: "from-indigo-500/20 to-indigo-600/20",
                },
                {
                  icon: "🗑️",
                  title: "Modification",
                  text: "Touchez une case remplie pour la vider et changer votre combinaison",
                  color: "from-cyan-500/20 to-cyan-600/20",
                },
              ].map((rule, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl bg-gradient-to-br ${rule.color} p-4 text-left backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                >
                  <div className="mb-2 text-2xl">{rule.icon}</div>
                  <h3 className="mb-1 font-semibold text-white">{rule.title}</h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {rule.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Section action avec effet 3D */}
            <div className="mt-12 flex flex-col items-center gap-4">
              <Link
                href="/game"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 px-10 py-4 text-lg font-bold text-white shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Commencer la partie
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>

              <div className="flex items-center gap-2 text-sm text-white/50">
                <Sparkles className="h-3 w-3" />
                <span>Page dédiée • Interface intuitive</span>
                <Sparkles className="h-3 w-3" />
              </div>
            </div>
          </div>
        </article>

        {/* Pied de page décoratif */}
        <div className="mt-8 text-center text-xs text-white/30">
          <p>Préparez-vous à relever le défi ✨</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 1;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </main>
  );
}