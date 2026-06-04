'use client';
import { ArrowLeft } from "lucide-react";
import { memo, useCallback, useDeferredValue, useMemo, useTransition } from 'react';
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
  { icon: "⏰", title: "Prenez votre temps", description: "Mémorisez bien le plateau P1 avant de commencer" },
  { icon: "🎯", title: "Commencez facile", description: "Essayez d'abord les niveaux 2×2 ou 3×3" },
  { icon: "💪", title: "Pratiquez régulièrement", description: "L'entraînement améliore vos performances" },
  { icon: "⚡", title: "Mode automatique", description: "Pour un défi chronométré plus intense" }
] as const;

interface HelpSection {
  id: string;
  icon: string;
  title: string;
  type: 'list' | 'text';
  badge: string | null;
  content: string | string[];
}

const HelpHeader = memo(() => (
  <div className="text-center mb-5">
    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-3">
      <span className="text-3xl" aria-hidden="true">💡</span>
    </div>
    <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Guide d'utilisation
    </h2>
    <p className="text-xs text-gray-500 mt-1">Devenez un expert en DIAMBRA</p>
  </div>
));

const HelpSectionCard = memo(({ section, isPriority = false }: { section: HelpSection; isPriority?: boolean }) => {
  const isList = section.type === "list";
  const contentList = isList ? section.content as string[] : [];
  const contentText = !isList ? section.content as string : '';

  const listItems = useMemo(() =>
    contentList.map((item, idx) => (
      <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
        <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" aria-hidden="true" />
        <span>{item}</span>
      </li>
    )),
    [contentList]
  );

  return (
    <div className={`bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 ${!isPriority ? 'opacity-90' : ''}`}>
      <div className="flex items-start gap-3 mb-2">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-lg" aria-hidden="true">{section.icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 text-sm">{section.title}</h3>
          {section.badge && (
            <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1 inline-block">
              {section.badge}
            </span>
          )}
        </div>
      </div>
      <div className="pl-12">
        {isList ? (
          <ul className="space-y-1">
            {listItems}
          </ul>
        ) : (
          <p className="text-xs text-gray-600 leading-relaxed">{contentText}</p>
        )}
      </div>
    </div>
  );
});

const HelpSectionsList = memo(({ sections, priorityIndices = [0, 1] }: { sections: readonly HelpSection[]; priorityIndices?: number[] }) => {
  const deferredSections = useDeferredValue(sections);

  const renderedSections = useMemo(() =>
    deferredSections.map((section, index) => (
      <HelpSectionCard
        key={section.id}
        section={section as HelpSection}
        isPriority={priorityIndices.includes(index)}
      />
    )),
    [deferredSections, priorityIndices]
  );

  return (
    <div className="space-y-2 mb-4">
      {renderedSections}
    </div>
  );
});

const QuickTipsCard = memo(() => {
  const tipsList = useMemo(() =>
    QUICK_TIPS.map((tip, idx) => (
      <div key={idx} className="flex items-start gap-2 p-2 bg-white rounded-lg hover:bg-amber-50 transition-colors duration-150">
        <span className="text-base flex-shrink-0" aria-hidden="true">{tip.icon}</span>
        <div>
          <h4 className="font-bold text-amber-800 text-[11px]">{tip.title}</h4>
          <p className="text-[10px] text-amber-700">{tip.description}</p>
        </div>
      </div>
    )),
    []
  );

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-200">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl" aria-hidden="true">💡</span>
        <h3 className="font-bold text-amber-800 text-sm">Conseils pratiques</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {tipsList}
      </div>
    </div>
  );
});

const BackButton = memo(({ onClick, isPending }: { onClick: () => void; isPending?: boolean }) => (
  <button
    onClick={onClick}
    disabled={isPending}
    className={`w-full mb-3 py-2 bg-purple-50 rounded-xl text-purple-700 text-sm font-semibold flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200 hover:bg-purple-100 ${isPending ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    type="button"
    aria-busy={isPending}
  >
    <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
    {isPending ? 'Chargement...' : 'Reprendre le jeu'}
  </button>
));

const HelpHeaderGradient = memo(() => (
  <div className="relative h-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-t-2xl">
    <button
      onClick={() => window.history.back()}
      className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
      aria-label="Fermer"
      type="button"
    >
      ✕
    </button>
    <div className="absolute bottom-2 left-4">
      <h2 className="text-base font-bold text-white">Centre d'aide</h2>
      <p className="text-[10px] text-white/80">Tout ce que vous devez savoir sur DIAMBRA</p>
    </div>
  </div>
));

const HelpPanel = memo(({ onClose }: { onClose: () => void }) => {
  const [isPending, startTransition] = useTransition();

  const handleClose = useCallback(() => {
    startTransition(() => {
      onClose();
    });
  }, [onClose]);

  const content = useMemo(() => (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <HelpHeaderGradient />
      <div className="p-3 overflow-y-auto ">
        <BackButton onClick={handleClose} isPending={isPending} />

        <HelpHeader />
        <HelpSectionsList sections={HELP_SECTIONS as readonly HelpSection[]} priorityIndices={[0, 1, 2]} />
        <QuickTipsCard />
      </div>
    </div>
  ), [handleClose, isPending]);

  return (
    <div className="w-full max-w-md mx-auto mt-2 mb-4 animate-in slide-in-from-bottom duration-300">
      {content}
    </div>
  );
});

const HelpPage = () => {
  const handleCloseHelp = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }, []);

  return (
    <div className="w-full mx-auto max-w-md pb-8 mt-8  bg-gray-50">
      <HelpPanel onClose={handleCloseHelp} />

      <FooterSection />
    </div>
  );
};

export default memo(HelpPage);