"use client";
import { motion,Variants  } from 'framer-motion';
import { ArrowLeft, Home, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFoundPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number }>>([]);

  // Génération des étoiles
  useEffect(() => {
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
    }));
    setStars(newStars);
  }, []);

  // Suivi de la souris pour l'effet de parallaxe
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20,
    });
  };

  // Animations
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };


  const starVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: [0, 1, 0.5, 1],
      scale: [0, 1, 0.8, 1],
      transition: {
        delay: i * 0.02,
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    }),
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#070B1A] via-[#0F1C3F] to-black px-6 text-center"
      onMouseMove={handleMouseMove}
    >
      {/* Étoiles de fond */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              width: star.size,
              height: star.size,
              left: `${star.x}%`,
              top: `${star.y}%`,
            }}
            custom={star.id}
            variants={starVariants}
            initial="hidden"
            animate="visible"
          />
        ))}
      </div>

      {/* Effet de nébuleuse */}
      <motion.div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(79,131,209,0.2) 0%, transparent 70%)",
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Planète flottante */}
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] opacity-20 blur-3xl pointer-events-none"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="relative z-10 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo / Badge */}
        <motion.div variants={itemVariants} className="mb-6">
           
            <Star className="w-4 h-4 text-[#FFD600] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9BC2FF]">
              DIAMBRA
            </span>
          
        </motion.div>

        {/* Code 404 avec animation */}
        <motion.div variants={itemVariants} className="relative mb-6">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <h1 className="text-8xl font-black text-white sm:text-9xl md:text-[12rem]">
              4
              <motion.span
                animate={{
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                }}
                className="inline-block text-[#FFD600]"
              >
                0
              </motion.span>
              4
            </h1>
          </motion.div>

          {/* Effet de glitch */}
          <motion.div
            className="absolute inset-0 text-8xl font-black text-transparent sm:text-9xl md:text-[12rem]"
            style={{
              background: "linear-gradient(45deg, #FFD600, #4F83D1)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
            }}
            animate={{
              x: [-2, 2, -2, 2, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 3,
            }}
          >
            404
          </motion.div>
        </motion.div>

        {/* Message principal */}
        <motion.h2
          variants={itemVariants}
          className="mb-4 text-2xl font-bold text-[#DDE7FA] sm:text-3xl md:text-4xl"
        >
          Oups, cette page s&apos;est perdue!
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="mb-8 text-sm leading-relaxed text-[#D1D5DB] sm:text-base md:text-lg"
        >
          Le contenu demandé n&apos;est pas disponible.
          Reviens à l&apos;accueil pour reprendre ta navigation.
        </motion.p>

        {/* Boutons d'action */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-[#3567B8] hover:to-[#6A9AE1] hover:shadow-2xl sm:px-8 sm:py-4 sm:text-base"
          >
            <Home className="w-4 h-4 transition-transform group-hover:scale-110" />
            Revenir à l&apos;accueil
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-[#DDE7FA] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/30 sm:px-8 sm:py-4 sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Page précédente
          </button>
        </motion.div>
      </motion.div>

      {/* Effet de vagues cosmiques */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </div>
  );
}