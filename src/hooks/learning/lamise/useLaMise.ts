'use client';
import { createCategoryConsultation, getCategoryErrorMessage } from '@/hooks/categorie/categoryConsultation.shared';
import { walletService } from '@/lib/api/services/wallet.service';
import { QUERY_KEYS, queryClient } from '@/lib/cache/queryClient';
import type { OfferingAlternative, WalletOffering } from '@/lib/interfaces';
import { MISE_INITIALE } from '@/lib/learning/constantes';
import { useDiambraStore } from '@/lib/store/diambra.store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useTransition } from 'react';

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

const CONFIG_OFFERING_ID = getOfferingId(MISE_INITIALE);

export function useLaMise() {
    const router = useRouter();
    const [isPendingNavigation, startNavigationTransition] = useTransition();

    const { gameConfig, setAfficheChoix, setAfficheGame, setCurrentConsultationId, } = useDiambraStore();

    const monidjeu = useMemo(() => gameConfig?._id || gameConfig?.id || "", [gameConfig]);

    const hasRedirectedRef = useRef(false);
    const isMountedRef = useRef(true);

    const { data: walletOfferings = [], isLoading: isWalletLoading } = useQuery<WalletOffering[]>({
        queryKey: [QUERY_KEYS.WALLET_UNUSED_OFFERINGS],
        queryFn: () => walletService.getUnusedWalletOfferings(),
        staleTime: 1000,
        gcTime: 1000,
        retry: 2,
        enabled: !!monidjeu,
    });

    const targetOffering = walletOfferings.find(w => w.offeringId === CONFIG_OFFERING_ID);
    const availableQuantity = targetOffering?.quantity ?? 0;
    const isSufficient = availableQuantity >= MISE_INITIALE.quantity;

    const cardClasses = `${BASE_CLASSES} ${isSufficient ? SUFFICIENT_CLASSES : INSUFFICIENT_CLASSES}`;

    const { mutateAsync: executeSubmit, isPending: isSubmitLoading, error: submitError } = useMutation<string, Error, void>({
        mutationFn: async () => {
            const consultationId = await createCategoryConsultation(monidjeu);
            if (!consultationId) {
                throw new Error('Impossible de créer la compétition');
            }

            const consumeRes = await walletService.validateConsultationOfferings(consultationId, [{
                offeringId: CONFIG_OFFERING_ID,
                quantity: MISE_INITIALE.quantity,
            }]);

            if (!consumeRes.success) {
                throw new Error(consumeRes.message || 'Erreur lors de la consommation du jeton');
            }

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET_TRANSACTIONS] }),
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET_UNUSED_OFFERINGS] }),
            ]);

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
        requiredQuantity: MISE_INITIALE.quantity, availableQuantity, isSufficient, cardClasses,
        loading: isWalletLoading || isSubmitLoading || isPendingNavigation,
        error: submitError ? getCategoryErrorMessage(submitError, 'Erreur inconnue') : null,
    };
}