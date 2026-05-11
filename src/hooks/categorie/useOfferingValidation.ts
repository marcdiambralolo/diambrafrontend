import { useState, useCallback } from 'react';
import { getCategoryErrorMessage } from '@/hooks/categorie/categoryConsultation.shared';
import { QUERY_KEYS, queryClient } from '@/lib/cache/queryClient';
import type { OfferingAlternative } from '@/lib/interfaces';
import { useRouter } from 'next/navigation';
import { walletService } from '@/lib/api/services';
import { buildCategoryConsultationPath } from '@/lib/consultations/navigation';

interface UseOfferingValidationParams {
    consultationId: string;
    categoryId: string;
    rubriqueId?: string | null;
    choiceId?: string | null;
}

interface UseOfferingValidationReturn {
    loading: boolean;
    error: string | null;
    showError: boolean;
    handleValidation: (selectedAlternative: OfferingAlternative) => Promise<void>;
    clearError: () => void;
}

export function useOfferingValidation({
    consultationId,
    categoryId,
    rubriqueId,
    choiceId,
}: UseOfferingValidationParams): UseOfferingValidationReturn {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);

    const handleValidation = useCallback(async (selectedAlternative: OfferingAlternative) => {
        setLoading(true);
        setError(null);
        setShowError(false);

        try {
            const consumeRes = await walletService.validateConsultationOfferings(consultationId, [{
                offeringId: selectedAlternative.offeringId,
                quantity: selectedAlternative.quantity
            }]);

            if (consumeRes.success !== true) {
                throw new Error(consumeRes.message || 'Erreur lors de la consommation');
            }

            queryClient.removeQueries({ queryKey: QUERY_KEYS.WALLET_TRANSACTIONS, exact: true });
            queryClient.removeQueries({ queryKey: QUERY_KEYS.WALLET_UNUSED_OFFERINGS, exact: true });

            router.push(buildCategoryConsultationPath(categoryId, 'genereanalyse', {
                consultationId,
                rubriqueId,
                choiceId,
                r: Date.now(),
            }));
        } catch (err: unknown) {
            console.error('❌ Error validating offerings:', err);
            const errorMsg = getCategoryErrorMessage(err, 'Erreur lors de la validation');
            setError(errorMsg);
            setShowError(true);
        } finally {
            setLoading(false);
        }
    }, [choiceId, consultationId, categoryId, router, rubriqueId]);

    const clearError = useCallback(() => {
        setShowError(false);
        setError(null);
    }, []);

    return { loading, error, showError, handleValidation, clearError };
}