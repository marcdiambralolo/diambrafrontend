'use client';
import { createCategoryConsultation, getCategoryErrorMessage, } from '@/hooks/categorie/categoryConsultation.shared';
import { walletService } from '@/lib/api/services/wallet.service';
import { QUERY_KEYS, queryClient } from '@/lib/cache/queryClient';
import type { OfferingAlternative, WalletOffering } from '@/lib/interfaces';
import { MISE_INITIALE } from '@/lib/learning/constantes';
import { useDiambraStore } from '@/lib/store/diambra.store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useTransition } from 'react';

const BASE_CLASSES =
    'group relative w-full overflow-hidden rounded-2xl border p-2 text-left transition-all duration-300 flex items-center gap-4';
const INSUFFICIENT_CLASSES =
    'cursor-not-allowed border-gray-200 bg-gray-50 opacity-60 dark:border-gray-700 dark:bg-gray-800/50';
const SUFFICIENT_CLASSES =
    'cursor-pointer border-gray-200 bg-white hover:border-[#9BC2FF] hover:shadow-xl hover:shadow-[#4F83D1]/10 active:scale-[0.98] dark:border-gray-700 dark:bg-gray-800';
const REQUIRED_QUANTITY = MISE_INITIALE.quantity;

function getOfferingId(alternative: OfferingAlternative): string {
    const offeringId = alternative.offeringId;

    if (offeringId && typeof offeringId === 'object' && '_id' in offeringId) {
        return String((offeringId as { _id: string })._id);
    }

    return String(offeringId);
}

const CONFIG_OFFERING_ID = getOfferingId(MISE_INITIALE);

async function getAvailableQuantity(): Promise<number> {
    const offerings = await walletService.getUnusedWalletOfferings();
    const targetOffering = offerings.find(
        (walletOffering: WalletOffering) =>
            walletOffering.offeringId === CONFIG_OFFERING_ID
    );

    return targetOffering?.quantity ?? 0;
}

export function useLaMise() {
    const router = useRouter();
    const [isPendingNavigation, startNavigationTransition] = useTransition();

    const { gameConfig, setAfficheChoix, setAfficheGame, setCurrentConsultationId, } = useDiambraStore();

    const monidjeu = gameConfig?._id ?? gameConfig?.id ?? '';

    const {
        data: availableQuantity = 0,
        isLoading: isWalletLoading,
        isFetching: isWalletFetching,
    } = useQuery<number>({
        queryKey: [QUERY_KEYS.WALLET_UNUSED_OFFERINGS, CONFIG_OFFERING_ID],
        queryFn: getAvailableQuantity,
        enabled: Boolean(monidjeu),
        retry: 2,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        staleTime: 0,
        gcTime: 0,
    });

    const isSufficient = availableQuantity >= REQUIRED_QUANTITY;

    const cardClasses = useMemo(
        () =>
            `${BASE_CLASSES} ${isSufficient ? SUFFICIENT_CLASSES : INSUFFICIENT_CLASSES
            }`,
        [isSufficient]
    );

    const submitMutation = useMutation<string, Error>({
        mutationFn: async () => {
            if (!monidjeu) {
                throw new Error('Identifiant du jeu introuvable');
            }

            const consultationId = await createCategoryConsultation(monidjeu);

            if (!consultationId) {
                throw new Error('Impossible de créer la compétition');
            }

            const consumeRes = await walletService.validateConsultationOfferings(
                consultationId,
                [
                    {
                        offeringId: CONFIG_OFFERING_ID,
                        quantity: REQUIRED_QUANTITY,
                    },
                ]
            );

            if (!consumeRes.success) {
                throw new Error(
                    consumeRes.message || 'Erreur lors de la consommation du jeton'
                );
            }

            return consultationId;
        },
        retry: 1,
        onSuccess: async (consultationId) => {
            setAfficheChoix(false);
            setAfficheGame(true);
            setCurrentConsultationId(consultationId);

            await Promise.allSettled([
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.WALLET_TRANSACTIONS],
                }),
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.WALLET_UNUSED_OFFERINGS],
                }),
            ]);

            // Optionnel si des Server Components dépendent du wallet
            router.refresh();
        },
    });

    const handlePlayClick = useCallback(async () => {
        if (!monidjeu || !isSufficient || submitMutation.isPending || isPendingNavigation) {
            return;
        }

        try {
            await submitMutation.mutateAsync();
        } catch (error) {
            console.error('Submission processing failed:', error);
        }
    }, [monidjeu, isSufficient, submitMutation, isPendingNavigation,]);

    const handleMarketClick = useCallback(() => {
        if (!monidjeu || isPendingNavigation) return;

        startNavigationTransition(() => {
            router.push(`/star/marcheoffrandes?retour=learning&monjeu=${monidjeu}`);
        });
    }, [router, monidjeu, isPendingNavigation]);

    const error = useMemo(() => {
        if (!submitMutation.error) return null;
        return getCategoryErrorMessage(submitMutation.error, 'Erreur inconnue');
    }, [submitMutation.error]);

    const loading = isWalletLoading || isWalletFetching || submitMutation.isPending || isPendingNavigation;

    return {
        handlePlayClick, handleMarketClick,
        isSufficient, loading, requiredQuantity: REQUIRED_QUANTITY, error, availableQuantity, cardClasses,
    };
}