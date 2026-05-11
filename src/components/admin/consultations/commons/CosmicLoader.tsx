'use client';
import { motion } from 'framer-motion';

export const CosmicLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#070B1A] via-[#0F1C3F] to-[#162A56] relative overflow-hidden">
    <div className="absolute inset-0 -z-10">
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-[#2E5AA6]/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.08, 0.15, 0.08], x: [0, -30, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-indigo-500/20 rounded-full blur-3xl"
      />
    </div>
    <motion.div initial="hidden" animate="visible" className="text-center z-10">
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6 sm:mb-8">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-0 bg-gradient-to-br from-[#2E5AA6]/30 to-[#4F83D1]/30 rounded-full blur-2xl" />
        <motion.div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-0 bg-[#2E5AA6] rounded-full blur-xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] shadow-2xl shadow-[#2E5AA6]/35 sm:h-20 sm:w-20">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m9 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
        </motion.div>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border-4 border-[#2E5AA6]/30 border-t-[#2E5AA6]" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="absolute inset-2 border-4 border-indigo-500/30 border-b-indigo-500 rounded-full" />
      </div>
      <motion.h2 className="mb-2 text-xl font-black tracking-tight sm:text-2xl" animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} style={{ backgroundImage: 'linear-gradient(90deg, #4F83D1, #9BC2FF, #DDE7FA, #4F83D1)', backgroundSize: '200% 100%', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chargement des consultations</motion.h2>
      <motion.p className="text-xs sm:text-sm text-[#DDE7FA]/75 font-medium" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>Récupération des données en cours...</motion.p>
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {[0, 1, 2, 3].map((i) => (
          <motion.div key={i} className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4F83D1]" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }} />
        ))}
      </div>
    </motion.div>
  </div>
);
