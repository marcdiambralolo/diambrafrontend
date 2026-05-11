'use client';
import { Award } from 'lucide-react';
 
export default function TopBar() {
  return (
    <div className="mb-8 w-full flex justify-center">
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-br from-cosmic-purple/20 via-cosmic-indigo/20 to-cosmic-pink/10 backdrop-blur-xl shadow-2xl shadow-cosmic-indigo/10 border border-cosmic-indigo/20 px-6 py-8 flex flex-col items-center gap-5 overflow-hidden">
        {/* Glow effet */}
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-cosmic-indigo/30 blur-2xl" />

        <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-cosmic-indigo to-cosmic-purple p-4 shadow-lg animate-pulse-slow mx-auto">
          <Award className="w-8 h-8 text-white drop-shadow-lg" />
        </div>

        <div className="w-full flex flex-col items-center justify-center text-center">
          <h1 className="bg-gradient-to-r from-cosmic-indigo via-cosmic-purple to-cosmic-pink bg-clip-text text-3xl sm:text-4xl font-extrabold text-transparent drop-shadow-lg">
            Gestion des Grades Initiatiques
          </h1>
          <p className="mt-2 text-base text-white dark:text-cosmic-pink/80 font-medium">
            Configuration des grades, exigences et choix de consultations
          </p>
        </div>
      </div>
    </div>
  );
}