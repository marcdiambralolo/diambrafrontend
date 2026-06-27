'use client';
import { APP_NAME } from "@/lib/learning/constantes";
import { cn } from "@/lib/utils";
import { ArrowLeft, Lightbulb, X } from "lucide-react";
import { memo, useCallback, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { FooterSection } from "../commons/Features";
import { HelpSectionCard, type HelpSection } from './HelpSectionCard';
import { QuickTipsCard } from './QuickTipsCard';

const HELP_SECTIONS = [
  {
    id: "objectifs",
    icon: "🎯",
    title: "Objectifs du jeu",
    type: "list" as const,
    badge: "Essentiel",
    badgeColor: "blue" as const,
    content: [
      "Développer votre mémoire visuelle et votre concentration",
      "Renforcer votre patience et votre sens stratégique",
      "Profiter d'un moment ludique, seul ou entre amis",
      "Vous préparer pour des compétitions et défis"
    ]
  },
  {
    id: "principe",
    icon: "📌",
    title: "Principe du jeu",
    type: "text" as const,
    badge: null,
    content: "Déplacez les éléments à l'intérieur du plateau P2 pour retrouver exactement les mêmes dispositions que sur le plateau P1. Utilisez votre mémoire visuelle et votre logique pour résoudre le puzzle le plus rapidement possible."
  },
  {
    id: "comment-jouer",
    icon: "🎮",
    title: "Comment jouer",
    type: "list" as const,
    badge: "Guide",
    badgeColor: "purple" as const,
    content: [
      "Mémorisez la disposition du plateau P1 pendant quelques secondes",
      "Cliquez sur deux cases du plateau P2 pour les échanger",
      "Utilisez le bouton 'Voir P1' pour vérifier votre progression",
      "Verrouillez les cases correctement placées avec 'Ajuster'",
      "Complétez le puzzle avant la fin du temps imparti"
    ]
  },
  {
    id: "modes",
    icon: "🎨",
    title: "Modes de jeu",
    type: "list" as const,
    badge: "Variété",
    badgeColor: "green" as const,
    content: [
      "Mode Nombre : Mémorisez et replacez les chiffres dans l'ordre",
      "Mode Couleur : Retrouvez la séquence de couleurs originale",
      "Mode Image : Reconstituez l'image découpée en morceaux",
      "Mode Lettre : Réorganisez les paires de lettres alphabétiques"
    ]
  },
  {
    id: "niveaux",
    icon: "📊",
    title: "Niveaux de difficulté",
    type: "text" as const,
    badge: null,
    content: "Choisissez votre niveau de 2×2 (débutant) à 10×10 (expert). Plus le niveau est élevé, plus le nombre de cases à mémoriser et à déplacer est important. Commencez petit et progressez à votre rythme !"
  },
  {
    id: "evaluation",
    icon: "⏱️",
    title: "Évaluation et classement",
    type: "text" as const,
    badge: null,
    content: "Votre performance est mesurée par le temps écoulé entre le début et la fin du match. Plus vous êtes rapide et précis, meilleur sera votre score. Comparez vos résultats et défiez vos amis pour devenir le champion !"
  }
] as const;

const HeaderSection = memo(() => (
  <div className="flex flex-col items-center justify-center mt-2 mb-2">
    <h1 className="text-xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
      {APP_NAME}
    </h1>
    <div className="flex items-center justify-center gap-2 mt-2">
      <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
      <div className="w-8 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
    </div>
  </div>
));

const HelpHeader = memo(() => (
  <div className="text-center mb-8">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
      <Lightbulb className="w-10 h-10 text-white" aria-hidden="true" />
    </div>
    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Guide d&apos;utilisation
    </h2>
  </div>
));

const HelpHeaderGradient = memo(({ onClose }: { onClose: () => void }) => (
  <div className="relative h-28 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-t-2xl overflow-hidden">
    <div className="absolute inset-0 bg-black/10" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    <button
      onClick={onClose}
      className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
      aria-label="Fermer"
      type="button"
    >
      <X className="w-4 h-4 text-white" aria-hidden="true" />
    </button>
    <div className="absolute bottom-4 left-5">
      <h2 className="text-xl font-bold text-white">Centre d&apos;aide</h2>
      <p className="text-xs text-white/90">Tout ce que vous devez savoir sur DIAMBRA LEARNING</p>
    </div>
  </div>
));

const BackButton = memo(({ onClick, isPending }: { onClick: () => void; isPending?: boolean }) => (
  <button
    onClick={onClick}
    disabled={isPending}
    className={cn(
      "w-full mb-5 py-2.5 bg-gradient-to-r from-purple-50 to-purple-100",
      "dark:from-purple-900/20 dark:to-purple-800/20",
      "rounded-xl text-purple-700 dark:text-purple-400 text-sm font-semibold",
      "flex items-center justify-center gap-2",
      "focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2",
      "hover:from-purple-100 hover:to-purple-200",
      "dark:hover:from-purple-800/30 dark:hover:to-purple-700/30",
      "hover:shadow-md",
      isPending && "opacity-50 cursor-not-allowed"
    )}
    type="button"
    aria-busy={isPending}
  >
    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
    {isPending ? 'Chargement...' : 'Reprendre le jeu'}
  </button>
));

const HelpPanel = memo(({ onClose }: { onClose: () => void }) => {
  const [isPending, startTransition] = useTransition();

  const handleClose = useCallback(() => {
    startTransition(() => {
      onClose();
    });
  }, [onClose]);

  const sections = useMemo(() =>
    HELP_SECTIONS.map((section, index) => (
      <HelpSectionCard
        key={section.id}
        section={section as HelpSection}
        priority={index < 3}
      />
    )),
    []
  );

  return (
    <div className="w-full max-w-md mx-auto mt-2 mb-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <HelpHeaderGradient onClose={handleClose} />

        <div className="p-4 overflow-y-auto">
          <BackButton onClick={handleClose} isPending={isPending} />
          <HelpHeader />

          <div className="space-y-4">
            {sections}
          </div>
          <QuickTipsCard />
        </div>
      </div>
    </div>
  );
});

const HelpPage = () => {
  const router = useRouter();

  const handleCloseHelp = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="container mx-auto px-4 max-w-md">
      <HeaderSection />
      <HelpPanel onClose={handleCloseHelp} />
      <div className="mt-6">
        <FooterSection />
      </div>
    </div>
  );
};

export default memo(HelpPage);