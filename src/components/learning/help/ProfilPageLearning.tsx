'use client';
import { cn } from "@/lib/utils";
import { ArrowLeft, Lightbulb, X, Zap } from "lucide-react";
import { FooterSection  } from "../commons/Features";
import { memo, startTransition, useCallback, useMemo, useState, useTransition } from 'react';
import { APP_NAME } from "@/lib/learning/constantes";

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

const QUICK_TIPS = [
  { icon: "⏰", title: "Prenez votre temps", description: "Mémorisez bien le plateau P1 avant de commencer", color: "amber" as const },
  { icon: "🎯", title: "Commencez facile", description: "Essayez d'abord les niveaux 2×2 ou 3×3", color: "blue" as const },
  { icon: "💪", title: "Pratiquez régulièrement", description: "L'entraînement améliore vos performances", color: "green" as const },
  { icon: "⚡", title: "Mode automatique", description: "Pour un défi chronométré plus intense", color: "purple" as const }
] as const;

const BADGE_COLORS = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  green: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
} as const;

const GRADIENT_COLORS = {
  amber: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
  blue: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
  green: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
  purple: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
} as const;

type BadgeColor = keyof typeof BADGE_COLORS;
type GradientColor = keyof typeof GRADIENT_COLORS;
type HelpSectionType = 'list' | 'text';

interface HelpSection {
  id: string;
  icon: string;
  title: string;
  type: HelpSectionType;
  badge: string | null;
  badgeColor?: BadgeColor;
  content: string | string[];
}

const getGradientByColor = (color: GradientColor): string => GRADIENT_COLORS[color] || GRADIENT_COLORS.amber;
const getBadgeColor = (color?: BadgeColor): string => color ? BADGE_COLORS[color] : BADGE_COLORS.blue;

const HelpHeader = memo(function HelpHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4 animate-in zoom-in duration-500">
        <Lightbulb className="w-10 h-10 text-white" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Guide d&apos;utilisation
      </h2>
    </div>
  );
});

const HelpHeaderGradient = memo(function HelpHeaderGradient({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative h-28 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-t-2xl overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 hover:scale-110 active:scale-95"
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
  );
});

const HelpSectionCard = memo(function HelpSectionCard({
  section,
  priority = false,
  index = 0
}: {
  section: HelpSection;
  priority?: boolean;
  index?: number;
}) {
  const isList = section.type === "list";
  const [isHovered, setIsHovered] = useState(false);

  const content = useMemo(() => {
    if (isList) {
      const items = section.content as string[];
      return (
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400 group/item">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0 group-hover/item:scale-125 transition-transform" aria-hidden="true" />
              <span className="group-hover/item:text-gray-800 dark:group-hover/item:text-gray-200 transition-colors">
                {item}
              </span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
        {section.content as string}
      </p>
    );
  }, [isList, section.content]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800/50 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700",
        "transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-blue-200 dark:hover:border-blue-800",
        priority && "ring-2 ring-blue-200 dark:ring-blue-800 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10",
        "animate-in fade-in slide-in-from-bottom duration-500"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={cn(
          "w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl",
          "flex items-center justify-center shadow-md flex-shrink-0",
          "transition-transform duration-300",
          isHovered && "scale-110 rotate-3"
        )}>
          <span className="text-xl" aria-hidden="true">{section.icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 text-base">
            {section.title}
          </h3>
          {section.badge && (
            <span className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1.5 inline-block",
              getBadgeColor(section.badgeColor)
            )}>
              {section.badge}
            </span>
          )}
        </div>
      </div>
      <div className="pl-14">
        {content}
      </div>
    </div>
  );
});

const QuickTipsCard = memo(function QuickTipsCard() {
  const tips = useMemo(() =>
    QUICK_TIPS.map((tip) => (
      <div
        key={tip.title}
        className={cn(
          "group flex items-start gap-2.5 p-2 bg-gradient-to-r rounded-lg",
          "hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-default",
          getGradientByColor(tip.color)
        )}
      >
        <span className="text-2xl flex-shrink-0 transition-transform group-hover:scale-110 duration-200" aria-hidden="true">
          {tip.icon}
        </span>
        <div>
          <h4 className="font-bold text-gray-800 dark:text-gray-200 text-xs">
            {tip.title}
          </h4>
          <p className="text-[11px] text-gray-600 dark:text-gray-400">
            {tip.description}
          </p>
        </div>
      </div>
    )),
    []
  );

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800 mt-6 animate-in fade-in slide-in-from-bottom duration-500 delay-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" aria-hidden="true" />
        </div>
        <h3 className="font-bold text-amber-800 dark:text-amber-300 text-base">
          Conseils pratiques
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {tips}
      </div>
    </div>
  );
});

const BackButton = memo(function BackButton({
  onClick,
  isPending
}: {
  onClick: () => void;
  isPending?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className={cn(
        "w-full mb-5 py-2.5 bg-gradient-to-r from-purple-50 to-purple-100",
        "dark:from-purple-900/20 dark:to-purple-800/20",
        "rounded-xl text-purple-700 dark:text-purple-400 text-sm font-semibold",
        "flex items-center justify-center gap-2",
        "focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2",
        "transition-all duration-200 hover:from-purple-100 hover:to-purple-200",
        "dark:hover:from-purple-800/30 dark:hover:to-purple-700/30",
        "hover:shadow-md active:scale-98",
        isPending && "opacity-50 cursor-not-allowed"
      )}
      type="button"
      aria-busy={isPending}
    >
      <ArrowLeft className={cn(
        "w-4 h-4 transition-all duration-200",
        !isPending && "group-hover:-translate-x-1"
      )} aria-hidden="true" />
      {isPending ? 'Chargement...' : 'Reprendre le jeu'}
    </button>
  );
});

const HelpPanel = memo(function HelpPanel({ onClose }: { onClose: () => void }) {
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
        index={index}
      />
    )),
    []
  );

  return (
    <div className="w-full max-w-md mx-auto mt-2 mb-4 animate-in slide-in-from-bottom duration-500 fade-in">
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

const HelpPage = memo(function HelpPage() {
  const handleCloseHelp = useCallback(() => {
    if (typeof window !== 'undefined') {
      startTransition(() => {
        window.history.back();
      });
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <HeaderSection />
      <HelpPanel onClose={handleCloseHelp} />
      <div className="mt-6">
        <FooterSection />
      </div>
    </div>
  );
});

export default HelpPage; 