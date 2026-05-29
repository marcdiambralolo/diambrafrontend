// hooks/learning/choix/useCategoryConsulterClient.ts
import { useStatsDataWithCache } from '@/hooks/cache/useStatsDataWithCache';
import { getCategoryErrorMessage } from '@/hooks/categorie/categoryConsultation.shared';
import { api } from '@/lib/api/client';
import { walletService } from '@/lib/api/services/wallet.service';
import type { MenuItem, OfferingAlternative, WalletOffering } from '@/lib/interfaces';
import { LastEndedGame } from "@/lib/interfaces";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
 
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { useGameConfig } from '../useGame';
import { useCommon } from '../useCommon';

// ============================================================================
// CONSTANTES EXTERNES (ne changent jamais)
// ============================================================================

const POT_CONFIG: OfferingAlternative = {
    offeringId: '6945ae01b8af14d5f56cec09',
    quantity: 1,
    name: 'JETON DIAMBRA',
    price: 200,
    createdAt: '',
    updatedAt: '',
    _id: '69ada22a910a174365e2a216',
} as const;

const BASE_CLASSES = "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group";
const INSUFFICIENT_CLASSES = "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60 cursor-not-allowed";
const SUFFICIENT_CLASSES = "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#9BC2FF] hover:shadow-xl hover:shadow-[#4F83D1]/10 active:scale-[0.98] cursor-pointer";

export const ANIMATION_CONFIG = {
    spring: { type: 'spring' as const, stiffness: 280, damping: 22 },
    duration: { fast: 0.2, normal: 0.3 }
} as const;

export const toastVariants = {
    hidden: { opacity: 0, x: 100, scale: 0.9 },
    visible: { opacity: 1, x: 0, scale: 1, transition: ANIMATION_CONFIG.spring },
    exit: { opacity: 0, x: 100, scale: 0.95, transition: { duration: ANIMATION_CONFIG.duration.fast } }
} as const;

// ============================================================================
// TYPES
// ============================================================================

interface WalletState {
    loading: boolean;
    error: string | null;
    showError: boolean;
    walletOfferings: WalletOffering[];
}

const getOfferingId = (alternative: OfferingAlternative): string => {
    const offeringId = alternative.offeringId;
    if (offeringId && typeof offeringId === 'object' && '_id' in offeringId) {
        return (offeringId as { _id: string })._id;
    }
    return offeringId as string;
};

const initialState: WalletState = {
    loading: true,
    error: null,
    showError: false,
    walletOfferings: [],
};

// ============================================================================
// HOOK PRINCIPAL OPTIMISÉ
// ============================================================================

