// hooks/choix/useCategoryConsulterClient.ts
import { createCategoryConsultation, getCategoryErrorMessage } from '@/hooks/categorie/categoryConsultation.shared';
import { walletService } from '@/lib/api/services/wallet.service';
import { QUERY_KEYS, queryClient } from '@/lib/cache/queryClient';
 import type { OfferingAlternative, WalletOffering } from '@/lib/interfaces';
import { Variants } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';

// ============================================================================
// CONSTANTES
// ============================================================================

export const ANIMATION_CONFIG = {
    spring: {
        type: 'spring' as const,
        stiffness: 280,
        damping: 22
    },
    duration: {
        fast: 0.2,
        normal: 0.3
    }
} as const;

export const toastVariants: Variants = {
    hidden: { opacity: 0, x: 100, scale: 0.9 },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: ANIMATION_CONFIG.spring
    },
    exit: {
        opacity: 0,
        x: 100,
        scale: 0.95,
        transition: { duration: ANIMATION_CONFIG.duration.fast }
    }
};

const POT_CONFIG: OfferingAlternative = {
    offeringId: '6945ae01b8af14d5f56cec09',
    quantity: 1,
    name: 'Partie Quatre Cases',
    price: 200,
    createdAt: '',
    updatedAt: '',
    _id: '69ada22a910a174365e2a216',
} as const;

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================
 export function buildCategoryConsultationPath(categoryId: string,monjeu: string): string {
  return `/star/game/${categoryId}?monjeu=${monjeu}`;
}

const getOfferingId = (alternative: OfferingAlternative): string => {
    const offeringId = alternative.offeringId;
    if (offeringId && typeof offeringId === 'object' && '_id' in offeringId) {
        return (offeringId as { _id: string })._id;
    }
    return offeringId as string;
};

// ============================================================================
// TYPES
// ============================================================================

interface State {
    loading: boolean;
    error: string | null;
    showError: boolean;
    walletOfferings: WalletOffering[];
}

const initialState: State = {
    loading: true,
    error: null,
    showError: false,
    walletOfferings: [],
};

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useCategoryConsulterClient() {
    const params = useParams();

    const monidjeu = useMemo(() => {
        if (!params?.id) return null;
        return Array.isArray(params.id) ? params.id[0] : params.id;
    }, [params?.id]);

    const router = useRouter();
    const isMountedRef = useRef(true);
    const [state, setState] = useState<State>(initialState);

    // Mémorisation des valeurs dérivées
    const walletMap = useMemo(() => {
        const map = new Map<string, number>();
        state.walletOfferings.forEach(w => map.set(w.offeringId, w.quantity));
        return map;
    }, [state.walletOfferings]);

    const availableQuantity = useMemo(() =>
        walletMap.get(getOfferingId(POT_CONFIG)) || 0,
        [walletMap]
    );

    const requiredQuantity = POT_CONFIG.quantity;
    const isSufficient = availableQuantity >= requiredQuantity;

    const cardClasses = useMemo(() => {
        const baseClasses = "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group";
        if (isSufficient) {
            return `${baseClasses} border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#9BC2FF] hover:shadow-xl hover:shadow-[#4F83D1]/10 active:scale-[0.98] cursor-pointer`;
        }
        return `${baseClasses} border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60 cursor-not-allowed`;
    }, [isSufficient]);

    // ============================================================================
    // HANDLERS
    // ============================================================================

    const handleGoToMarket = useCallback(() => {
        router.push("/star/marcheoffrandes");
    }, [router]);

    const handleValidation = useCallback(async () => {
        // Éviter les doubles appels
        if (state.loading) return;

        setState(prev => ({ ...prev, loading: true, error: null, showError: false }));

        try {
            // Création de la consultation
            const consultationId = await createCategoryConsultation(monidjeu || '');

            if (!consultationId) {
                throw new Error('Impossible de créer la consultation');
            }

            // Validation des offrandes
            const consumeRes = await walletService.validateConsultationOfferings(consultationId, [{
                offeringId: getOfferingId(POT_CONFIG),
                quantity: POT_CONFIG.quantity,
            }]);

            if (!consumeRes.success) {
                throw new Error(consumeRes.message || 'Erreur lors de la consommation');
            }

            // Nettoyage du cache
            queryClient.removeQueries({ queryKey: QUERY_KEYS.WALLET_TRANSACTIONS, exact: true });
            queryClient.removeQueries({ queryKey: QUERY_KEYS.WALLET_UNUSED_OFFERINGS, exact: true });

            // Redirection vers la page de jeu
            router.push(buildCategoryConsultationPath(consultationId, monidjeu || ''));

        } catch (err) {
            console.error('❌ Error validating offerings:', err);
            setState(prev => ({
                ...prev,
                error: getCategoryErrorMessage(err, 'Erreur lors de la validation'),
                showError: true,
                loading: false,
            }));
        } finally {
            if (isMountedRef.current) {
                setState(prev => ({ ...prev, loading: false }));
            }
        }
    }, [router, state.loading]);

    const handleNext = useCallback(() => {
        if (isSufficient) {
            handleValidation();
        }
    }, [isSufficient, handleValidation]);

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, showError: false, error: null }));
    }, []);

    // ============================================================================
    // EFFETS
    // ============================================================================

    // Chargement initial des offrandes
    useEffect(() => {
        isMountedRef.current = true;

        const loadWalletOfferings = async () => {
            try {
                const walletRes = await walletService.getUnusedWalletOfferings();
                if (isMountedRef.current) {
                    setState(prev => ({
                        ...prev,
                        walletOfferings: walletRes,
                        loading: false
                    }));
                }
            } catch (err) {
                console.error('Erreur chargement wallet:', err);
                if (isMountedRef.current) {
                    setState(prev => ({
                        ...prev,
                        error: getCategoryErrorMessage(err, 'Erreur lors du chargement'),
                        showError: true,
                        loading: false,
                    }));
                }
            }
        };

        setState(prev => ({ ...prev, loading: true, error: null }));
        loadWalletOfferings();

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // ============================================================================
    // RETOUR
    // ============================================================================

    return {
        // Actions
        handleGoToMarket,
        handleNext,
        clearError,

        // États
        dataLoading: state.loading,
        dataError: state.error,
        showError: state.showError,
        currentError: state.showError ? state.error : null,

        // Données
        pot: POT_CONFIG,
        availableQuantity,
        requiredQuantity,
        isSufficient,
        cardClasses,
        walletMap,
    };
}