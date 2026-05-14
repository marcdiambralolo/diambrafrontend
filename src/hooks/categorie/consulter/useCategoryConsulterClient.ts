import {
    createCategoryConsultation, getCategoryErrorMessage,
    getCreatedConsultationDestination
} from '@/hooks/categorie/categoryConsultation.shared';
import { getChoiceAlternatives } from '@/lib/api/services/alternatives.service';
import { walletService } from '@/lib/api/services/wallet.service';
import { QUERY_KEYS, queryClient } from '@/lib/cache/queryClient';
import { buildCategoryConsultationPath } from '@/lib/consultations/navigation';
import type { WalletOffering } from '@/lib/interfaces';
import { OfferingAlternative } from '@/lib/interfaces';
import { useAuthStore } from '@/lib/store/auth.store';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type Category = 'banque';

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

export function useCategoryConsulterClient() {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);

    const choixConsultationEnCours = useMonEtoileStore((s) => s.choixConsultationEnCours);
    console.log('🔍 useCategoryConsulterClient - choixConsultationEnCours from store:', choixConsultationEnCours);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [walletOfferings, setWalletOfferings] = useState<WalletOffering[]>([]);
    const [showError, setShowError] = useState(false);


    const handleGoToMarket = useCallback(() => {
        const params = new URLSearchParams();
        if (choixConsultationEnCours?._id) params.set('consultationId', choixConsultationEnCours?._id);
        params.set('categoryId', "695ab7ee53c5ed748115c405");

        const url = `/star/marcheoffrandes${params.toString() ? `?${params.toString()}` : ''}`;
        router.push(url);
    }, [(choixConsultationEnCours?._id), router]);

    const handleValidation = useCallback(async (selectedAlternative: OfferingAlternative) => {
        setLoading(true);
        setError(null);
        setShowError(false);

        const getAltOfferingId = (alt: OfferingAlternative) => {
            if (alt && typeof alt.offeringId === 'object' && alt.offeringId !== null && '_id' in alt.offeringId) {
                return (alt.offeringId as any)._id;
            }
            return alt.offeringId;
        };
        try {
            if (!choixConsultationEnCours) {
                throw new Error('Données manquantes pour la création de la consultation');
            }
            const choice = (choixConsultationEnCours as any)?.choice ?? choixConsultationEnCours;
            const id = await createCategoryConsultation({


                choice,
                user: user || null,
                extraPayload: {
                    ...((typeof choixConsultationEnCours.extraPayload === 'object' && choixConsultationEnCours.extraPayload !== null) ? choixConsultationEnCours.extraPayload : {}),
                    offeringId: getAltOfferingId(selectedAlternative),
                    quantity: selectedAlternative.quantity,
                },
            });
            const consumeRes = await walletService.validateConsultationOfferings(id, [{
                offeringId: getAltOfferingId(selectedAlternative),
                quantity: selectedAlternative.quantity,
            }]);
            if (!consumeRes.success) {
                throw new Error(consumeRes.message || 'Erreur lors de la consommation');
            }
            queryClient.removeQueries({ queryKey: QUERY_KEYS.WALLET_TRANSACTIONS, exact: true });
            queryClient.removeQueries({ queryKey: QUERY_KEYS.WALLET_UNUSED_OFFERINGS, exact: true });

            router.push(buildCategoryConsultationPath("695ab7ee53c5ed748115c405", "consulter", {
                consultationId: id,
                rubriqueId: "694cde9bde3392d3751a0fe9",
                choiceId: choice._id,
                r: Date.now(),
            }));
        } catch (err: unknown) {
            console.error('❌ Error validating offerings:', err);
            setError(getCategoryErrorMessage(err, 'Erreur lors de la validation'));
            setShowError(true);
        } finally {
            setLoading(false);
        }
    }, [choixConsultationEnCours, user, router]);

    const clearError = useCallback(() => {
        setShowError(false);
        setError(null);
    }, []);

    useEffect(() => {
        let isActive = true;
        setLoading(true);
        setError(null);

        (async () => {
            try {
                const walletRes = await walletService.getUnusedWalletOfferings();
                if (!isActive) return;
                setWalletOfferings(walletRes);
            } catch (err: unknown) {
                if (!isActive) return;
                setError(getCategoryErrorMessage(err, 'Erreur lors du chargement'));
            } finally {
                if (isActive) setLoading(false);
            }
        })();
        return () => { isActive = false; };
    }, []);

    useEffect(() => {
        if (!choixConsultationEnCours?._id || !choixConsultationEnCours) return;
        router.replace(getCreatedConsultationDestination({
            categoryId: "695ab7ee53c5ed748115c405",
            consultationId: choixConsultationEnCours._id,
            rubriqueId: "694cde9bde3392d3751a0fe9",
            choiceId: choixConsultationEnCours._id,
            consultationType: (choixConsultationEnCours as any)?.type || null,
            refreshToken: Date.now(),
        }));
    }, [choixConsultationEnCours, router]);


    const [alternatives, setAlternatives] = useState<OfferingAlternative[]>([]);

    useEffect(() => {
        async function fetchAlternatives() {
            const choice = (choixConsultationEnCours as any)?.choice ?? choixConsultationEnCours;

            if (choice?._id) {
                try {
                    const alts = await getChoiceAlternatives(choice._id);
                    setAlternatives(alts);
                } catch (err) {
                    console.error('❌ Error fetching alternatives:', err);
                    setAlternatives([]);
                }
            } else {
                setAlternatives([]);
            }
        }
        fetchAlternatives();
    }, [choixConsultationEnCours, choixConsultationEnCours?._id]);

    type CategoryType = 'banque';
    const [activeTab, setActiveTab] = useState<CategoryType>('banque');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const walletMap = useMemo(() => {
        const map = new Map<string, number>();
        walletOfferings.forEach(w => map.set(w.offeringId, w.quantity));
        return map;
    }, [walletOfferings]);

    function getAltOfferingId(alt: OfferingAlternative) {
        if (alt && typeof alt.offeringId === 'object' && alt.offeringId !== null && '_id' in alt.offeringId) {
            return (alt.offeringId as any)._id;
        }
        return alt.offeringId;
    }

    const offeringsByCategory = useMemo(() => {
        const grouped: Record<CategoryType, OfferingAlternative[]> = {
            banque: [], 
        };
        alternatives.forEach(off => {
            grouped[off.category].push(off);
        });
        return grouped;
    }, [alternatives]);

    const categoryCounts = useMemo(() => ({
        banque: offeringsByCategory.banque.length, 
    }), [offeringsByCategory]);

    const selectedOffering = useMemo(
        () => alternatives.find(off => getAltOfferingId(off) === selectedId),
        [alternatives, selectedId]
    );

    const availableQty = useMemo(
        () => selectedOffering ? (walletMap.get(getAltOfferingId(selectedOffering)) || 0) : 0,
        [selectedOffering, walletMap]
    );

    const canProceed = useMemo(
        () => !!selectedOffering && availableQty >= selectedOffering?.quantity,
        [selectedOffering, availableQty]
    );

    const handleTabChange = useCallback((category: CategoryType) => {
        setActiveTab(category);
    }, []);

    const handleSelect = useCallback((offeringId: string) => {
        setSelectedId(offeringId);
    }, []);

    const handleNext = useCallback(() => {
        if (selectedOffering && canProceed) {
            handleValidation(selectedOffering);
        }
    }, [selectedOffering, canProceed, handleValidation]);

    const currentOfferings = useMemo(() => {
        const arr = offeringsByCategory[activeTab as CategoryType] ?? [];
        return arr.map(off => ({
            ...off,
            offeringId: getAltOfferingId(off)
        }));
    }, [offeringsByCategory, activeTab]);


    const state = {
        handleTabChange, setSelectedId, handleSelect, setActiveTab, handleNext,
        selectedId, activeTab, walletMap, offeringsByCategory, categoryCounts,
        selectedOffering, availableQty, canProceed, currentOfferings
    };

    const pot = state.currentOfferings[0];

    const handleNextNew = useCallback(() => {
        if (state.canProceed) {
            state.handleNext();
        }
    }, [state.canProceed, state.handleNext]);

    return {

        handleGoToMarket, handleNextNew, clearError, showError, walletOfferings, dataLoading: loading,
        dataError: error, state, currentError: showError ? error : null, pot,
    };
}