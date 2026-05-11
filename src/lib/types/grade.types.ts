/**
 * Système de grades initiatiques
 * 9 degrés d'évolution spirituelle basés sur l'activité de l'utilisateur
 * Compatible avec le backend NestJS
 */

export enum Grade {
  NEOPHYTE = 'NEOPHYTE',
  ASPIRANT = 'ASPIRANT',
  CONTEMPLATEUR = 'CONTEMPLATEUR',
  CONSCIENT = 'CONSCIENT',
  INTEGRATEUR = 'INTEGRATEUR',
  TRANSMUTANT = 'TRANSMUTANT',
  ALIGNE = 'ALIGNE',
  EVEILLE = 'EVEILLE',
  SAGE = 'SAGE',
  MAITRE_DE_SOI = 'MAITRE_DE_SOI',
}

export const GRADE_ORDER = [
  Grade.NEOPHYTE,
  Grade.ASPIRANT,
  Grade.CONTEMPLATEUR,
  Grade.CONSCIENT,
  Grade.INTEGRATEUR,
  Grade.TRANSMUTANT,
  Grade.ALIGNE,
  Grade.EVEILLE,
  Grade.SAGE,
  Grade.MAITRE_DE_SOI,
];

/**
 * Progression d'un utilisateur dans une rubrique spécifique
 * Utilisé pour les exigences par rubrique (rubriqueRequirements)
 */
export interface RubriqueProgress {
  rubriqueId: string;
  rubriqueName: string;
  consultationsCompleted: number;
  consultationsRequired: number;
}

/**
 * Exigence de consultations dans une rubrique spécifique.
 * Chaque grade peut définir un nombre minimum de consultations COMPLETED
 * dans des rubriques spécifiques.
 */
export interface RubriqueRequirement {
  rubriqueId: string;
  rubriqueName?: string;
  minimumConsultations: number;
}

export interface GradeRequirements {
  grade: Grade;
  name: string;
 
    consultations?: number;
  rituels?: number;
  livres?: number;
}

export interface UserProgress {
  /** Compteurs globaux de l'utilisateur */
  consultationsCompleted: number;
  rituelsCompleted: number;
  booksRead: number;
  currentGrade: Grade | null;
  nextGrade?: Grade | null;
  /** Détail des consultations par rubrique (agrégation depuis les consultations réelles) */
  rubriqueProgress?: RubriqueProgress[];
  progressToNextGrade?: {
    /** Seuils globaux pour le grade suivant */
    consultations: { current: number; required: number; };
    rituels: { current: number; required: number; };
    livres: { current: number; required: number; };
    /** Exigences par rubrique pour le grade suivant (si configurées) */
    rubriqueProgress?: RubriqueProgress[];
  };
}

/**
 * Tableau des seuils GLOBAUX d'accès aux grades.
 *
 * Ce sont les compteurs globaux du profil utilisateur.
 * En COMPLÉMENT, chaque grade peut avoir des `rubriqueRequirements`
 * (nombre minimum de consultations dans des rubriques spécifiques),
 * configurés côté admin et vérifiés par agrégation MongoDB.
 *
 * Important : le nombre de consultations requis pour évoluer
 * n'est PAS équivalent au nombre total de consultations accessibles dans le grade.
 */
export const GRADE_REQUIREMENTS: Record<Grade, { consultations: number; rituels: number; livres: number }> = {
  [Grade.NEOPHYTE]: { consultations: 0, rituels: 0, livres: 0 },
  [Grade.ASPIRANT]: { consultations: 3, rituels: 1, livres: 1 },
  [Grade.CONTEMPLATEUR]: { consultations: 6, rituels: 2, livres: 1 },
  [Grade.CONSCIENT]: { consultations: 9, rituels: 3, livres: 2 },
  [Grade.INTEGRATEUR]: { consultations: 13, rituels: 4, livres: 2 },
  [Grade.TRANSMUTANT]: { consultations: 18, rituels: 6, livres: 3 },
  [Grade.ALIGNE]: { consultations: 23, rituels: 8, livres: 4 },
  [Grade.EVEILLE]: { consultations: 28, rituels: 10, livres: 5 },
  [Grade.SAGE]: { consultations: 34, rituels: 10, livres: 6 },
  [Grade.MAITRE_DE_SOI]: { consultations: 40, rituels: 10, livres: 8 }
};

export const GRADE_NAMES: Record<Grade, string> = {
  [Grade.NEOPHYTE]: 'Néophyte',
  [Grade.ASPIRANT]: 'Aspirant',
  [Grade.CONTEMPLATEUR]: 'Contemplateur',
  [Grade.CONSCIENT]: 'Conscient',
  [Grade.INTEGRATEUR]: 'Intégrateur',
  [Grade.TRANSMUTANT]: 'Transmutant',
  [Grade.ALIGNE]: 'Aligné',
  [Grade.EVEILLE]: 'Éveillé',
  [Grade.SAGE]: 'Sage',
  [Grade.MAITRE_DE_SOI]: 'Maître de Soi'
};

