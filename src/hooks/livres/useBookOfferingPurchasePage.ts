import { getBookById } from '@/lib/api/services/books.service';
import { QUERY_KEYS } from '@/lib/cache/queryClient';
import type { Book } from '@/lib/interfaces';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export function useBookOfferingPurchasePage(bookId: string) {
    const queryClient = useQueryClient();
    const router = useRouter();

    const [shareMessage, setShareMessage] = useState<string | null>(null);

    const startPurchase = useCallback(() => {
        router.push(`/star/livres/${bookId}/achat`);
    }, [router, bookId]);

    const goToCatalog = useCallback(() => {
        router.push("/star/livres?_cb=");
    }, [router]);

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

    useEffect(() => {
        if (!shareMessage) return;
        const t = window.setTimeout(() => setShareMessage(null), 2600);
        return () => window.clearTimeout(t);
    }, [shareMessage]);

    const handleShare = useCallback(async () => {
        const title = String(book?.title ?? 'Livre');
        const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

        try {
            const shareData = {
                title: `Découvre ce livre : ${title}`,
                text: `Je te recommande le livre “${title}” sur Mon Étoile !`,
                url: shareUrl,
            };

            if (typeof navigator !== 'undefined' && navigator.share) {
                await navigator.share(shareData);
                setShareMessage('Lien partagé avec succès.');
                return;
            }
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                await navigator.clipboard.writeText(shareUrl);
                setShareMessage('Lien copié dans le presse-papier.');
                return;
            }

            setShareMessage('Le partage n’est pas disponible sur cet appareil.');
        } catch {
            setShareMessage('Partage annulé ou indisponible.');
        }
    }, [book?.title]);

    return {
        book, loading, shareMessage, goToCatalog, startPurchase, handleShare,
    };
}