"use client";
import Loader from '@/app/loading';
import { useAuthStore } from '@/lib/store/auth.store';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Eye, Moon, Sparkles, Star, Sun } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { memo, Suspense, useCallback, useEffect, useState } from 'react';
import CacheLink from '../commons/CacheLink';

const LoadingFallback = memo(() => (
  <div className="w-full text-center py-10 text-lg text-[#4F83D1] animate-pulse">
    <Loader />
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';
const QUESTIONS = [
  { q: "QUI SUIS-JE ?", icon: Eye },
  { q: "D'OÙ VIENS-JE ?", icon: Compass },
  { q: "OÙ VAIS-JE ?", icon: Star }
];

function WelcomePageClientContent() {
  const getSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  };

  const [isDark, setIsDark] = useState(getSystemTheme);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), []);

  return (
    <main
      className={
        `flex min-h-screen items-center justify-center py-8 transition-colors ` +
        (isDark
          ? 'bg-gradient-to-b from-[#0F1C3F] via-[#162A56] to-[#2E5AA6] text-white'
          : 'bg-white text-[#162A56]')
      }
      aria-label="Page d'accueil Mon Étoile"
    >
      <button
        onClick={toggleTheme}
        className="fixed right-4 top-4 z-50 rounded-full border border-blue-300 bg-[#162A56] p-2 text-blue-200 shadow-lg hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-accent-gold/40 transition-transform animate-glow"
        aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
        type="button"
      >
        {isDark ? <Sun className="w-6 h-6 text-blue-200" /> : <Moon className="w-6 h-6 text-blue-400" />}
      </button>

      <section className="w-full max-w-2xl mx-auto px-4" aria-labelledby="main-title">
        <motion.div
          className="text-center mb-8 relative"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: 'spring', stiffness: 60 }}
        >
          <div className="flex justify-center items-center">
            <motion.div
              className="rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center w-[90px] h-[90px] mx-auto mb-2"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.2, type: 'spring', stiffness: 80 }}
            >
              <Image
                src="/logo.png"
                alt="Mon Étoile"
                width={72}
                height={72}
                className="object-contain"
                priority
                aria-label="Mon Étoile"
              />
            </motion.div>
          </div>

          <motion.h1
            id="main-title"
            className={
              'text-3xl sm:text-5xl font-bold tracking-tight mt-2 drop-shadow-sm ' +
              (isDark ? 'text-blue-100' : 'text-[#162A56]')
            }
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, type: 'spring', stiffness: 60 }}
          >
            MON ÉTOILE
          </motion.h1>
        </motion.div>

        <p className="mb-6 px-2 text-center text-base leading-relaxed sm:text-lg font-normal text-light-text dark:text-dark-text">
          Bienvenue dans ce temple, où chacun vient chercher une réponse aux trois grandes questions de l'existence&nbsp;:
        </p>

        <nav aria-label="Questions existentielles" className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          {QUESTIONS.map((item, idx) => (
            <CacheLink key={item.q + idx} href="/star/profil" className="w-full sm:w-auto" aria-label={item.q} tabIndex={0}>
              <div
                className={
                  `rounded-xl px-6 py-4 shadow-md flex items-center justify-center gap-3 cursor-pointer group border transition-all ` +
                  (isDark
                    ? 'bg-white/10 border-blue-400 hover:bg-[#2E5AA6]/90 focus:ring-2 focus:ring-accent-gold/60'
                    : 'bg-blue-100 border-blue-400 hover:bg-blue-200 hover:shadow-xl focus:ring-2 focus:ring-accent-gold/60')
                }
                style={{ minWidth: 170 }}
                role="link"
                tabIndex={0}
              >
                <div className={
                  'flex items-center justify-center rounded-full p-2 shadow-inner transition ' +
                  (isDark
                    ? 'bg-blue-900/30 group-hover:bg-blue-800/40'
                    : 'bg-white group-hover:bg-blue-100')
                }>
                  <item.icon className={
                    'w-6 h-6 transition ' +
                    (isDark ? 'text-blue-300 group-hover:text-blue-100' : 'text-[#162A56] group-hover:text-blue-700')
                  } />
                </div>
                <span className={
                  'font-semibold text-base tracking-wide transition ' +
                  (isDark ? 'text-blue-100 group-hover:text-white' : 'text-[#162A56] group-hover:text-blue-700 drop-shadow')
                }>
                  {item.q}
                </span>
              </div>
            </CacheLink>
          ))}
        </nav>

        <section
          className={
            'relative overflow-hidden rounded-2xl border p-6 shadow-xl backdrop-blur-xl ' +
            (isDark ? 'border-blue-700 bg-[#0F1C3F]/80' : 'border-blue-300 bg-blue-100')
          }
          aria-label="Présentation Mon Étoile"
        >
          <div className="absolute top-2 right-2 animate-float opacity-60 pointer-events-none">
            <Sparkles className={isDark ? 'h-7 w-7 text-blue-300' : 'h-7 w-7 text-blue-400'} />
          </div>

          <div className="absolute bottom-2 left-2 animate-float opacity-60 pointer-events-none">
            <Star className={isDark ? 'h-8 w-8 text-blue-700' : 'h-8 w-8 text-blue-400'} />
          </div>

          <div className="relative z-10 text-center space-y-4">
            <p className={
              'text-base leading-relaxed font-normal ' +
              (isDark ? 'text-blue-100/90' : 'text-[#162A56]')
            }>
              Basée sur les connaissances initiatiques africaines et éclairée par la lecture des astres,
              notre guidance vous aide à mieux vous connaître, comprendre votre mission de vie, révéler
              vos talents, harmoniser vos relations, et avancer avec clarté sur votre chemin spirituel.
            </p>

            <p className={
              'text-base leading-relaxed font-normal ' +
              (isDark ? 'text-blue-100/90' : 'text-[#162A56]')
            }>
              Parce qu'il existe un plan cosmique qui organise votre vie, votre thème astral devient ici
              une boussole sacrée, une mémoire profonde et une lumière qui vous éclaire, inspire vos choix
              et guide vos décisions.
            </p>
            <p className={
              'pt-1 text-lg font-bold leading-tight sm:text-xl ' +
              (isDark ? 'text-blue-200' : 'text-blue-700 drop-shadow')
            }>
              Votre naissance a un but.<br />Découvrez ce que votre âme est venue accomplir.
            </p>

            <CacheLink href="/star/profil" className="block" aria-label="Demander une consultation">
              <button
                className={
                  'mt-4 flex w-full items-center justify-center gap-3 rounded-xl border px-8 py-3 text-lg font-bold shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent-gold/40 ' +
                  (isDark
                    ? 'border-blue-400 bg-blue-700/80 text-blue-100 hover:bg-blue-800 hover:text-white hover:border-blue-300 hover:shadow-lg'
                    : 'border-blue-400 bg-blue-700/80 text-white hover:bg-blue-300 hover:text-blue-900 hover:border-blue-500 hover:shadow-xl')
                }
                aria-label="Demander une consultation"
              >
                <Compass className={isDark ? 'w-6 h-6' : 'w-6 h-6 text-white'} />
                <span>DEMANDER UNE CONSULTATION</span>
                <ArrowRight className={isDark ? 'w-6 h-6' : 'w-6 h-6 text-white'} />
              </button>
            </CacheLink>

          </div>
        </section>
      </section>
    </main>
  );
}

export default function WelcomePageClient() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      router.replace('/star/profil');
    }
  }, [user, router]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <WelcomePageClientContent />
    </Suspense>
  );
}