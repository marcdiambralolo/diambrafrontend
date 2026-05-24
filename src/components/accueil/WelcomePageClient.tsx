"use client";
import Loader from '@/app/loading';
import { useAuth } from '@/lib/hooks';
import {
  ArrowRight, Brain, ChevronRight, Gamepad2, Grid, Info, MousePointerClick, Move,
  Rocket, TrophyIcon, Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import CacheLink from '../commons/CacheLink';

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

function Pill({ icon, title, desc, tooltip, delay = 0 }: { icon: React.ReactNode; title: string; desc: string; tooltip?: string; delay?: number }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="group relative flex items-start gap-3 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      style={{ transitionDelay: `${delay}ms` }}
    >
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

export default function WelcomePageClient() {
  return (
    <Suspense fallback={<Loader />}>
      <WelcomePageClientContent />
    </Suspense>
  );
}

export function WelcomePageClientContent() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useScrollReveal();

  useEffect(() => {
    if (!isLoading && user) {
      setIsRedirecting(true);
      router.replace('/star/profil');
    }
  }, [user, isLoading, router]);

  if (isLoading || isRedirecting) {
    return (
      <Loader />
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/50 overflow-x-hidden">

      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <section className="text-center reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
            DIAMBRA WIN
          </h1>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CacheLink href="/star/profil" className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all">
              <span className="relative z-10 flex items-center gap-2">
                🎮 Jouez maintenant!
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </CacheLink>
          </div>
        </section>

        <section id="regles" className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-800">📜 Règles du jeu</h2>
            <p className="text-gray-500 mt-2">4 cases, 10 chiffres, 1 combinaison gagnante</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Pill icon={<Grid className="h-5 w-5" />} title="4 cases à remplir" desc="Chaque partie comporte 4 cases vides." tooltip="Les cases sont numérotées de 1 à 4" delay={0} />
            <Pill icon={<Brain className="h-5 w-5" />} title="Chiffres 0 à 9" desc="10 chiffres disponibles, 4 utilisés." tooltip="Utilisez votre logique" delay={50} />
            <Pill icon={<TrophyIcon className="h-5 w-5" />} title="Pas de répétition" desc="Un chiffre = une seule utilisation." tooltip="Chaque chiffre est unique" delay={100} />
          </div>
        </section>

        <section id="jeu" className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-800">🎯 Comment jouer ?</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-1">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 p-6 hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center mb-4 shadow-lg">
                  <MousePointerClick className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-2">Mode Clic</h3>
                <p className="text-purple-600">Sélectionnez un chiffre, puis cliquez sur une case vide pour le placer.</p>
                <div className="mt-4 flex items-center gap-1 text-sm text-purple-500">
                  <Zap className="w-4 h-4" />
                  <span>Simple et intuitif</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="stats" className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-800">📊 Le jeu en chiffres</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:scale-105 transition-transform">
              <div className="text-5xl font-black text-purple-600">10</div>
              <div className="font-semibold text-purple-700 mt-2">chiffres disponibles</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 hover:scale-105 transition-transform">
              <div className="text-5xl font-black text-indigo-600">4</div>
              <div className="font-semibold text-indigo-700 mt-2">cases à remplir</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-100 hover:scale-105 transition-transform">
              <div className="text-5xl font-black text-purple-600">5 040</div>
              <div className="font-semibold text-purple-700 mt-2">combinaisons possibles</div>
            </div>
          </div>
        </section>

        <section className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-500">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 p-10 text-center shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg...%3E')] opacity-10" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/20 rounded-full blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 mb-4">
                <Rocket className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white uppercase">Prêt à jouer ?</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-6">Commencez maintenant !</h2>
              <CacheLink href="/star/profil" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-700 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
                <Gamepad2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Jouer
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </CacheLink>
            </div>
          </div>
        </section>

        <div className="mt-12 text-center">
          <p className="text-xs text-gray-400">© 2026 Diambra - Tous droits réservés.</p>
        </div>
      </div>
    </main>
  );
}