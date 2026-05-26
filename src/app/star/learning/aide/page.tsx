"use client";
import DiambraWrapper from "@/components/learning/DiambraWrapper";
import { useCommon } from "@/hooks/learning/useCommon";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo } from "react";

const ANIMATIONS = {
  container: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 },
    },
  },
  section: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  },
  icon: {
    hidden: { scale: 0, rotate: -90 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  },
  button: {
    idle: { scale: 1 },
    hover: { scale: 1.05, y: -2 },
    tap: { scale: 0.95 },
  },
} as const;

interface HelpSection {
  id: string;
  icon: string;
  title: string;
  content: string | string[];
  type: "text" | "list";
  badge?: string;
}

const HELP_SECTIONS: HelpSection[] = [
  {
    id: "objectifs",
    icon: "🎯",
    title: "Objectifs du jeu",
    type: "list",
    badge: "Essentiel",
    content: [
      "Développer votre mémoire visuelle et votre concentration",
      "Renforcer votre patience et votre sens stratégique",
      "Profiter d'un moment ludique, seul ou entre amis",
      "Vous préparer pour des compétitions et défis",
    ],
  },
  {
    id: "principe",
    icon: "📌",
    title: "Principe du jeu",
    type: "text",
    content:
      "Déplacez les éléments à l'intérieur du plateau P2 pour retrouver exactement les mêmes dispositions que sur le plateau P1. Utilisez votre mémoire visuelle et votre logique pour résoudre le puzzle le plus rapidement possible.",
  },
  {
    id: "comment-jouer",
    icon: "🎮",
    title: "Comment jouer",
    type: "list",
    badge: "Guide",
    content: [
      "Mémorisez la disposition du plateau P1 pendant quelques secondes",
      "Cliquez sur deux cases du plateau P2 pour les échanger",
      "Utilisez le bouton 'Voir P1' pour vérifier votre progression",
      "Verrouillez les cases correctement placées avec 'Ajuster'",
      "Complétez le puzzle avant la fin du temps imparti",
    ],
  },
  {
    id: "modes",
    icon: "🎨",
    title: "Modes de jeu",
    type: "list",
    badge: "Variété",
    content: [
      "Mode Nombre : Mémorisez et replacez les chiffres dans l'ordre",
      "Mode Couleur : Retrouvez la séquence de couleurs originale",
      "Mode Image : Reconstituez l'image découpée en morceaux",
      "Mode Lettre : Réorganisez les paires de lettres alphabétiques",
    ],
  },
  {
    id: "niveaux",
    icon: "📊",
    title: "Niveaux de difficulté",
    type: "text",
    content:
      "Choisissez votre niveau de 2×2 (débutant) à 10×10 (expert). Plus le niveau est élevé, plus le nombre de cases à mémoriser et à déplacer est important. Commencez petit et progressez à votre rythme !",
  },
  {
    id: "evaluation",
    icon: "⏱️",
    title: "Évaluation et classement",
    type: "text",
    content:
      "Votre performance est mesurée par le temps écoulé entre le début et la fin du match. Plus vous êtes rapide et précis, meilleur sera votre score. Comparez vos résultats et défiez vos amis pour devenir le champion !",
  },
];

const QUICK_TIPS = [
  {
    icon: "⏰",
    title: "Prenez votre temps",
    description: "Mémorisez bien le plateau P1 avant de commencer",
  },
  {
    icon: "🎯",
    title: "Commencez facile",
    description: "Essayez d'abord les niveaux 2×2 ou 3×3",
  },
  {
    icon: "💪",
    title: "Pratiquez régulièrement",
    description: "L'entraînement améliore vos performances",
  },
  {
    icon: "⚡",
    title: "Mode automatique",
    description: "Pour un défi chronométré plus intense",
  },
];

interface HelpSectionCardProps {
  section: HelpSection;
}

