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

            router.push(buildCategoryConsultationPath("695ab7ee53c5ed748115c405",   {
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

    const handleSelect = useCallback((offeringId: string) => {
        setSelectedId(offeringId);
    }, []);

    const handleNext = useCallback(() => {
        if (selectedOffering && canProceed) {
            handleValidation(selectedOffering);
        }
    }, [selectedOffering, canProceed, handleValidation]);

    const state = {
        setSelectedId, handleSelect, handleNext,
        selectedId, walletMap, availableQty, canProceed,
    };

    const pot: OfferingAlternative = {
        category: 'banque',
        offeringId: '6945ae01b8af14d5f56cec0a',
        quantity: 1,
        name: 'pot',
        price: 200,
        description: 'pot',
        createdAt: '',
        updatedAt: '',
        _id: '69ada22a910a174365e2a216',
    };

    const handleNextNew = useCallback(() => {
        if (state.canProceed) {
            state.handleNext();
        }
    }, [state.canProceed, state.handleNext]);

    const availableQuantity = state.walletMap.get(pot.offeringId) || 0;
    const requiredQuantity = pot.quantity || 1;
    const isSufficient = availableQuantity >= requiredQuantity;

    const cardClasses = useMemo(() => {
        const baseClasses = "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group";

        if (state.selectedId === pot.offeringId) {
            return `${baseClasses} border-[#4F83D1] bg-gradient-to-r from-[#EEF4FF] to-[#DDE7FA] dark:from-[#13274C] dark:to-[#162A56] shadow-xl shadow-[#4F83D1]/20`;
        }

        if (isSufficient) {
            return `${baseClasses} border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#9BC2FF] hover:shadow-xl hover:shadow-[#4F83D1]/10 active:scale-[0.98] cursor-pointer`;
        }

        return `${baseClasses} border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60 cursor-not-allowed`;
    }, [state.selectedId, isSufficient, pot.offeringId]);

    return {
        handleGoToMarket, handleNextNew, clearError,
        dataLoading: loading, dataError: error, showError, currentError: showError ? error : null, state, availableQuantity,
        pot, cardClasses, isSufficient, requiredQuantity,
    };
}