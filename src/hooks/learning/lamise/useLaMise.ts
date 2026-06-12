'use client';
import { createCategoryConsultation, getCategoryErrorMessage } from '@/hooks/categorie/categoryConsultation.shared';
import { api } from '@/lib/api/client';
import { walletService } from '@/lib/api/services/wallet.service';
import { QUERY_KEYS, queryClient } from '@/lib/cache/queryClient';
import type { Consultation, OfferingAlternative, WalletOffering } from '@/lib/interfaces';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useTransition } from 'react';

const POT_CONFIG: OfferingAlternative = {
    offeringId: '6945ae01b8af14d5f56cec09',
    quantity: 1,
    name: 'JETON DIAMBRA',
    price: 200,
    createdAt: '',
    updatedAt: '',
    _id: '69ada22a910a174365e2a216',
} as const;

const BASE_CLASSES = "w-full flex items-center gap-4 p-2 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden group";
const INSUFFICIENT_CLASSES = "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60 cursor-not-allowed";
const SUFFICIENT_CLASSES = "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#9BC2FF] hover:shadow-xl hover:shadow-[#4F83D1]/10 active:scale-[0.98] cursor-pointer";

const getOfferingId = (alternative: OfferingAlternative): string => {
    const offeringId = alternative.offeringId;
    if (offeringId && typeof offeringId === 'object' && '_id' in offeringId) {
        return (offeringId as { _id: string })._id;
    }
    return offeringId as string;
};

const CONFIG_OFFERING_ID = getOfferingId(POT_CONFIG);

export function useLaMise() {
    const router = useRouter();
    const [isPendingNavigation, startNavigationTransition] = useTransition();

    const { gameConfig, setAfficheChoix, setAfficheGame, setCurrentConsultationId, } = useMonEtoileStore();

    const hasRedirectedRef = useRef(false);
    const isMountedRef = useRef(true);

    const monidjeu = useMemo(
        () => gameConfig?._id || gameConfig?.id || "",
        [gameConfig]
    );

    const { data: walletOfferings = [], isLoading: isWalletLoading } = useQuery<WalletOffering[]>({
        queryKey: [QUERY_KEYS.WALLET_UNUSED_OFFERINGS],
        queryFn: () => walletService.getUnusedWalletOfferings(),
        staleTime: 30000, // 30s
        gcTime: 1 * 1000,   // 1min
        retry: 2,
        enabled: !!monidjeu,
    });

    const targetOffering = walletOfferings.find(w => w.offeringId === CONFIG_OFFERING_ID);
    const availableQuantity = targetOffering?.quantity ?? 0;
    const isSufficient = availableQuantity >= POT_CONFIG.quantity;

    const cardClasses = `${BASE_CLASSES} ${isSufficient ? SUFFICIENT_CLASSES : INSUFFICIENT_CLASSES}`;

    const { mutateAsync: executeSubmit, isPending: isSubmitLoading, error: submitError } = useMutation<string, Error, void>({
        mutationFn: async () => {
            if (!monidjeu) {
                throw new Error('Game configuration not found');
            }

            const consultationId = await createCategoryConsultation(monidjeu);
            if (!consultationId) {
                throw new Error('Impossible de créer la compétition');
            }

            const consumeRes = await walletService.validateConsultationOfferings(consultationId, [{
                offeringId: CONFIG_OFFERING_ID,
                quantity: POT_CONFIG.quantity,
            }]);

            if (!consumeRes.success) {
                throw new Error(consumeRes.message || 'Erreur lors de la consommation');
            }

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET_TRANSACTIONS] }),
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET_UNUSED_OFFERINGS] }),
            ]);

            const { data: consultationData } = await api.get<Consultation>(`/consultations/${consultationId}`);
            await api.put(`/consultations/${consultationId}`, consultationData);

            return consultationId;
        },
        retry: 1,
    });

    const handlePlayClick = useCallback(async () => {
        if (!isSufficient || isSubmitLoading || isPendingNavigation) return;

        startNavigationTransition(async () => {
            try {
                const consultationId = await executeSubmit();
                setAfficheChoix(false);
                setAfficheGame(true);
                setCurrentConsultationId(consultationId);
            } catch (err) {
                console.error('Submission processing failed:', err);
            }
        });
    }, [isSufficient, isSubmitLoading, isPendingNavigation, executeSubmit, setCurrentConsultationId]);

    const handleMarketClick = useCallback(() => {
        if (isPendingNavigation || !monidjeu) return;

        startNavigationTransition(() => {
            router.push(`/star/marcheoffrandes?retour=learning&monjeu=${monidjeu}`);
        });
    }, [router, monidjeu, isPendingNavigation]);

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
            hasRedirectedRef.current = false;
        };
    }, []);

    return {
        handlePlayClick, handleMarketClick,
        requiredQuantity: POT_CONFIG.quantity, availableQuantity, isSufficient, cardClasses,
        loading: isWalletLoading || isSubmitLoading || isPendingNavigation,
        error: submitError ? getCategoryErrorMessage(submitError, 'Erreur lors de la soumission') : null,
    };
}