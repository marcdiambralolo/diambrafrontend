'use client';

import { createCategoryConsultation, getCategoryErrorMessage } from '@/hooks/categorie/categoryConsultation.shared';
import { api } from '@/lib/api/client';
import { walletService } from '@/lib/api/services/wallet.service';
import { QUERY_KEYS, queryClient } from '@/lib/cache/queryClient';
import type { OfferingAlternative, WalletOffering, Consultation } from '@/lib/interfaces';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useTransition } from 'react';

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

export function useLaMise() {
    const router = useRouter();
    const [isPendingNavigation, startNavigationTransition] = useTransition();
    const { gameConfig, setCurrentConsultationId } = useMonEtoileStore();

    const monidjeu = useMemo(() => gameConfig?._id || gameConfig?.id || "", [gameConfig]);
    const configOfferingId = useMemo(() => getOfferingId(POT_CONFIG), []);

    // 1. Fetch des données via TanStack Query (Suppression complète de useEffect et des états locaux)
    const { data: walletOfferings = [], isLoading: isWalletLoading } = useQuery<WalletOffering[]>({
        queryKey: [QUERY_KEYS.WALLET_UNUSED_OFFERINGS],
        queryFn: () => walletService.getUnusedWalletOfferings(),
        staleTime: 1000 * 30, // Considéré frais pendant 30 secondes
    });

    // 2. Calculs mémorisés dérivés de la Query
    const availableQuantity = useMemo(() => {
        const target = walletOfferings.find(w => w.offeringId === configOfferingId);
        return target ? target.quantity : 0;
    }, [walletOfferings, configOfferingId]);

    const isSufficient = availableQuantity >= POT_CONFIG.quantity;
    
    const cardClasses = useMemo(() => 
        `${BASE_CLASSES} ${isSufficient ? SUFFICIENT_CLASSES : INSUFFICIENT_CLASSES}`, 
        [isSufficient]
    );

    // 3. Gestion de l'action asynchrone via une Mutation (Fin des verrous manuels et des refs de montage)
    const { mutateAsync: executeSubmit, isPending: isSubmitLoading, error: submitError } = useMutation({
        mutationFn: async () => {
            const consultationId = await createCategoryConsultation(monidjeu);
            if (!consultationId) throw new Error('Impossible de créer la compétition');

            setCurrentConsultationId(consultationId);

            const consumeRes = await walletService.validateConsultationOfferings(consultationId, [{
                offeringId: configOfferingId,
                quantity: POT_CONFIG.quantity,
            }]);

            if (!consumeRes.success) {
                throw new Error(consumeRes.message || 'Erreur lors de la consommation');
            }

            // Invalidation propre des caches
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET_TRANSACTIONS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET_UNUSED_OFFERINGS] });

            const { data } = await api.get(`/consultations/${consultationId}`);
            await api.put(`/consultations/${consultationId}`, { ...(data as Consultation) });

            return consultationId;
        }
    });

    // 4. Actions utilisateurs emballées dans un useTransition pour Next.js App Router
    const handlePlayClick = useCallback(() => {
        if (!isSufficient || isSubmitLoading) return;

        startNavigationTransition(async () => {
            try {
                const consultationId = await executeSubmit();
                router.push(`/star/learning/startgame/?retour=learning&idconsultation=${consultationId}`);
            } catch (err) {
                console.error('Submission processing failed:', err);
            }
        });
    }, [isSufficient, isSubmitLoading, executeSubmit, router]);

    const handleMarketClick = useCallback(() => {
        startNavigationTransition(() => {
            router.push(`/star/marcheoffrandes?retour=learning&monjeu=${monidjeu}`);
        });
    }, [router, monidjeu]);

    return {
        requiredQuantity: POT_CONFIG.quantity,
        availableQuantity,
        isSufficient,
        cardClasses,
        
        // États de chargement et d'erreurs unifiés
        loading: isWalletLoading || isSubmitLoading || isPendingNavigation,
        error: submitError ? getCategoryErrorMessage(submitError, 'Erreur lors de la soumission') : null,
        
        // Handlers d'action épurés pour l'UI
        handlePlayClick,
        handleMarketClick,
    };
}