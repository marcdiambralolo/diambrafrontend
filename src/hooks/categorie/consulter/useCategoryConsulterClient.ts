import {
    createCategoryConsultation, getCategoryErrorMessage,
    getCreatedConsultationDestination, type CategoryContextInfo,
} from '@/hooks/categorie/categoryConsultation.shared';
import { getChoiceAlternatives } from '@/lib/api/services/alternatives.service';
import { walletService } from '@/lib/api/services/wallet.service';
import { QUERY_KEYS, queryClient } from '@/lib/cache/queryClient';
import { buildCategoryConsultationPath } from '@/lib/consultations/navigation';
import type { WalletOffering } from '@/lib/interfaces';
import { OfferingAlternative } from '@/lib/interfaces';
import { useAuthStore } from '@/lib/store/auth.store';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type Category = 'animal' | 'vegetal' | 'beverage';

type ConsultationLike = {
    title?: string;
    alternatives?: OfferingAlternative[];
};

export function useCategoryConsulterClient() {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);

    const category = useMonEtoileStore((s) => s.category);
    const rubriqueEnCours = useMonEtoileStore((s) => s.rubriqueEnCours);
    const choixConsultationEnCours = useMonEtoileStore((s) => s.choixConsultationEnCours);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [walletOfferings, setWalletOfferings] = useState<WalletOffering[]>([]);
    const [showError, setShowError] = useState(false);

    const contextInfo: CategoryContextInfo = useMemo(() => ({
        rubrique: rubriqueEnCours ?? undefined,
        choix: (choixConsultationEnCours as any)?.choice ?? undefined,
    }), [rubriqueEnCours, choixConsultationEnCours]);

    const handleGoToMarket = useCallback(() => {
        const params = new URLSearchParams();
        if (choixConsultationEnCours?._id) params.set('consultationId', choixConsultationEnCours?._id);
        if (category?._id) params.set('categoryId', category?._id);

        const url = `/star/marcheoffrandes${params.toString() ? `?${params.toString()}` : ''}`;
        router.push(url);
    }, [(choixConsultationEnCours?._id), (category?._id), router]);

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
            if (!category || !rubriqueEnCours || !choixConsultationEnCours) {
                throw new Error('Données manquantes pour la création de la consultation');
            }
            const choice = (choixConsultationEnCours as any)?.choice ?? choixConsultationEnCours;
            const id = await createCategoryConsultation({
                category,
                rubrique: rubriqueEnCours,
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

            // Redirection conditionnelle selon la présence d'un PDF
            const hasPdf = choice && typeof choice === 'object' && 'pdfFile' in choice && choice.pdfFile;
            const segment = hasPdf ? 'documentpdf' : 'genereanalyse';
            router.push(buildCategoryConsultationPath(category._id, segment, {
                consultationId: id,
                rubriqueId: rubriqueEnCours._id || '',
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
    }, [category, rubriqueEnCours, choixConsultationEnCours, user, router]);

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
            categoryId: category?._id ?? '',
            consultationId: choixConsultationEnCours._id,
            rubriqueId: rubriqueEnCours?._id ?? '',
            choiceId: choixConsultationEnCours._id,
            consultationType: (choixConsultationEnCours as any)?.type || null,
            refreshToken: Date.now(),
        }));
    }, [category?._id, choixConsultationEnCours, rubriqueEnCours?._id, router]);


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

    type CategoryType = 'animal' | 'vegetal' | 'beverage';
    const [activeTab, setActiveTab] = useState<CategoryType>('animal');
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
            animal: [],
            vegetal: [],
            beverage: []
        };
        alternatives.forEach(off => {
            grouped[off.category].push(off);
        });
        return grouped;
    }, [alternatives]);

    const categoryCounts = useMemo(() => ({
        animal: offeringsByCategory.animal.length,
        vegetal: offeringsByCategory.vegetal.length,
        beverage: offeringsByCategory.beverage.length
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
    
    return {
        consultation: choixConsultationEnCours as ConsultationLike | null,
        clearError, contextInfo, title: category?.nom || "Categorie", showError, walletOfferings, dataLoading: loading,
        dataError: error, state, currentError: showError ? error : null,
        handleGoToMarket, handleValidation,
    };
}