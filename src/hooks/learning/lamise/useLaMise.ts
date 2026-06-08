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

const BASE_CLASSES = "w-full flex items-center gap-4 p-2 rounded-2xl border-1 transition-all duration-300 text-left relative overflow-hidden group";
const INSUFFICIENT_CLASSES = "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60 cursor-not-allowed";
const SUFFICIENT_CLASSES = "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#9BC2FF] hover:shadow-xl hover:shadow-[#4F83D1]/10 active:scale-[0.98] cursor-pointer";

const getOfferingId = (alternative: OfferingAlternative): string => {
    const offeringId = alternative.offeringId;
    if (offeringId && typeof offeringId === 'object' && '_id' in offeringId) {
        return (offeringId as { _id: string })._id;
    }
    return offeringId as string;
};

const redirectToGame = (router: ReturnType<typeof useRouter>, hasCompetition: boolean) => {
    if (hasCompetition) { router.push(`/star/learning/startgame?_t=${Date.now()}`); }
};

export function useLaMise() {
    const router = useRouter();
    const [isPendingNavigation, startNavigationTransition] = useTransition();

    const { gameConfig, getAllCompetitions } = useMonEtoileStore();

    const hasRedirectedRef = useRef(false);

    const monidjeu = useMemo(() => gameConfig?._id || gameConfig?.id || "", [gameConfig]);
    const configOfferingId = useMemo(() => getOfferingId(POT_CONFIG), []);

    useEffect(() => {
        if (hasRedirectedRef.current || !gameConfig) return;

        const configId = gameConfig?._id || gameConfig?.id;

        if (!configId) return;

        const allCompetitions = getAllCompetitions();

        const hasActiveCompetition = allCompetitions.some(
            competition => competition.idConfig === configId
        );

        hasRedirectedRef.current = true;
        redirectToGame(router, hasActiveCompetition);
    }, [gameConfig, getAllCompetitions, router]);

    const { data: walletOfferings = [], isLoading: isWalletLoading } = useQuery<WalletOffering[]>({
        queryKey: [QUERY_KEYS.WALLET_UNUSED_OFFERINGS],
        queryFn: () => walletService.getUnusedWalletOfferings(),
        staleTime: 1000 * 30,
        gcTime: 1000 * 60 * 5,
        retry: 2,
    });

    const availableQuantity = useMemo(() => {
        const target = walletOfferings.find(w => w.offeringId === configOfferingId);
        return target?.quantity ?? 0;
    }, [walletOfferings, configOfferingId]);

    const isSufficient = availableQuantity >= POT_CONFIG.quantity;

    const cardClasses = useMemo(() =>
        `${BASE_CLASSES} ${isSufficient ? SUFFICIENT_CLASSES : INSUFFICIENT_CLASSES}`,
        [isSufficient]
    );

    const { mutateAsync: executeSubmit, isPending: isSubmitLoading, error: submitError } = useMutation<string, Error, void>({
        mutationFn: async () => {
            const consultationId = await createCategoryConsultation(monidjeu);
            if (!consultationId) throw new Error('Impossible de créer la compétition');

            const consumeRes = await walletService.validateConsultationOfferings(consultationId, [{
                offeringId: configOfferingId,
                quantity: POT_CONFIG.quantity,
            }]);

            if (!consumeRes.success) {
                throw new Error(consumeRes.message || 'Erreur lors de la consommation');
            }

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET_TRANSACTIONS] }),
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET_UNUSED_OFFERINGS] })
            ]);

            const { data } = await api.get(`/consultations/${consultationId}`);
            await api.put(`/consultations/${consultationId}`, { ...(data as Consultation) });

            return consultationId;
        },
        retry: 1,
    });

    const handlePlayClick = useCallback(() => {
        if (!isSufficient || isSubmitLoading || isPendingNavigation) return;

        startNavigationTransition(async () => {
            try {
                const consultationId = await executeSubmit();
                router.push(`/star/learning/startgame/?retour=learning&idconsultation=${consultationId}`);
            } catch (err) {
                console.error('Submission processing failed:', err);
            }
        });
    }, [isSufficient, isSubmitLoading, isPendingNavigation, executeSubmit, router]);

    const handleMarketClick = useCallback(() => {
        if (isPendingNavigation) return;

        startNavigationTransition(() => {
            router.push(`/star/marcheoffrandes?retour=learning&monjeu=${monidjeu}`);
        });
    }, [router, monidjeu, isPendingNavigation]);

    return {
        handlePlayClick, handleMarketClick, requiredQuantity: POT_CONFIG.quantity,
        availableQuantity, isSufficient, cardClasses,
        loading: isWalletLoading || isSubmitLoading || isPendingNavigation,
        error: submitError ? getCategoryErrorMessage(submitError, 'Erreur lors de la soumission') : null,
    };
}