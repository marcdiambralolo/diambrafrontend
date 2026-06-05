'use client';
import { ArrowLeft, X } from "lucide-react";
import { memo, startTransition, Suspense, useCallback, useMemo, useTransition } from 'react';
import { FooterSection } from "../commons/Features";

const HELP_SECTIONS = [
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
      "Vous préparer pour des compétitions et défis"
    ]
  },
  {
    id: "principe",
    icon: "📌",
    title: "Principe du jeu",
    type: "text",
    badge: null,
    content: "Déplacez les éléments à l'intérieur du plateau P2 pour retrouver exactement les mêmes dispositions que sur le plateau P1. Utilisez votre mémoire visuelle et votre logique pour résoudre le puzzle le plus rapidement possible."
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
      "Complétez le puzzle avant la fin du temps imparti"
    ]
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
      "Mode Lettre : Réorganisez les paires de lettres alphabétiques"
    ]
  },
  {
    id: "niveaux",
    icon: "📊",
    title: "Niveaux de difficulté",
    type: "text",
    badge: null,
    content: "Choisissez votre niveau de 2×2 (débutant) à 10×10 (expert). Plus le niveau est élevé, plus le nombre de cases à mémoriser et à déplacer est important. Commencez petit et progressez à votre rythme !"
  },
  {
    id: "evaluation",
    icon: "⏱️",
    title: "Évaluation et classement",
    type: "text",
    badge: null,
    content: "Votre performance est mesurée par le temps écoulé entre le début et la fin du match. Plus vous êtes rapide et précis, meilleur sera votre score. Comparez vos résultats et défiez vos amis pour devenir le champion !"
  }
] as const;

const QUICK_TIPS = [
  { icon: "⏰", title: "Prenez votre temps", description: "Mémorisez bien le plateau P1 avant de commencer", color: "amber" },
  { icon: "🎯", title: "Commencez facile", description: "Essayez d'abord les niveaux 2×2 ou 3×3", color: "blue" },
  { icon: "💪", title: "Pratiquez régulièrement", description: "L'entraînement améliore vos performances", color: "green" },
  { icon: "⚡", title: "Mode automatique", description: "Pour un défi chronométré plus intense", color: "purple" }
] as const;

interface HelpSection {
  id: string;
  icon: string;
  title: string;
  type: 'list' | 'text';
  badge: string | null;
  content: string | string[];
}

const getGradientByColor = (color: string) => {
  const gradients = {
    amber: "from-amber-50 to-orange-50",
    blue: "from-blue-50 to-indigo-50",
    green: "from-green-50 to-emerald-50",
    purple: "from-purple-50 to-pink-50"
  };
  return gradients[color as keyof typeof gradients] || gradients.amber;
};

const HelpHeader = memo(function HelpHeader() {
  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4 animate-in zoom-in duration-500">
        <span className="text-3xl" aria-hidden="true">💡</span>
      </div>
      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Guide d&apos;utilisation
      </h2>
      <p className="text-xs text-gray-500 mt-2">Devenez un expert en DIAMBRA LEARNING</p>
    </div>
  );
});

const HelpHeaderGradient = memo(function HelpHeaderGradient({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative h-24 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-t-2xl overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 hover:scale-110"
        aria-label="Fermer"
        type="button"
      >
        <X className="w-4 h-4 text-white" aria-hidden="true" />
      </button>
      <div className="absolute bottom-3 left-4">
        <h2 className="text-lg font-bold text-white">Centre d&apos;aide</h2>
        <p className="text-xs text-white/90">Tout ce que vous devez savoir sur DIAMBRA</p>
      </div>
    </div>
  );
});

const HelpSectionCard = memo(function HelpSectionCard({
  section,
  priority = false
}: {
  section: HelpSection;
  priority?: boolean;
}) {
  const isList = section.type === "list";

  const content = useMemo(() => {
    if (isList) {
      const items = section.content as string[];
      return (
        <ul className="space-y-1.5">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-gray-600 group">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform" aria-hidden="true" />
              <span className="group-hover:text-gray-800 transition-colors">{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p className="text-xs text-gray-600 leading-relaxed hover:text-gray-800 transition-colors">
        {section.content as string}
      </p>
    );
  }, [isList, section.content]);

  return (
    <div className={`
      bg-white rounded-xl p-4 shadow-sm border border-gray-100 
      transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-blue-200
      ${priority ? 'ring-1 ring-blue-200 bg-gradient-to-br from-white to-blue-50/30' : ''}
    `}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
          <span className="text-xl" aria-hidden="true">{section.icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{section.title}</h3>
          {section.badge && (
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1 inline-block">
              {section.badge}
            </span>
          )}
        </div>
      </div>
      <div className="pl-13">
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
        className={`group flex items-start gap-2 p-2 bg-gradient-to-r ${getGradientByColor(tip.color)} rounded-lg hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-default`}
      >
        <span className="text-xl flex-shrink-0 transition-transform group-hover:scale-110 duration-200" aria-hidden="true">{tip.icon}</span>
        <div>
          <h4 className="font-bold text-gray-800 text-xs">{tip.title}</h4>
          <p className="text-[11px] text-gray-600">{tip.description}</p>
        </div>
      </div>
    )),
    []
  );

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl animate-bounce" aria-hidden="true">💡</span>
        <h3 className="font-bold text-amber-800">Conseils pratiques</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {tips}
      </div>
    </div>
  );
});

const BackButton = memo(function BackButton({ onClick, isPending }: { onClick: () => void; isPending?: boolean; }) {
  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className={`
        w-full mb-4 py-2.5 bg-gradient-to-r from-purple-50 to-purple-100 
        rounded-xl text-purple-700 text-sm font-semibold 
        flex items-center justify-center gap-2 
        focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2
        transition-all duration-200 hover:from-purple-100 hover:to-purple-200
        hover:shadow-md active:scale-98
        ${isPending ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      type="button"
      aria-busy={isPending}
    >
      <ArrowLeft className={`w-4 h-4 transition-transform duration-200 ${!isPending && 'group-hover:-translate-x-1'}`} aria-hidden="true" />
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
      />
    )),
    []
  );

  return (
    <div className="w-full max-w-md mx-auto mt-2 mb-4 animate-in slide-in-from-bottom duration-500 fade-in">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <HelpHeaderGradient onClose={handleClose} />

        <div className="p-4 overflow-y-auto">
          <BackButton onClick={handleClose} isPending={isPending} />

          <HelpHeader />

          <div className="space-y-3">
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
          </div>
        }>
          <HelpPanel onClose={handleCloseHelp} />
        </Suspense>

        <FooterSection />
      </div>
    </div>
  );
});

export default HelpPage;