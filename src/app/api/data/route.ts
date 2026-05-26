// import { NextResponse } from "next/server";
// import { Case, MatchInfo } from "@/libs/interface";

// class Random {
//     private seed: number;

//     constructor(seed: number) {
//         this.seed = seed % 2147483647;
//         if (this.seed <= 0) this.seed += 2147483646;
//     }

//     next(): number {
//         this.seed = (this.seed * 16807) % 2147483647;
//         return (this.seed - 1) / 2147483646;
//     }
// }

// const malisteca = (numeromat: string, wl: string[]): string[] => {
//     const seed = parseInt(numeromat, 10);
//     const use = new Array(wl.length).fill(false);
//     const lcases: string[] = [];
//     const random = new Random(seed);

//     while (lcases.length < wl.length) {
//         while (true) {

//             const compteur = Math.round(random.next() * wl.length);

//             if (compteur !== wl.length && !use[compteur]) {
//                 use[compteur] = true;
//                 lcases.push(wl[compteur]);
//                 break;
//             }
//         }
//     }

//     return lcases;
// }

// const generateMatchList = (tpsglobal: number): MatchInfo[] => {
//     const matchs: MatchInfo[] = [];
//     const addMatch = (numeroordre: number, tpsglobal1: number) => {
//         const nume = Math.floor(Math.random() * 1000000000).toString().padEnd(9, '0').slice(0, 9);
//         matchs.push({
//             numordrep: numeroordre + 1,
//             isgameover: false,
//             numeromatch: nume,
//             entite: parseInt(nume) % 9 || 0,
//             tpsglobal: tpsglobal1,
//         });
//     };

//     if (tpsglobal === 4) {
//         [0, 3, 1, 2].forEach((ordre, index) => addMatch(ordre, index));
//     } else {
//         addMatch(0, tpsglobal);
//     }

//     return matchs;
// };

// const caseinit = (lrcase1: string[], match: MatchInfo): Case[] => {
//     return lrcase1.map((txt, index) => ({
//         id: index + 1,
//         index: index,
//         txt: txt,
//         itxt: txt,
//         numordrep: match.numordrep,
//         tpsglobal: match.tpsglobal,
//         place: false,
//         isLocked: true,
//         mode: false,
//     }));
// }

// const chargematch = async (match: MatchInfo, niveau: number, pieces: string[]) => {
//     const caseCounts: Record<number, number> = { 0: 199, 1: 101, 2: niveau * niveau, 3: 650 };

//     if (match.tpsglobal === undefined) {
//         throw new Error("match.tpsglobal est undefined");
//     }

//     const totalCases = caseCounts[match.tpsglobal] || 0;

//     if (match.numeromatch === undefined) {
//         throw new Error("match.numeromatch est undefined");
//     }

//     const n = (parseInt(match.numeromatch) + 7).toString();

//     let listecases = Array.from({ length: totalCases }, (_, i) => i.toString());
//     if (match.tpsglobal !== 2) listecases = malisteca(n, listecases);

//     const lrcase1 = listecases.slice(0, niveau * niveau);
//     const lcases = malisteca(n, lrcase1);

//     match.listeCaseOpLab = lcases.map((txt, i) => ({
//         index: i,
//         id: i + 1,
//         txt,
//         itxt: lrcase1[i],
//         numordrep: match.numordrep,
//         tpsglobal: match.tpsglobal,
//         isLocked: false,
//         mode: true,
//     }));

//     match.listeCaseOpLabInitiale = caseinit(lrcase1, match);
//     match.pieces = pieces;
//     return match;
// };

// export async function POST(req: Request) {
//     try {
//         const { tpsglobal, niveau, pieces } = await req.json();
// console.log("Données reçues dans l'API :", { tpsglobal, niveau, pieces });
//         if (typeof tpsglobal !== "number" || typeof niveau !== "number") {
//             return NextResponse.json({ message: "Données invalides" }, { status: 400 });
//         }

//         const matchList = generateMatchList(tpsglobal);
//         const updatedMatches = await Promise.all(matchList.map((match) => chargematch(match, niveau, pieces)));

//         return NextResponse.json({ updatedMatches });

//     } catch (error) {
//         console.error("Erreur serveur :", error);
//         return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
//     }
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { 
  generateMatchList, 
  loadMatch, 
  validateGameRequest,
  type GameRequest 
} from "@/lib/learning/services/game.service";

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