/**
 * Messages d'accueil et de félicitations pour chaque grade
 */
export const GRADE_MESSAGES: Record<Grade, { welcome: string; congratulations: string }> = {
  [Grade.NEOPHYTE]: {
    welcome: `Bienvenue sur Mon Étoile ! Vous débutez votre parcours spirituel en tant que Néophyte.

Ce grade marque l'entrée dans l'univers de la connaissance de soi et des sciences ancestrales. Prenez le temps de découvrir les outils, d'explorer les ressources et de vous familiariser avec votre espace personnel.

Votre chemin commence ici, dans l'ouverture, la curiosité et l'accueil des premiers enseignements.`,
    congratulations: `Vous êtes désormais Néophyte.

C'est le point de départ de votre aventure initiatique. Observez, explorez, et laissez-vous guider par votre étoile intérieure. Chaque découverte, chaque question, chaque pas compte sur ce chemin d'éveil.`
  },
  [Grade.ASPIRANT]: {
    welcome: `En créant votre compte, vous avez franchi le seuil d'un temple virtuel dédié à la connaissance de soi et aux savoirs fondamentaux de la spiritualité africaine.

Ici, les sciences ancestrales ne se limitent pas à l'observation des phénomènes : elles forment un langage sacré qui relie l'invisible au visible, l'âme au corps, le destin aux actes.

Votre étoile est votre guide. Elle brille dans le ciel, mais elle s'exprime aussi en vous, car ce qui est en haut reflète ce qui est en bas, et ce que révèlent les astres trouve écho dans votre vie intérieure.

Votre chemin se déploie à travers 10 grades initiatiques, 10 étapes symboliques qui marquent l'approfondissement de votre conscience et votre évolution.`,
    congratulations: `Vous venez d'atteindre le deuxième degré : Aspirant.

C'est le tout premier pas sur le chemin initiatique, le moment où votre curiosité s'éveille et où la quête de connaissance commence à illuminer votre vie.

Être Aspirant, c'est ouvrir votre regard sur vous-même et sur l'univers, accueillir les enseignements des sciences ancestrales et sentir la guidance de votre étoile intérieure.

Chaque question que vous vous posez, chaque expérience que vous vivez, est une pierre posée sur le chemin de votre éveil.`
  },
  [Grade.CONTEMPLATEUR]: {
    welcome: '',
    congratulations: `Vous avez atteint le degré 2 : Contemplateur.

À présent, votre regard ne se limite plus à ce qui est visible : vous apprenez à observer avec attention, à percevoir les subtilités de votre monde intérieur et les messages de votre étoile.

Être Contemplateur, c'est écouter le silence, discerner les signes et accueillir la sagesse qui se révèle dans vos expériences. Chaque observation, chaque réflexion, devient un outil pour mieux comprendre vos cycles, vos forces et vos responsabilités.`
  },
  [Grade.CONSCIENT]: {
    welcome: '',
    congratulations: `Vous avez atteint le degré 3 : Conscient.

À ce stade, votre regard s'élargit : vous ne vous contentez plus d'observer, vous commencez à comprendre et à intégrer les leçons que la vie et votre étoile vous offrent.

Être Conscient, c'est assumer votre pouvoir intérieur et reconnaître la responsabilité qui accompagne chaque choix. Vos pensées, vos actions et vos émotions deviennent des instruments de votre évolution.`
  },
  [Grade.INTEGRATEUR]: {
    welcome: '',
    congratulations: `Vous avez atteint le degré 4 : Intégrateur.

À présent, vos expériences, vos observations et votre conscience commencent à se lier et à s'harmoniser. Vous apprenez à donner un sens à vos apprentissages et à intégrer vos découvertes dans votre vie quotidienne.

Être Intégrateur, c'est assembler les pièces de votre être, comprendre vos forces et vos limites, et laisser votre étoile guider vos choix avec équilibre et discernement.`
  },
  [Grade.TRANSMUTANT]: {
    welcome: '',
    congratulations: `Vous avez atteint le degré 5 : Transmutant.

À ce niveau, vos expériences et vos compréhensions commencent à se transformer profondément : ce que vous viviez comme épreuves devient énergie, ce qui semblait limité devient opportunité.

Être Transmutant, c'est changer ce qui est intérieur pour refléter la lumière de votre étoile. Vous apprenez à transformer vos forces et vos fragilités en instruments de croissance et d'évolution.`
  },
  [Grade.ALIGNE]: {
    welcome: '',
    congratulations: `Vous avez atteint le degré 6 : Aligné.

À ce stade, vos pensées, vos émotions et vos actions commencent à résonner en harmonie. Votre étoile intérieure guide vos choix, et vous agissez désormais avec cohérence et intégrité.

Être Aligné, c'est vivre en accord avec votre essence, laisser la sagesse guider vos décisions et incarner vos valeurs dans chaque geste.`
  },
  [Grade.EVEILLE]: {
    welcome: '',
    congratulations: `Vous avez atteint le degré 7 : Éveillé.

À présent, votre conscience s'élargit : vous percevez avec clarté les liens entre le ciel, la terre et votre être intérieur. Votre étoile brille plus fort, et votre compréhension de vous-même et du monde devient profonde et lucide.

Être Éveillé, c'est voir au-delà des apparences, reconnaître vos forces et vos responsabilités, et incarner la sagesse que vous avez acquise.`
  },
  [Grade.SAGE]: {
    welcome: '',
    congratulations: `Vous avez atteint le degré 8 : Sage.

Votre parcours initiatique vous a conduit à une compréhension profonde de vous-même et du monde. Vous possédez désormais la sagesse qui éclaire vos choix, et vos actions reflètent l'harmonie entre connaissance, intuition et discernement.

Être Sage, c'est partager la lumière de votre étoile sans attendre de reconnaissance, guider les autres par votre exemple et incarner la vérité que vous avez cultivée.`
  },
  [Grade.MAITRE_DE_SOI]: {
    welcome: '',
    congratulations: `Vous avez atteint le degré 9 : Maître de Soi.

Ce dernier palier marque l'harmonie totale entre votre ciel intérieur, votre monde terrestre et votre conscience éveillée. Vous avez intégré toutes les leçons de votre chemin initiatique, et votre étoile brille désormais dans toute sa puissance.

Être Maître de Soi, c'est incarner pleinement votre destinée, rayonner la sagesse ancestrale et guider les autres sur le chemin de l'éveil. Votre parcours initiatique atteint son accomplissement suprême.`
  }
};

