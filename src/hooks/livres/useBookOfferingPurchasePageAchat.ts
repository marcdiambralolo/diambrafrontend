import { useOfferingStepState } from '@/hooks/livres/useOfferingStepState';
import { api } from '@/lib/api/client';
import { walletService } from '@/lib/api/services';
import { getBookById, purchaseBookWithOffering } from '@/lib/api/services/books.service';
import { QUERY_KEYS } from '@/lib/cache/queryClient';
import type { Book, Offering, WalletOffering } from '@/lib/interfaces';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type PurchaseStep = 'offrandes' | 'succes';
type OfferingsResponse = {
    offerings?: Offering[];
};

export function useBookOfferingPurchasePageAchat(bookId: string) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [step, setStep] = useState<PurchaseStep>('offrandes');
    const [purchaseError, setPurchaseError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const [userOfferings, setUserOfferings] = useState<WalletOffering[]>([]);
    const [userOfferingsLoading, setUserOfferingsLoading] = useState(true);
    const [userOfferingsError, setUserOfferingsError] = useState<string | null>(null);

    const {
        data: offerings = [],
        isLoading: offeringsLoading,
        error: offeringsError
    } = useQuery<Offering[]>({
        queryKey: ['offerings'],
        queryFn: async () => {
            const res = await api.get<OfferingsResponse>('/offerings');
            return res.data.offerings || [];
        },
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 30,
    });

    const fetchUserOfferings = useCallback(async () => {
        setUserOfferingsLoading(true);
        setUserOfferingsError(null);
        try {
            const res = await walletService.getUnusedWalletOfferings();
            setUserOfferings(res);
        } catch {
            setUserOfferingsError('Erreur lors du chargement des offrandes utilisateur.');
            setUserOfferings([]);
        } finally {
            setUserOfferingsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserOfferings();
    }, [fetchUserOfferings]);

    const goToCatalog = useCallback(() => {
        router.push('/star/livres?_cb=' + Date.now());
    }, [router]);

    const goToLivre = useCallback(() => {
        router.push(`/star/livres/${bookId}/offrande`);
    }, [router, bookId]);

    const booksCache = queryClient.getQueryData<Book[]>(QUERY_KEYS.BOOKS);
    const cachedBook = booksCache?.find((item) => item._id === bookId || item.id === bookId) ?? null;

    const {
        data: book = null,
        isLoading: loading,
    } = useQuery<Book | null>({
        queryKey: QUERY_KEYS.BOOK_DETAIL(bookId),
        queryFn: () => getBookById(bookId),
        initialData: cachedBook,
        enabled: Boolean(bookId),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    });

    const walletOfferings = useMemo<WalletOffering[]>(
        () => {
            const newLocal = userOfferings
                .map((u) => ({
                    offeringId: String(u.offeringId ?? ''),
                    quantity: Number(u.quantity ?? 1),
                    name: u.name ?? '',
                    category: u.category ?? '',
                    price: u.price ?? 0,
                    illustrationUrl: u.illustrationUrl ?? '',
                }))
                .filter((w) => Boolean(w.offeringId));
            return newLocal;
        },
        [userOfferings],
    );

    const alternatives = useMemo(() => {
        const base = book?.offering?.alternatives ?? [];
        if (!base.length || !offerings.length) return base;
        return base.map((alt: any) => {
            const found = offerings.find((o: any) => String(o._id || o.id) === String(alt.offeringId));
            return {
                ...alt,
                illustrationUrl: found?.illustrationUrl || alt.illustrationUrl || null,
            };
        });
    }, [book, offerings]);

    const handleValidation = useCallback(
        async (selected: { offeringId: string; category: string; quantity: number }) => {
            setPurchaseError(null);
            setShowError(false);

            try {
                const response = await purchaseBookWithOffering(bookId, {
                    offeringId: selected.offeringId,
                    category: selected.category,
                    quantity: selected.quantity,
                });

                if (response.success !== true) {
                    throw new Error(response.message || "Erreur lors de l'achat.");
                }

                setStep('succes');
            } catch (err: unknown) {
                const msg =
                    (err as { response?: { data?: { message?: string } }; message?: string })
                        ?.response?.data?.message ??
                    (err as { message?: string })?.message ??
                    "Erreur lors de l'achat.";
                setPurchaseError(msg);
                setShowError(true);
            }
        },
        [bookId],
    );

    const clearError = useCallback(() => {
        setPurchaseError(null);
        setShowError(false);
    }, []);

    const state = useOfferingStepState(alternatives, walletOfferings, handleValidation);

    const [shareMessage, setShareMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!shareMessage) return;
        const t = window.setTimeout(() => setShareMessage(null), 2600);

        return () => window.clearTimeout(t);
    }, [shareMessage]);

    return {
        clearError, goToCatalog, goToLivre, userOfferingsError, state, book, errors: offeringsError, shareMessage, alternatives, offerings,
        loading: loading || userOfferingsLoading || offeringsLoading, step, purchaseError, showError, userOfferingsLoading, userOfferings,
    };
}