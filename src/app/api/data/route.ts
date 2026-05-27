const LINEAR_CONGRUENTIAL_GENERATOR = {
  MODULUS: 2147483647,
  MULTIPLIER: 16807,
  OFFSET: 2147483646,
} as const;

const CASE_COUNTS_BY_TYPE: Readonly<Record<number, number>> = {
  0: 199,  // Nombre
  1: 101,  // Couleur
  2: 0,    // Image (calculé dynamiquement)
  3: 650,  // Lettre
} as const;

const GLOBAL_GAME_ORDER = [0, 3, 1, 2] as const;
const MAX_PIECES_SIZE = 10000;
const MAX_NIVEAU = 10;

export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed % LINEAR_CONGRUENTIAL_GENERATOR.MODULUS;
    if (this.seed <= 0) {
      this.seed += LINEAR_CONGRUENTIAL_GENERATOR.OFFSET;
    }
  }

  next(): number {
    this.seed = (this.seed * LINEAR_CONGRUENTIAL_GENERATOR.MULTIPLIER) % LINEAR_CONGRUENTIAL_GENERATOR.MODULUS;
    return (this.seed - 1) / LINEAR_CONGRUENTIAL_GENERATOR.OFFSET;
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }
}

export function shuffleArray<T>(items: T[], seed: number): T[] {
  const shuffled = [...items];
  const random = new SeededRandom(seed);

  // Fisher-Yates shuffle: O(n)
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = random.nextInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * @deprecated Ancienne fonction - conservée pour compatibilité
 * Utilisez shuffleArray à la place
 */
export function malisteca(seedString: string, items: string[]): string[] {
  const seed = parseInt(seedString, 10);
  if (isNaN(seed)) {
    throw new Error(`Seed invalide: ${seedString}`);
  }
  return shuffleArray(items, seed);
}

// ==================== GÉNÉRATION DE MATCHES ====================
/**
 * Génère un identifiant unique de match (9 chiffres)
 * Utilise crypto.getRandomValues pour une vraie entropie
 */
function generateMatchId(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return (array[0] % 1000000000).toString().padStart(9, '0');
  }
  // Fallback pour environnements sans crypto
  return Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
}

/**
 * Crée un objet MatchInfo
 */
function createMatch(ordre: number, tpsglobal: number): MatchInfo {
  const matchId = generateMatchId();

  return {
    numordrep: ordre + 1,
    isgameover: false,
    numeromatch: matchId,
    entite: parseInt(matchId) % 9 || 0,
    tpsglobal,
  };
}

/**
 * Génère la liste des matches selon le type de jeu
 * @param tpsglobal - Type de jeu (0-4)
 * @returns Liste des matches à jouer
 */
export function generateMatchList(tpsglobal: number): MatchInfo[] {
  if (tpsglobal === 4) {
    // Mode global : tous les types de jeu
    return GLOBAL_GAME_ORDER.map((type, index) => createMatch(type, index));
  }

  // Mode simple : un seul type de jeu
  return [createMatch(0, tpsglobal)];
}

// ==================== GÉNÉRATION DE CASES ====================
/**
 * Crée les cases initiales (verrouillées)
 */
