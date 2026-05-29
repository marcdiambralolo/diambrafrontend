'use client';
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { memo } from "react";

export const ANIMATIONS = {
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

export const HELP_SECTIONS: HelpSection[] = [
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

export const QUICK_TIPS = [
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

export const HelpSectionCard = memo(({ section }: { section: HelpSection }) => (
    <motion.section
        variants={ANIMATIONS.section}
        aria-labelledby={`section-${section.id}`}
        className="group relative bg-white rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-indigo-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:via-indigo-50/30 group-hover:to-purple-50/50 transition-all duration-500" />

        <div className="relative z-10">
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
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight pt-1">
                        {section.title}
                    </h2>
                </div>
                {section.badge && (
                    <span className="flex-shrink-0 px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold rounded-full">
                        {section.badge}
                    </span>
                )}
            </div>

            <div className="pl-0 sm:pl-[4.5rem]">
                {section.type === "text" ? (
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {section.content}
                    </p>
                ) : (
                    <ul className="space-y-2.5" role="list">
                        {(section.content as string[]).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                                <span className="flex-shrink-0 w-1.5 h-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mt-2" />
                                <span className="flex-1 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    </motion.section>
));

HelpSectionCard.displayName = "HelpSectionCard";

export const HelpHeader = memo(() => (
    <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center mb-8 sm:mb-10"
    >
        <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl shadow-2xl mb-6"
        >
            <span className="text-4xl sm:text-5xl" role="img" aria-label="Aide">💡</span>
        </motion.div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-3">
            Guide d&apos;utilisation
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Découvrez comment jouer à DIAMBRA et devenir un expert des puzzles de mémoire
        </p>
        <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full" />
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full" />
        </div>
    </motion.header>
));

HelpHeader.displayName = "HelpHeader";

export const QuickTips = memo(() => (
    <motion.aside
        variants={ANIMATIONS.section}
        className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 shadow-lg"
        role="complementary"
        aria-label="Conseils pratiques"
    >
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-amber-200">
            <span className="text-3xl sm:text-4xl" role="img">💡</span>
            <h3 className="text-xl sm:text-2xl font-bold text-amber-900">Conseils pratiques</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_TIPS.map((tip, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                    <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                    <div>
                        <h4 className="font-bold text-amber-900 mb-1 text-sm">{tip.title}</h4>
                        <p className="text-xs text-amber-800">{tip.description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    </motion.aside>
));

QuickTips.displayName = "QuickTips";

const HelpPanel = memo(({ onClose }: { onClose: () => void }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md mx-auto mt-4"
    >
        <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
                >
                    <X className="w-5 h-5" />
                </motion.button>

                <div className="absolute bottom-4 left-5 ml-4">
                    <h2 className="text-2xl text-center font-bold text-white">Centre d'aide</h2>
                    <p className="text-sm text-center  text-white/80">Tout ce que vous devez savoir</p>
                </div>
            </div>

            <div className="p-5 overflow-y-auto custom-scrollbar">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="w-full mb-5 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl text-purple-700 font-semibold flex items-center justify-center gap-2 hover:from-purple-100 hover:to-pink-100 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Reprendre le jeu
                </motion.button>

                <HelpHeader />

                <motion.div variants={ANIMATIONS.container} className="space-y-4 mb-6">
                    {HELP_SECTIONS.map((section) => (
                        <HelpSectionCard key={section.id} section={section} />
                    ))}
                </motion.div>

                <QuickTips />
            </div>
        </div>

        <style jsx>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #a855f7, #ec4899);
        border-radius: 10px;
      }
    `}</style>
    </motion.div>
));

HelpPanel.displayName = "HelpPanel";

export default HelpPanel;