/**
 * Étape 1 : Calcule le grade candidat selon les seuils GLOBAUX.
 *
 * Parcourt les 9 grades du plus haut au plus bas et retourne
 * le plus haut grade dont les seuils globaux sont atteints.
 *
 * Note : la vérification par rubrique (étape 2) est effectuée côté backend
 * via agrégation MongoDB. Le frontend affiche le résultat du backend.
 */
export function calculateCurrentGrade(
  consultations: number,
  rituels: number,
  livres: number
): Grade | null {
  // Parcourir les grades dans l'ordre inverse pour trouver le plus haut grade atteint
  for (let i = GRADE_ORDER.length - 1; i >= 0; i--) {
    const grade = GRADE_ORDER[i];
    const requirements = GRADE_REQUIREMENTS[grade];

    if (
      consultations >= requirements.consultations &&
      rituels >= requirements.rituels &&
      livres >= requirements.livres
    ) {
      return grade;
    }
  }

  return null; // Aucun grade atteint
}

/**
 * Calcule la progression vers le grade suivant.
 *
 * Utilise les seuils globaux (consultations, rituels, livres).
 * La progression par rubrique est optionnelle et vient du backend.
 *
 * @param consultations - Total de consultations complétées
 * @param rituels - Total de rituels/invocations réalisés
 * @param livres - Total de livres lus
 * @param rubriqueProgress - Détail optionnel par rubrique (du backend)
 */
export function calculateProgress(
  consultations: number,
  rituels: number,
  livres: number,
  rubriqueProgress?: RubriqueProgress[]
): UserProgress {
  const currentGrade = calculateCurrentGrade(consultations, rituels, livres);
  const nextGrade = getNextGrade(currentGrade);
  
  const progress: UserProgress = {
    consultationsCompleted: consultations,
    rituelsCompleted: rituels,
    booksRead: livres,
    currentGrade,
    nextGrade,
    rubriqueProgress
  };

  if (nextGrade) {
    const nextRequirement = GRADE_REQUIREMENTS[nextGrade];

    progress.progressToNextGrade = {
      consultations: {
        current: consultations,
        required: nextRequirement.consultations
      },
      rituels: {
        current: rituels,
        required: nextRequirement.rituels
      },
      livres: {
        current: livres,
        required: nextRequirement.livres
      },
      rubriqueProgress
    };
  }

  return progress;
}

/**
 * Retourne le grade suivant
 */
export function getNextGrade(currentGrade: Grade | null): Grade | null {
  if (!currentGrade) return GRADE_ORDER[0];
  const currentIndex = GRADE_ORDER.indexOf(currentGrade);
  if (currentIndex === -1 || currentIndex === GRADE_ORDER.length - 1) return null;
  return GRADE_ORDER[currentIndex + 1];
}

/**
 * Obtient le niveau numérique du grade (1-9)
 */
export function getGradeLevel(grade: Grade | null): number {
  if (!grade) return 0;
  return GRADE_ORDER.indexOf(grade) + 1;
}

/**
 * Liste de tous les grades avec leurs noms et niveaux
 */
export const GRADES_LIST = GRADE_ORDER.map((grade, index) => ({
  value: grade,
  label: GRADE_NAMES[grade],
  level: index + 1
}));

/**
 * Obtient le nom du grade
 */
export function getGradeName(grade: Grade | null): string {
  if (!grade) return Grade.ASPIRANT;
  return GRADE_NAMES[grade] || Grade.ASPIRANT;
}