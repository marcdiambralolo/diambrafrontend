"use client";
import Loader from '@/app/loading';
import { ArrowRight, Brain, Target } from 'lucide-react';
import { memo, Suspense } from 'react';
import CacheLink from '../commons/CacheLink';

export default function WelcomePageClient() {

  return (
    <Suspense fallback={<Loader />}>
      <WelcomePageClientContent />
    </Suspense>
  );
}

export function WelcomePageClientContent() {

  return (
    <main className="relative flex min-h-screen flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/50 px-4 py-12 sm:py-16">

      <div className="relative mx-auto w-full max-w-3xl animate-fade-in-up">
        <article className="group relative rounded-[2rem] border border-purple-100 bg-white/95 p-8 shadow-[0_20px_60px_-15px_rgba(139,92,246,0.15),0_4px_20px_-5px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_30px_80px_-15px_rgba(139,92,246,0.25)] sm:p-12">
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-transparent via-purple-50/50 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none" />
          <div className="absolute -top-3 -right-3 h-16 w-16 overflow-hidden">
            <div className="absolute -right-8 -top-8 h-16 w-24 rotate-45 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg" />
          </div>

          <div className="relative text-center">
            <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.25em] text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text">
              <Target className="h-4 w-4 text-purple-500" />
              NOUVEAU
              <Brain className="h-4 w-4 text-indigo-500" />
            </p>

            <div className="mt-4 flex justify-center gap-2">
              <h1 className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl lg:text-8xl">
                DIAMBRA WIN
              </h1>
            </div>

            <div className="mt-6 mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400" />
            <div className="mt-10 flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="font-black text-2xl text-purple-600">10</div>
                <div className="text-gray-500 text-xs">combinaisons</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <div className="font-black text-2xl text-indigo-600">5040</div>
                <div className="text-gray-500 text-xs">possibilités</div>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center gap-4">
              <CacheLink
                href="/star/profil"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 px-12 py-5 text-xl font-bold text-white shadow-2xl shadow-purple-200 transition-all duration-300 hover:scale-105 hover:shadow-purple-300 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3">
                  🎮 Demarrer
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </CacheLink>
            </div>
          </div>
        </article>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: translateY(-30px) translateX(15px) rotate(180deg);
            opacity: 1;
          }
        }
        
        @keyframes bounce-gentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-700 {
          animation-delay: 0.7s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </main>
  );
}