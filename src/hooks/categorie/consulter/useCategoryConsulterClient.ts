import { createCategoryConsultation, getCategoryErrorMessage } from '@/hooks/categorie/categoryConsultation.shared';
import { walletService } from '@/lib/api/services/wallet.service';
import { QUERY_KEYS, queryClient } from '@/lib/cache/queryClient';
import { buildCategoryConsultationPath } from '@/lib/consultations/navigation';
import type { WalletOffering } from '@/lib/interfaces';
import { OfferingAlternative } from '@/lib/interfaces';
import { Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
    name: 'pot',
    price: 200,
    createdAt: '',
    updatedAt: '',
    _id: '69ada22a910a174365e2a216',
} as const;

const getOfferingId = (alternative: OfferingAlternative): string => {
    const offeringId = alternative.offeringId;
    if (offeringId && typeof offeringId === 'object' && '_id' in offeringId) {
        return (offeringId as any)._id;
    }
    return offeringId as string;
};


export function useCategoryConsulterClient() {
    const router = useRouter();
 
    const [state, setState] = useState({
        loading: true,
        error: null as string | null,
        showError: false,
        walletOfferings: [] as WalletOffering[],
    });

    const handleGoToMarket = useCallback(() => {
        router.push("/star/marcheoffrandes");
    }, [router]);

    const handleValidation = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null, showError: false }));

        try {
            const id = await createCategoryConsultation( );

            const consumeRes = await walletService.validateConsultationOfferings(id, [{
                offeringId: POT_CONFIG.offeringId,
                quantity: POT_CONFIG.quantity,
            }]);

            if (!consumeRes.success) {
                throw new Error(consumeRes.message || 'Erreur lors de la consommation');
            }

            queryClient.removeQueries({ queryKey: QUERY_KEYS.WALLET_TRANSACTIONS, exact: true });
            queryClient.removeQueries({ queryKey: QUERY_KEYS.WALLET_UNUSED_OFFERINGS, exact: true });

            router.push(buildCategoryConsultationPath(id));
        } catch (err) {
            console.error('❌ Error validating offerings:', err);
            setState(prev => ({
                ...prev,
                error: getCategoryErrorMessage(err, 'Erreur lors de la validation'),
                showError: true,
            }));
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    }, [  router]);

    useEffect(() => {
        let isActive = true;

        const loadWalletOfferings = async () => {
            try {
                const walletRes = await walletService.getUnusedWalletOfferings();
                console.log(walletRes);
                if (isActive) {
                    setState(prev => ({ ...prev, walletOfferings: walletRes }));
                }
            } catch (err) {
                if (isActive) {
                    setState(prev => ({
                        ...prev,
                        error: getCategoryErrorMessage(err, 'Erreur lors du chargement'),
                        showError: true,
                    }));
                }
            } finally {
                if (isActive) {
                    setState(prev => ({ ...prev, loading: false }));
                }
            }
        };

        setState(prev => ({ ...prev, loading: true, error: null }));
        loadWalletOfferings();

        return () => { isActive = false; };
    }, []);

    const walletMap = useMemo(() => {
        const map = new Map<string, number>();
        state.walletOfferings.forEach(w => map.set(w.offeringId, w.quantity));
        return map;
    }, [state.walletOfferings]);

    const availableQuantity = useMemo(() =>
        walletMap.get(getOfferingId(POT_CONFIG)) || 0,
        [walletMap, POT_CONFIG]
    );

    const requiredQuantity = POT_CONFIG.quantity;
    const isSufficient = availableQuantity >= requiredQuantity;

    const handleNext = useCallback(() => {
        if (isSufficient) {
            handleValidation();
        }
    }, [isSufficient, handleValidation]);

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, showError: false, error: null }));
    }, []);

    const cardClasses = useMemo(() => {
        const baseClasses = "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group";
        if (isSufficient) {
            return `${baseClasses} border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#9BC2FF] hover:shadow-xl hover:shadow-[#4F83D1]/10 active:scale-[0.98] cursor-pointer`;
        }
        return `${baseClasses} border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60 cursor-not-allowed`;
    }, [isSufficient]);

    return {
        // Actions
        handleGoToMarket, handleNext, clearError,

        // États
        dataLoading: state.loading,
        dataError: state.error,
        showError: state.showError,
        currentError: state.showError ? state.error : null,

        // Données
        pot: POT_CONFIG, availableQuantity, requiredQuantity, isSufficient, cardClasses, walletMap,
    };
}