export function useCategoryConsulterClient() {
    const router = useRouter();
    const { stats, isLoading: statsLoading } = useStatsDataWithCache();
    const { data: gameConfig, isLoading: configLoading } = useGameConfig();
    const { randomImage, onlineStatus } = useCommon();
    
    // Store actions
    const { 
        tpsglobal: storeTpsglobal, 
        niveau: storeNiveau,
        setTpsglobal: setStoreTpsglobal,
        setNiveau: setStoreNiveau,
        setGameParams,
        clearGameParams
    } = useMonEtoileStore();

    // Refs pour éviter les re-rendus
    const isMountedRef = useRef(true);
    const timerRef = useRef<NodeJS.Timeout>();

    // États groupés par domaine
    const [walletState, setWalletState] = useState<WalletState>(initialState);
    const [gameStarted, setGameStarted] = useState(false);
    const [matchFinished, setMatchFinished] = useState(false);
    const [lastEndedGame, setLastEndedGame] = useState<LastEndedGame | null>(null);
    const [loadingLastEnded, setLoadingLastEnded] = useState(true);
    const [afficheaide, setAfficheaide] = useState(false);
    const [jouer, setJouer] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [localTpsglobal, setLocalTpsglobal] = useState(storeTpsglobal);
    const [localNiveau, setLocalNiveau] = useState(storeNiveau);

    // ==========================================================================
    // VALEURS DÉRIVÉES AVEC useMemo OPTIMISÉ
    // ==========================================================================

    const monidjeu = useMemo(() => gameConfig?._id || gameConfig?.id || "", [gameConfig]);
    const niveau = useMemo(() => gameConfig?.niveau || storeNiveau || 2, [gameConfig?.niveau, storeNiveau]);
    const tpsglobal = useMemo(() => localTpsglobal || storeTpsglobal || 0, [localTpsglobal, storeTpsglobal]);

    const walletMap = useMemo(() => {
        const map = new Map<string, number>();
        walletState.walletOfferings.forEach(w => map.set(w.offeringId, w.quantity));
        return map;
    }, [walletState.walletOfferings]);

    const availableQuantity = useMemo(() => 
        walletMap.get(getOfferingId(POT_CONFIG)) || 0,
        [walletMap]
    );

    const isSufficient = useMemo(() => 
        availableQuantity >= POT_CONFIG.quantity,
        [availableQuantity]
    );

    const cardClasses = useMemo(() => 
        `${BASE_CLASSES} ${isSufficient ? SUFFICIENT_CLASSES : INSUFFICIENT_CLASSES}`,
        [isSufficient]
    );

    const startDate = useMemo(() => 
        gameConfig?.startgameDate ? new Date(gameConfig.startgameDate) : null, 
        [gameConfig?.startgameDate]
    );
    
    const endDate = useMemo(() => 
        gameConfig?.endgameDate ? new Date(gameConfig.endgameDate) : null, 
        [gameConfig?.endgameDate]
    );
    
    const now = useMemo(() => new Date(), []);

    const isGameActive = useMemo(() =>
        gameConfig?.isActive === true &&
        gameConfig?.status === 'active' &&
        startDate !== null &&
        endDate !== null &&
        now >= startDate &&
        now <= endDate,
        [gameConfig?.isActive, gameConfig?.status, startDate, endDate, now]
    );

    const isGameEnded = useMemo(() =>
        gameConfig?.status === 'ended' || (endDate !== null && now > endDate),
        [gameConfig?.status, endDate, now]
    );

    const isGameNotStarted = useMemo(() =>
        gameConfig?.status === 'pending' || (startDate !== null && now < startDate),
        [gameConfig?.status, startDate, now]
    );

    const currentYear = useMemo(() => new Date().getFullYear(), []);

    // ==========================================================================
    // ÉTATS DÉRIVÉS (calculés une seule fois)
    // ==========================================================================

    const afficheselection = useMemo(() => 
        !(isGameEnded || (!isGameActive && !isGameNotStarted && lastEndedGame !== null)) && !gameStarted,
        [isGameEnded, isGameActive, isGameNotStarted, lastEndedGame, gameStarted]
    );

    const affichebanner = useMemo(() => 
        isGameActive && !isGameEnded && endDate && startDate,
        [isGameActive, isGameEnded, endDate, startDate]
    );

    const loading = useMemo(() => 
        statsLoading || configLoading || loadingLastEnded || walletState.loading,
        [statsLoading, configLoading, loadingLastEnded, walletState.loading]
    );

    const currentError = useMemo(() => 
        walletState.showError ? walletState.error : null,
        [walletState.showError, walletState.error]
    );

    // ==========================================================================
    // CALLBACKS STABILISÉS
    // ==========================================================================

    const clearError = useCallback(() => {
        setWalletState(prev => ({ ...prev, showError: false, error: null }));
    }, []);

    const handleValidation = useCallback(() => {
        setGameStarted(true);
    }, []);

    const afficherAide = useCallback(() => {
        setAfficheaide(true);
    }, []);

    const afficherJeu = useCallback(() => {
        setAfficheaide(false);
    }, []);

    const handleNext = useCallback(() => {
        if (isSufficient) {
            handleValidation();
        }
    }, [isSufficient, handleValidation]);

    const handleGoToMarket = useCallback(() => {
        router.push(`/star/marcheoffrandes?monjeu=${monidjeu}`);
    }, [router, monidjeu]);

    const fetchLastEndedGame = useCallback(async () => {
        try {
            const response = await api.get('/game-configurations/last-ended');
            const data = response.data as { success: boolean; hasEndedEdition: boolean; configuration: LastEndedGame };
            setLastEndedGame(data?.hasEndedEdition ? data.configuration : null);
        } catch (error) {
            console.error('Erreur lors de la récupération du dernier jeu terminé:', error);
            setLastEndedGame(null);
        } finally {
            setLoadingLastEnded(false);
        }
    }, []);

    const handleEndMatch = useCallback(() => {
        if (!matchFinished) {
            setMatchFinished(true);
            setRefreshTrigger(prev => prev + 1);
        }
    }, [matchFinished]);

    const handleItemClick = useCallback((item: MenuItem) => {
        const newTpsglobal = item.tpsglobal!;
        setLocalTpsglobal(newTpsglobal);
        setStoreTpsglobal(newTpsglobal);
        
        if (item.tpsglobal === -1) {
            setJouer(false);
            router.push('/aide');
        } else {
            setJouer(true);
            // Sauvegarder les paramètres dans le store
            setGameParams(newTpsglobal, niveau);
        }
    }, [router, niveau, setStoreTpsglobal, setGameParams]);

    const handleClick = useCallback(() => {
        window.location.href = '/star/learning';
    }, []);

    // ==========================================================================
    // EFFETS OPTIMISÉS
    // ==========================================================================

    useEffect(() => {
        isMountedRef.current = true;

        const loadWalletOfferings = async () => {
            try {
                const walletRes = await walletService.getUnusedWalletOfferings();
                if (isMountedRef.current) {
                    setWalletState(prev => ({ ...prev, walletOfferings: walletRes, loading: false }));
                }
            } catch (err) {
                console.error('Erreur chargement wallet:', err);
                if (isMountedRef.current) {
                    setWalletState(prev => ({
                        ...prev,
                        error: getCategoryErrorMessage(err, 'Erreur lors du chargement'),
                        showError: true,
                        loading: false,
                    }));
                }
            }
        };

        loadWalletOfferings();
        fetchLastEndedGame();

        return () => {
            isMountedRef.current = false;
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [fetchLastEndedGame]);

    useEffect(() => {
        if (refreshTrigger > 0) {
            router.push(`/star/profil?monjeu=${monidjeu}`);
        }
    }, [refreshTrigger, router, monidjeu]);

    // ==========================================================================
    // RETOUR (props stables)
    // ==========================================================================

    return {
        // États booléens
        gamehasStarted: gameStarted,
        afficheselection,
        affichebanner,
        isSufficient,
        error: walletState.showError ? walletState.error : null,
        
        // Données
        currentError,
        requiredQuantity: POT_CONFIG.quantity,
        availableQuantity,
        cardClasses,
        stats,
        startDate,
        endDate,
        gameConfig,
        onlineStatus,
        randomImage,
        currentYear,
        
        // Paramètres du jeu
        tpsglobal,
        niveau,
        
        // État de chargement
        loading,
        
        // États UI
        afficheaide,
        jouer,
        
        // Actions
        afficherAide,
        afficherJeu,
        handleGoToMarket,
        handleEndMatch,
        handleNext,
        clearError,
        handleItemClick,
        handleClick,
    };
}