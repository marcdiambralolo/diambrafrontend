import { useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { createCategoryConsultation } from '@/hooks/categorie/categoryConsultation.shared';
import { api } from '@/lib/api/client';
import { walletService } from '@/lib/api/services/wallet.service';
import { QUERY_KEYS, queryClient } from '@/lib/cache/queryClient';
import type { Consultation, OfferingAlternative } from '@/lib/interfaces';

const getOfferingId = (alternative: OfferingAlternative): string => {
    const offeringId = alternative.offeringId;
    if (offeringId && typeof offeringId === 'object' && '_id' in offeringId) {
        return (offeringId as { _id: string })._id;
    }
    return offeringId as string;
};

export function useGameSubmission(
    monidjeu: string | null,
    combinaison: string,
    formattedTime: string,
    potConfig: OfferingAlternative,
    updateGameState: (updater: any) => void,
    setWalletState: (updater: any) => void
) {
    const router = useRouter();
    const [, startTransition] = useTransition();
    const isMountedRef = useRef(true);

    const handleSubmitAndNavigate = useCallback(async () => {
        updateGameState({ isSubmitting: true });
        setWalletState((prev: any) => ({ ...prev, loading: true, error: null, showError: false }));

        try {
            const consultationId = await createCategoryConsultation(monidjeu || '');
            if (!consultationId) throw new Error('Impossible de créer la consultation');

            const consumeRes = await walletService.validateConsultationOfferings(consultationId, [{
                offeringId: getOfferingId(potConfig),
                quantity: potConfig.quantity,
            }]);

            if (!consumeRes.success) {
                throw new Error(consumeRes.message || 'Erreur lors de la consommation');
            }

            queryClient.removeQueries({ queryKey: QUERY_KEYS.WALLET_TRANSACTIONS, exact: true });
            queryClient.removeQueries({ queryKey: QUERY_KEYS.WALLET_UNUSED_OFFERINGS, exact: true });

            const { data } = await api.get(`/consultations/${consultationId}`);
            const payload = {
                ...(data as Consultation),
                combinaison,
                timeSpent: formattedTime,
            };

            await api.put(`/consultations/${consultationId}`, payload);

            startTransition(() => {
                if (monidjeu) {
                    router.push(`/star/monprofil/${monidjeu}`);
                } else {
                    router.push(`/star/monprofil?gameId=${consultationId}`);
                }
            });
        } catch (error: any) {
            console.error('Error saving consultation:', error);
        } finally {
            if (isMountedRef.current) {
                updateGameState({ isSubmitting: false });
                setWalletState((prev: any) => ({ ...prev, loading: false }));
            }
        }
    }, [monidjeu, combinaison, formattedTime, potConfig, router, updateGameState, setWalletState]);

    return { handleSubmitAndNavigate };
}