const HelpSectionCard = memo<HelpSectionCardProps>(({ section }) => {
  return (
    <motion.section
      variants={ANIMATIONS.section}
      aria-labelledby={`section-${section.id}`}
      className="group relative bg-white rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      {/* Effet de gradient au survol */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-indigo-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:via-indigo-50/30 group-hover:to-purple-50/50 transition-all duration-500" />

      {/* Contenu */}
      <div className="relative z-10">
        {/* En-tête avec icône et badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <motion.div
              variants={ANIMATIONS.icon}
              className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
            >
              <span className="text-2xl sm:text-3xl" role="img" aria-hidden="true">
                {section.icon}
              </span>
            </motion.div>

            <h2
              id={`section-${section.id}`}
              className="text-lg sm:text-xl font-bold text-gray-900 leading-tight pt-1"
            >
              {section.title}
            </h2>
          </div>

          {/* Badge optionnel */}
          {section.badge && (
            <span className="flex-shrink-0 px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold rounded-full">
              {section.badge}
            </span>
          )}
        </div>

        {/* Contenu de la section */}
        <div className="pl-0 sm:pl-[4.5rem]">
          {section.type === "text" ? (
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {section.content}
            </p>
          ) : (
            <ul className="space-y-2.5" role="list">
              {(section.content as string[]).map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm sm:text-base text-gray-700"
                >
                  <span
                    className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mt-2"
                    aria-hidden="true"
                  />
                  <span className="flex-1 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.section>
  );
});

HelpSectionCard.displayName = "HelpSectionCard";

const HelpHeader = memo(() => (
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="text-center mb-8 sm:mb-10"
  >
    {/* Icône principale */}
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.2,
      }}
      className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl shadow-2xl mb-6"
    >
      <span className="text-4xl sm:text-5xl" role="img" aria-label="Aide">
        💡
      </span>
    </motion.div>

    {/* Titre et description */}
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-3">
      Guide d&apos;utilisation
    </h1>

    <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
      Découvrez comment jouer à DIAMBRA et devenir un expert des puzzles de mémoire
    </p>

    {/* Séparateur décoratif */}
    <div className="flex items-center justify-center gap-2 mt-6">
      <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full" />
      <div className="w-2 h-2 bg-blue-500 rounded-full" />
      <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full" />
    </div>
  </motion.header>
));

HelpHeader.displayName = "HelpHeader";

const QuickTips = memo(() => (
  <motion.aside
    variants={ANIMATIONS.section}
    className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-1 shadow-lg"
    role="complementary"
    aria-label="Conseils pratiques"
  >
    {/* En-tête */}
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-amber-200">
      <span className="text-3xl sm:text-4xl" role="img" aria-label="Ampoule">
        💡
      </span>
      <h3 className="text-xl sm:text-2xl font-bold text-amber-900">
        Conseils pratiques
      </h3>
    </div>

    {/* Grille de conseils */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {QUICK_TIPS.map((tip, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * index }}
          className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="text-2xl flex-shrink-0" role="img">
            {tip.icon}
          </span>
          <div>
            <h4 className="font-bold text-amber-900 mb-1 text-sm sm:text-base">
              {tip.title}
            </h4>
            <p className="text-xs sm:text-sm text-amber-800">
              {tip.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.aside>
));

QuickTips.displayName = "QuickTips";

interface ActionButtonsProps {
  onBackToHome: () => void;
}

const ActionButtons = memo<ActionButtonsProps>(({ onBackToHome }) => {
  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4"
    >
      {/* Bouton retour principal */}
      <motion.button
        variants={ANIMATIONS.button}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        onClick={onBackToHome}
        className="flex-1 sm:flex-initial bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-300"
        aria-label="Retour à l'accueil"
      >
        <span className="flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="hidden sm:inline">Retour à l&apos;accueil</span>
          <span className="sm:hidden">Accueil</span>
        </span>
      </motion.button>

      {/* Bouton scroll top */}
      <motion.button
        variants={ANIMATIONS.button}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        onClick={handleScrollToTop}
        className="flex-1 sm:flex-initial bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
        aria-label="Retour en haut de page"
      >
        <span className="flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          <span className="hidden sm:inline">Haut de page</span>
          <span className="sm:hidden">Haut</span>
        </span>
      </motion.button>
    </motion.footer>
  );
});

ActionButtons.displayName = "ActionButtons";

const AidePage = () => {
  const { randomImage, onlineStatus } = useCommon();
  const router = useRouter();

  const handleBackToHome = useCallback(() => {
    router.push("/");
  }, [router]);

  const handleKeyboardNavigation = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleBackToHome();
      }
    },
    [handleBackToHome]
  );

  const sectionCards = useMemo(
    () =>
      HELP_SECTIONS.map((section) => (
        <HelpSectionCard key={section.id} section={section} />
      )),
    []
  );

  return (
    <DiambraWrapper
      titre="Guide d'utilisation"
      randomImage={randomImage}
      onlineStatus={onlineStatus}
    >
      <motion.div
        variants={ANIMATIONS.container}
        initial="hidden"
        animate="visible"
        exit="exit"
        onKeyDown={handleKeyboardNavigation}
        className="w-full max-w-5xl mx-auto"
        role="article"
        aria-label="Page d'aide DIAMBRA Learning"
        tabIndex={-1}
      >
        {/* Conteneur principal */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl shadow-2xl p-4 border border-gray-200">
          {/* En-tête */}
          <HelpHeader />

          {/* Sections d'aide */}
          <motion.div
            variants={ANIMATIONS.container}
            className="space-y-5 mb-8"
          >
            {sectionCards}
          </motion.div>

          {/* Conseils rapides */}
          <QuickTips />

          {/* Boutons d'action */}
          <ActionButtons onBackToHome={handleBackToHome} />

        </div>
      </motion.div>
    </DiambraWrapper>
  );
};

export default memo(AidePage);
