'use client';

import { api } from '@/lib/api/client';
import { LearningConfiguration } from '@/lib/interfaces';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

// ============================================================================
// CONSTANTES OPTIMISÉES
// ============================================================================

const QUERY_STALE_TIME = 60 * 1000;
const QUERY_GC_TIME = 5 * 60 * 1000;
const RETRY_ATTEMPTS = 2;
const BASE_RETRY_DELAY = 1000;
const NAVIGATION_DELAY = 100;

// Types
interface UseGameLoaderProps {
  autoNavigate?: boolean;
  redirectPath?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface GameLoaderState {
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  config: LearningConfiguration | null;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useGameLoader({
  autoNavigate = true,
  redirectPath = '/star/learning/startgame',
  onSuccess,
  onError,
}: UseGameLoaderProps = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const isMountedRef = useRef(true);
  const hasNavigatedRef = useRef(false);

  // State unique
  const [state, setState] = useState<GameLoaderState>({
    error: null,
    isLoading: true,
    isSuccess: false,
    config: null,
  });

  // Store actions
  const storeActions = useMonEtoileStore(
    useCallback((store) => ({
      setGameConfig: store.setGameConfig,
      gameConfig: store.gameConfig,
    }), [])
  );

  // ============================================================================
  // QUERY POUR CHARGER LA CONFIGURATION
  // ============================================================================

  const {
    data: configData,
    isLoading: isConfigLoading,
    error: configError,
    refetch: refetchConfig,
  } = useQuery<LearningConfiguration>({
    queryKey: ['game', 'config'],
    queryFn: async ({ signal }) => {
      const response = await api.get('learning-configurations/current-config', {
        signal,
      });
      return response.data as LearningConfiguration;
    },
    staleTime: QUERY_STALE_TIME,
    gcTime: QUERY_GC_TIME,
    retry: RETRY_ATTEMPTS,
    retryDelay: (attemptIndex) => Math.min(BASE_RETRY_DELAY * Math.pow(2, attemptIndex), 10000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // ============================================================================
  // MISE À JOUR DU STORE
  // ============================================================================

  const updateStore = useCallback((config: LearningConfiguration) => {
    startTransition(() => {
      storeActions.setGameConfig(config);
    });
  }, [storeActions]);

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  const navigateToGame = useCallback(() => {
    if (!autoNavigate || hasNavigatedRef.current) return;
    
    hasNavigatedRef.current = true;
    
    startTransition(() => {
      router.push(redirectPath);
    });
  }, [autoNavigate, redirectPath, router]);

  // ============================================================================
  // GESTION DU SUCCÈS
  // ============================================================================

  const handleSuccess = useCallback((config: LearningConfiguration) => {
    if (!isMountedRef.current) return;

    // Mettre à jour le store
    updateStore(config);

    // Mettre à jour l'état
    setState({
      error: null,
      isLoading: false,
      isSuccess: true,
      config,
    });

    // Callback personnalisé
    onSuccess?.();

    // Navigation automatique
    if (autoNavigate) {
      setTimeout(navigateToGame, NAVIGATION_DELAY);
    }
  }, [updateStore, autoNavigate, navigateToGame, onSuccess]);

  // ============================================================================
  // GESTION DES ERREURS
  // ============================================================================

  const handleError = useCallback((errorMessage: string) => {
    if (!isMountedRef.current) return;

    setState({
      error: errorMessage,
      isLoading: false,
      isSuccess: false,
      config: null,
    });

    onError?.(new Error(errorMessage));
  }, [onError]);

  // ============================================================================
  // CHARGEMENT DE LA CONFIGURATION
  // ============================================================================

  const loadConfig = useCallback(async () => {
    // Vérifier si déjà en cache
    const cachedConfig = queryClient.getQueryData<LearningConfiguration>(['game', 'config']);
    
    if (cachedConfig && !storeActions.gameConfig) {
      handleSuccess(cachedConfig);
      return cachedConfig;
    }

    // Sinon, charger depuis l'API
    const { data, error } = await refetchConfig();
    
    if (error) {
      handleError(error.message);
      return null;
    }
    
    if (data) {
      handleSuccess(data);
      return data;
    }
    
    handleError('Configuration non trouvée');
    return null;
  }, [queryClient, storeActions.gameConfig, refetchConfig, handleSuccess, handleError]);

  // ============================================================================
  // RETRY
  // ============================================================================

  const retry = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    loadConfig();
  }, [loadConfig]);

  // ============================================================================
  // EFFET PRINCIPAL
  // ============================================================================

  useEffect(() => {
    isMountedRef.current = true;
    
    // Démarrer le chargement
    loadConfig();
    
    return () => {
      isMountedRef.current = false;
      hasNavigatedRef.current = false;
    };
  }, [loadConfig]);

  // ============================================================================
  // RETOUR DU HOOK
  // ============================================================================

  return {
    // États
    config: state.config,
    error: state.error,
    isLoading: state.isLoading || isConfigLoading || isPending,
    isSuccess: state.isSuccess,
    isPending,
    
    // Actions
    retry,
    refetch: loadConfig,
    navigate: navigateToGame,
    
    // Utilitaires
    isReady: state.isSuccess && !!state.config,
  };
}

// ============================================================================
// HOOK SIMPLIFIÉ POUR USAGE RAPIDE
// ============================================================================

export function useQuickGameLoader() {
  const { isLoading, error, isReady, retry } = useGameLoader({
    autoNavigate: true,
  });

  return {
    isLoading,
    error,
    isReady,
    retry,
  };
}
 