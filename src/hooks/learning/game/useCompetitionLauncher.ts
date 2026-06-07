'use client';

import { MatchInfo } from '@/lib/interfaces';
import { decoupelimage } from "@/lib/learning/functions";
import { createInitialCases, createMatch, createPlayableCases, getTotalCases, shuffleArray } from "@/lib/learning/services/game.service";
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

const GLOBAL_GAME_ORDER = [0, 3, 1, 2] as const;
const DEFAULT_MATCH_ID = "123456789";
const DEFAULT_NIVEAU = 2;
const IMAGE_PATH = "/ephotoquatorze.jpg";

interface UseCompetitionLauncherReturn {
  demarrerJeu: () => Promise<void>;
  loading: boolean;
  error: Error | null;
  resetGame: () => void;
}

export function useCompetitionLauncher(): UseCompetitionLauncherReturn {
  const router =useRouter();
  const {
    setCurrentMatchInfo,  
  } = useMonEtoileStore();

  const gameConfig = useMonEtoileStore((state) => state.gameConfig);
  const numeromatch = gameConfig?.numeromatch ?? DEFAULT_MATCH_ID;
  const niveau = gameConfig?.niveau ?? DEFAULT_NIVEAU;
  
  const gameInitializedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [isGameInitializing, setIsGameInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [matchinfo, setMatchinfo] = useState<MatchInfo[]>([]);
  
  const generateMatchList = useCallback((): MatchInfo[] => {
    const matchId = numeromatch;
    return GLOBAL_GAME_ORDER.map((type, index) => createMatch(type, index, matchId));
  }, [numeromatch]);
  
  const loadMatch = useCallback(async (
    match: MatchInfo,
    niveau: number,
    piecesImages: string[]
  ): Promise<MatchInfo> => {
    const totalCases = getTotalCases(match.tpsglobal!, niveau);
    const gridSize = niveau * niveau;
    const seed = parseInt(match.numeromatch!) + 7;

    // Génération des cases disponibles
    let availableCases = Array.from({ length: totalCases }, (_, i) => i.toString());

    if (match.tpsglobal !== 2) {
      availableCases = shuffleArray(availableCases, seed);
    }

    const selectedCases = availableCases.slice(0, gridSize);
    const shuffledCases = shuffleArray([...selectedCases], seed);

    // Construction du match
    match.listeCaseOpLab = createPlayableCases(shuffledCases, selectedCases, match);
    match.listeCaseOpLabInitiale = createInitialCases(selectedCases, match);
    match.pieces = piecesImages;

    return match;
  }, []);

  /**
   * Initialise tous les matches en parallèle
   */
  const initializeMatches = useCallback(async (
    matchList: MatchInfo[],
    niveau: number,
    piecesImages: string[]
  ): Promise<MatchInfo[]> => {
    // Chargement parallèle avec limite de concurrence
    const BATCH_SIZE = 2; // Limite à 2 chargements simultanés pour éviter la surcharge
    const results: MatchInfo[] = [];

    for (let i = 0; i < matchList.length; i += BATCH_SIZE) {
      const batch = matchList.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(match => loadMatch(match, niveau, piecesImages))
      );
      results.push(...batchResults);
    }

    return results;
  }, [loadMatch]);

  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    gameInitializedRef.current = false;
  }, []);

 
  const initializeGame = useCallback(async () => {
    // Vérifications préalables
    if (gameInitializedRef.current || isGameInitializing) {
      return;
    }

    // Nettoyage de l'initialisation précédente
    cleanup();

    // Création du nouveau controller
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setIsGameInitializing(true);
    setError(null);

    try {
      // Étape 1: Génération des matches
      const matchList = generateMatchList();

      // Étape 2: Découpage des images (opération lourde)
      const piecesImages = await decoupelimage(IMAGE_PATH, niveau);

      // Vérification d'annulation
      if (signal.aborted) return;

      // Étape 3: Initialisation des matches
      const updatedMatches = await initializeMatches(matchList, niveau, piecesImages);

      // Vérification d'annulation
      if (signal.aborted) return;

 
      setCurrentMatchInfo(updatedMatches);
      setMatchinfo(updatedMatches);

      // Réinitialisation du flag de succès
      gameInitializedRef.current = true;

    } catch (error) {
      console.error("Erreur lors de l'initialisation du jeu:", error);
      setError(error instanceof Error ? error : new Error('Erreur inconnue'));
      gameInitializedRef.current = false;

      // Nettoyage en cas d'erreur
   
      setMatchinfo([]);
    } finally {
      if (!signal.aborted) {
        setIsGameInitializing(false);
      }
      abortControllerRef.current = null;
    }
  }, [
    generateMatchList,
    niveau,
    initializeMatches,
   
    setCurrentMatchInfo,
    isGameInitializing,
    cleanup
  ]);

  /**
   * Démarre le jeu
   */
  const demarrerJeu = useCallback(async () => {
 
 
    await initializeGame();

    if (gameInitializedRef.current && !error) {
 
      router.push('/star/learning/startgame');
    }
  }, [
   
 
    initializeGame,
 
    error
  ]);
 
  const resetGame = useCallback(() => {
    cleanup();
    setIsGameInitializing(false);
    setError(null);
    setMatchinfo([]);
   
  }, [cleanup,  ]);

  // Nettoyage automatique au démontage
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    demarrerJeu,
    loading: isGameInitializing,
    error,
    resetGame,
  };
}