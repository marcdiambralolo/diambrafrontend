export const HELP_SECTIONS = [
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

export const QUICK_TIPS = [
    { icon: "⏰", title: "Prenez votre temps", description: "Mémorisez bien le plateau P1 avant de commencement", color: "amber" as const },
    { icon: "🎯", title: "Commencez facile", description: "Essayez d'abord les niveaux 2×2 ou 3×3", color: "blue" as const },
    { icon: "💪", title: "Pratiquez régulièrement", description: "L'entraînement améliore vos performances", color: "green" as const },
    { icon: "⚡", title: "Mode automatique", description: "Pour un défi chronométré plus intense", color: "purple" as const }
] as const;

export const GRADIENT_COLORS = {
    amber: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
    blue: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
    green: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    purple: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
} as const;

export const BADGE_COLORS = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
} as const;