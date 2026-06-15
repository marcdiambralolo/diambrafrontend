import { Case, MatchInfo } from "@/lib/interfaces";

const LINEAR_CONGRUENTIAL_GENERATOR = {
  MODULUS: 2147483647,
  MULTIPLIER: 16807,
  OFFSET: 2147483646,
} as const;

export const CASE_COUNTS_BY_TYPE: Readonly<Record<number, number>> = {
  0: 199,  // Nombre
  1: 101,  // Couleur
  2: 0,    // Image (calculé dynamiquement)
  3: 650,  // Lettre
} as const;

export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed % LINEAR_CONGRUENTIAL_GENERATOR.MODULUS;
    if (this.seed <= 0) {
      this.seed += LINEAR_CONGRUENTIAL_GENERATOR.OFFSET;
    }
  }

  /**
   * Génère le prochain nombre aléatoire entre 0 et 1
   * Complexité: O(1)
   */
  next(): number {
    this.seed = (this.seed * LINEAR_CONGRUENTIAL_GENERATOR.MULTIPLIER) % LINEAR_CONGRUENTIAL_GENERATOR.MODULUS;
    return (this.seed - 1) / LINEAR_CONGRUENTIAL_GENERATOR.OFFSET;
  }

  /**
   * Génère un entier aléatoire entre 0 (inclus) et max (exclus)
   * Complexité: O(1)
   */
  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }
}

export const shuffleArray = <T>(items: T[], seed: number): T[] => {
  const shuffled = [...items];
  const random = new SeededRandom(seed);

  // Fisher-Yates shuffle: O(n)
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = random.nextInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

export const createMatch = (ordre: number, tpsglobal: number, matchId: string): MatchInfo => {
  return {
    numordrep: ordre + 1,
    isgameover: false,
    numeromatch: matchId,
    entite: parseInt(matchId) % 9 || 0,
    tpsglobal,
    combinaisons: [],
  };
};

export const createInitialCases = (items: string[], match: MatchInfo): Case[] =>
  items.map((txt, index) => ({
    id: index + 1,
    index,
    txt,
    itxt: txt,
    numordrep: match.numordrep,
    tpsglobal: match.tpsglobal,
    place: false,
    isLocked: true,
    mode: false,
  }));

export const createPlayableCases = (
  shuffledItems: string[],
  originalItems: string[],
  match: MatchInfo
): Case[] =>
  shuffledItems.map((txt, index) => ({
    id: index + 1,
    index,
    txt,
    itxt: originalItems[index],
    numordrep: match.numordrep,
    tpsglobal: match.tpsglobal,
    place: false,
    isLocked: false,
    mode: true,
  }));

export const getTotalCases = (tpsglobal: number, niveau: number): number => {
  if (tpsglobal === 2) return niveau * niveau;
  const count = CASE_COUNTS_BY_TYPE[tpsglobal];
  if (count === undefined) throw new Error(`Type de jeu invalide: ${tpsglobal}`);
  
  return count;
};