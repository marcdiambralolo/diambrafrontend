import { useState, useCallback, useEffect, useRef } from 'react';
import { walletService } from '@/lib/api/services/wallet.service';
import { QUERY_KEYS, queryClient } from '@/lib/cache/queryClient';
import type { OfferingAlternative, WalletOffering } from '@/lib/interfaces';
import { getCategoryErrorMessage } from '@/hooks/categorie/categoryConsultation.shared';

interface WalletState {
    loading: boolean;
    error: string | null;
    showError: boolean;
    walletOfferings: WalletOffering[];
}

const initialState: WalletState = {
    loading: true,
    error: null,
    showError: false,
    walletOfferings: [],
};

const getOfferingId = (alternative: OfferingAlternative): string => {
    const offeringId = alternative.offeringId;
    if (offeringId && typeof offeringId === 'object' && '_id' in offeringId) {
        return (offeringId as { _id: string })._id;
    }
    return offeringId as string;
};

export function useWalletManagement(potConfig: OfferingAlternative) {
    const [state, setState] = useState<WalletState>(initialState);
    const isMountedRef = useRef(true);

    const walletMap = new Map<string, number>();
    state.walletOfferings.forEach(w => walletMap.set(w.offeringId, w.quantity));

    const availableQuantity = walletMap.get(getOfferingId(potConfig)) || 0;
    const isSufficient = availableQuantity >= potConfig.quantity;

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, showError: false, error: null }));
    }, []);

    // Exposer setState pour permettre les mises à jour externes
    const updateWalletState = useCallback((updater: Partial<WalletState> | ((prev: WalletState) => WalletState)) => {
        setState(prev => {
            if (typeof updater === 'function') {
                return updater(prev);
            }
            return { ...prev, ...updater };
        });
    }, []);

    useEffect(() => {
        isMountedRef.current = true;

        const loadWalletOfferings = async () => {
            try {
                const walletRes = await walletService.getUnusedWalletOfferings();
                if (isMountedRef.current) {
                    setState(prev => ({ ...prev, walletOfferings: walletRes, loading: false }));
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

        loadWalletOfferings();

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return {
        walletState: state, availableQuantity, isSufficient,
        clearError, updateWalletState,
    };
}