function createInitialCases(items: string[], match: MatchInfo): Case[] {
  return items.map((txt, index) => ({
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
}

/**
 * Crée les cases jouables (mélangées)
 */
function createPlayableCases(
  shuffledItems: string[],
  originalItems: string[],
  match: MatchInfo
): Case[] {
  return shuffledItems.map((txt, index) => ({
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
}

/**
 * Calcule le nombre total de cases selon le type de jeu
 */
function getTotalCases(tpsglobal: number, niveau: number): number {
  if (tpsglobal === 2) {
    // Type Image : dépend du niveau
    return niveau * niveau;
  }

  const count = CASE_COUNTS_BY_TYPE[tpsglobal];
  if (count === undefined) {
    throw new Error(`Type de jeu invalide: ${tpsglobal}`);
  }

  return count;
}

// ==================== CHARGEMENT DE MATCH ====================
/**
 * Charge et initialise un match avec ses cases
 * @param match - Informations du match
 * @param niveau - Niveau de difficulté (taille de la grille)
 * @param pieces - Morceaux d'image pour le type Image
 * @returns Match initialisé avec les cases
 */
export async function loadMatch(
  match: MatchInfo,
  niveau: number,
  pieces: string[]
): Promise<MatchInfo> {
  // Validation
  if (match.tpsglobal === undefined || match.numeromatch === undefined) {
    throw new Error("Match incomplet: tpsglobal ou numeromatch manquant");
  }

  // Calcul des paramètres
  const totalCases = getTotalCases(match.tpsglobal, niveau);
  const gridSize = niveau * niveau;
  const seed = parseInt(match.numeromatch) + 7;

  // Génération des cases
  let availableCases = Array.from({ length: totalCases }, (_, i) => i.toString());

  // Mélange initial (sauf pour les images)
  if (match.tpsglobal !== 2) {
    availableCases = shuffleArray(availableCases, seed);
  }

  // Sélection des cases pour la grille
  const selectedCases = availableCases.slice(0, gridSize);

  // Mélange des cases sélectionnées
  const shuffledCases = shuffleArray(selectedCases, seed);

  // Création des cases
  match.listeCaseOpLab = createPlayableCases(shuffledCases, selectedCases, match);
  match.listeCaseOpLabInitiale = createInitialCases(selectedCases, match);
  match.pieces = pieces;

  return match;
}

// ==================== VALIDATION ====================
export interface GameRequest {
  tpsglobal: number;
  niveau: number;
  pieces: string[];
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Valide les données de la requête
 * @returns Liste des erreurs (vide si valide)
 */
export function validateGameRequest(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validation tpsglobal
  if (typeof data.tpsglobal !== "number") {
    errors.push({ field: "tpsglobal", message: "Le type de jeu doit être un nombre" });
  } else if (data.tpsglobal < 0 || data.tpsglobal > 4) {
    errors.push({ field: "tpsglobal", message: "Le type de jeu doit être entre 0 et 4" });
  }

  // Validation niveau
  if (typeof data.niveau !== "number") {
    errors.push({ field: "niveau", message: "Le niveau doit être un nombre" });
  } else if (data.niveau < 2 || data.niveau > MAX_NIVEAU) {
    errors.push({ field: "niveau", message: `Le niveau doit être entre 2 et ${MAX_NIVEAU}` });
  }

  // Validation pieces
  if (!Array.isArray(data.pieces)) {
    errors.push({ field: "pieces", message: "Les pièces doivent être un tableau" });
  } else if (data.pieces.length > MAX_PIECES_SIZE) {
    errors.push({ field: "pieces", message: `Trop de pièces (max: ${MAX_PIECES_SIZE})` });
  } else if (!data.pieces.every((p: any) => typeof p === "string")) {
    errors.push({ field: "pieces", message: "Toutes les pièces doivent être des chaînes" });
  }

  return errors;
}

import { Case, MatchInfo } from "@/lib/interfaces";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";


/**
 * Délai d'expiration de la requête (10 secondes)
 */
const REQUEST_TIMEOUT = 10000;

/**
 * Headers de cache pour optimiser les performances
 */
const CACHE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
  'Content-Type': 'application/json',
} as const;

/**
 * Crée une réponse d'erreur standardisée
 */
function createErrorResponse(
  message: string,
  status: number,
  errors?: any[]
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    },
    { status, headers: CACHE_HEADERS }
  );
}

/**
 * Crée une réponse de succès standardisée
 */
function createSuccessResponse(data: any): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString()
    },
    { headers: CACHE_HEADERS }
  );
}

/**
 * Route POST - Génère les matches du jeu
 * @param req - Requête contenant tpsglobal, niveau, pieces
 * @returns Liste des matches initialisés
 */
export async function POST(req: Request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    // Parsing du body
    const body = await req.json();

    // Validation des données
    const validationErrors = validateGameRequest(body);
    if (validationErrors.length > 0) {
      return createErrorResponse(
        "Données invalides",
        400,
        validationErrors
      );
    }

    const { tpsglobal, niveau, pieces } = body as GameRequest;

    // Génération des matches
    const matchList = generateMatchList(tpsglobal);

    // Chargement parallèle des matches
    const updatedMatches = await Promise.all(
      matchList.map((match) => loadMatch(match, niveau, pieces))
    );

    return createSuccessResponse({ matches: updatedMatches });

  } catch (error) {
    // Gestion des erreurs spécifiques
    if (error instanceof SyntaxError) {
      return createErrorResponse("Format JSON invalide", 400);
    }

    if ((error as Error).name === 'AbortError') {
      return createErrorResponse("Délai d'attente dépassé", 408);
    }

    // Log de l'erreur (à remplacer par un vrai système de logging en production)
    if (process.env.NODE_ENV !== 'production') {
      console.error("Erreur API /data:", error);
    }

    return createErrorResponse(
      "Erreur interne du serveur",
      500
    );

  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Route GET - Documentation de l'API
 */
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/data",
    method: "POST",
    description: "Génère les matches pour une partie de jeu",
    body: {
      tpsglobal: "number (0-4) - Type de jeu",
      niveau: "number (2-10) - Niveau de difficulté",
      pieces: "string[] - Morceaux d'image",
    },
    response: {
      success: "boolean",
      data: {
        matches: "MatchInfo[] - Liste des matches générés"
      },
      timestamp: "string (ISO 8601)"
    },
    version: "2.0.0"
  }, { headers: CACHE_HEADERS });
}