'use client';
import { memo, useState, useEffect, useCallback, useMemo } from "react";
import { X, ArrowLeft } from "lucide-react";

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
        <p className="text-xs text-gray-500 mt-1">Devenez un expert des puzzles de mémoire</p>
    </div>
));

const HelpSectionCard = memo(({ section }: { section: HelpSection }) => {
    const isList = section.type === "list";
    const contentList = isList ? section.content as string[] : [];
    const contentText = !isList ? section.content as string : '';

    return (
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-purple-200">
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
                        {contentList.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                                <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" aria-hidden="true" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-xs text-gray-600 leading-relaxed">{contentText}</p>
                )}
            </div>
        </div>
    );
});

const QuickTipsCard = memo(() => (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-200">
        <div className="flex items-center gap-2 mb-2">
            <span className="text-xl" aria-hidden="true">💡</span>
            <h3 className="font-bold text-amber-800 text-sm">Conseils pratiques</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
            {QUICK_TIPS.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-white rounded-lg">
                    <span className="text-base flex-shrink-0" aria-hidden="true">{tip.icon}</span>
                    <div>
                        <h4 className="font-bold text-amber-800 text-[11px]">{tip.title}</h4>
                        <p className="text-[10px] text-amber-700">{tip.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
));

const CloseButton = memo(({ onClick }: { onClick: () => void }) => (
    <button
        onClick={onClick}
        className="absolute top-2 right-2 w-7 h-7 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Fermer"
        type="button"
    >
        <X className="w-3.5 h-3.5 text-white" aria-hidden="true" />
    </button>
));

const BackButton = memo(({ onClick }: { onClick: () => void }) => (
    <button
        onClick={onClick}
        className="w-full mb-3 py-2 bg-purple-50 rounded-xl text-purple-700 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-purple-100 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
        type="button"
    >
        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
        Reprendre le jeu
    </button>
));

const HelpHeaderGradient = memo(() => (
    <div className="relative h-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
        <div className="absolute bottom-2 left-4">
            <h2 className="text-base font-bold text-white">Centre d'aide</h2>
            <p className="text-[10px] text-white/80">Tout ce que vous devez savoir</p>
        </div>
    </div>
));

const HelpPanel = memo(({ onClose }: { onClose: () => void }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    const sectionsList = useMemo(() =>
        HELP_SECTIONS.map((section) => (
            <HelpSectionCard key={section.id} section={section as HelpSection} />
        )),
        []
    );

    return (
        <div className={`w-full max-w-md mx-auto mt-2 mb-4 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <HelpHeaderGradient />
                <CloseButton onClick={handleClose} />

                <div className="p-2 overflow-y-auto">
                    <BackButton onClick={handleClose} />
                    <HelpHeader />

                    <div className="space-y-2 mb-4">
                        {sectionsList}
                    </div>

                    <QuickTipsCard />
                </div>
            </div>
        </div>
    );
});

export default HelpPanel;