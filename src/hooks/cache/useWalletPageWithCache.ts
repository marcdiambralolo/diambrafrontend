import { useUnusedOfferingsWithCache } from '@/hooks/cache/useUnusedOfferingsWithCache';
import { useWalletTransactionsWithCache } from '@/hooks/cache/useWalletTransactionsWithCache';
import { buildUrl } from '@/lib/functions';
import { Stats } from '@/lib/interfaces';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type SortOrder = 'newest' | 'oldest' | 'amount_high' | 'amount_low';
export type WalletTab = 'transactions' | 'unused-offerings';
type WalletContext = 'book' | 'consultation' | 'category' | 'home';

function getSafeTime(value?: string | null): number {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
}

function isWalletTab(value: string | null): value is WalletTab {
  return value === 'transactions' || value === 'unused-offerings';
}

export function useWalletPageWithCache() {
  const searchParams = useSearchParams();

  const consultationId = searchParams?.get('consultationId') || undefined;
  const categoryId = searchParams?.get('categoryId') || undefined;
  const bookId = searchParams?.get('bookId') || undefined;
  const tabFromUrl = searchParams?.get('tab');

  const [activeTab, setActiveTab] = useState<WalletTab>('unused-offerings');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    transactions: rawTransactions,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useWalletTransactionsWithCache();

  // Ajoute illustrationUrl à chaque item de chaque transaction si disponible dans item.offeringId
  const transactions = useMemo(() =>
    rawTransactions.map((tx) => {
      if (!Array.isArray(tx.items)) return tx;
      const items = tx.items.map((item) => {
        let illustrationUrl = undefined;
        if (typeof item.offeringId === 'object' && item.offeringId !== null && 'illustrationUrl' in item.offeringId) {
          illustrationUrl = item.offeringId.illustrationUrl;
        }
        return {
          ...item,
          illustrationUrl,
        };
      });
      return {
        ...tx,
        items,
      };
    })
  , [rawTransactions]);

  const {
    unusedOfferings,
    isLoading: isLoadingUnused,
    error: unusedError,
    refetch: refetchUnused,
  } = useUnusedOfferingsWithCache();

  useEffect(() => {
    if (isWalletTab(tabFromUrl!)) {
      setActiveTab(tabFromUrl!);
    }
  }, [tabFromUrl]);

  const stats = useMemo<Stats>(() => {
    const totalTransactions = transactions.length;
    const totalSpent = transactions.reduce((sum, transaction) => {
      const amount = Number(transaction.totalAmount || 0);
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    return {
      totalTransactions,
      totalSpent,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const list = [...transactions];

    list.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return getSafeTime(b.completedAt) - getSafeTime(a.completedAt);
        case 'oldest':
          return getSafeTime(a.completedAt) - getSafeTime(b.completedAt);
        case 'amount_high':
          return Number(b.totalAmount || 0) - Number(a.totalAmount || 0);
        case 'amount_low':
          return Number(a.totalAmount || 0) - Number(b.totalAmount || 0);
        default:
          return 0;
      }
    });

    return list;
  }, [transactions, sortOrder]);

  const dismissBanner = useCallback(() => {
    setShowSuccessBanner(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!transactions.length) return;

    try {
      const raw = window.localStorage.getItem('last_simulated_purchase');
      if (!raw) return;

      const purchaseData = JSON.parse(raw) as { transactionId?: string } | null;
      const targetId = purchaseData?.transactionId;

      if (!targetId) {
        window.localStorage.removeItem('last_simulated_purchase');
        return;
      }

      const exists = transactions.some(
        (transaction) => transaction.transactionId === targetId,
      );

      if (exists) {
        setShowSuccessBanner(true);
        window.localStorage.removeItem('last_simulated_purchase');
      }
    } catch {
      window.localStorage.removeItem('last_simulated_purchase');
    }
  }, [transactions]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      await Promise.allSettled([refetchTransactions(), refetchUnused()]);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchTransactions, refetchUnused]);

  const context = useMemo<WalletContext>(() => {
    if (bookId) return 'book';
    if (consultationId) return 'consultation';
    if (categoryId) return 'category';
    return 'home';
  }, [bookId, consultationId, categoryId]);

  const backLink = useMemo(() => {
    if (context === 'book' && bookId) {
      return {
        href: buildUrl(`/star/livres/${bookId}/achat`, {}),
        label: 'Retour au livre',
      };
    }

    if (context === 'consultation' && consultationId && categoryId) {
      return {
        href: buildUrl(`/star/category/${categoryId}/consulter`, { consultationId }),
        label: 'Retour à la consultation',
      };
    }

    if (context === 'consultation' && consultationId) {
      return {
        href: buildUrl(`/star/consultations/${consultationId}`, {}),
        label: 'Retour à la consultation',
      };
    }

    if (context === 'category' && categoryId) {
      return {
        href: buildUrl(`/star/category/${categoryId}`, {}),
        label: 'Retour à la catégorie',
      };
    }

    return {
      href: buildUrl(`/`, {}),
      label: "Retour à l'accueil",
      helper: "Retournez à l'accueil pour explorer d'autres services.",
    };
  }, [context, bookId, consultationId, categoryId]);

  const isLoadingCurrentTab = activeTab === 'transactions'
    ? isLoadingTransactions
    : isLoadingUnused;

  const isPageLoading = isLoadingTransactions || isLoadingUnused;

  return {
    setSortOrder, dismissBanner, onRefresh, setActiveTab,
    isLoading: isLoadingCurrentTab || isPageLoading || isLoadingUnused, backLink,
    sortOrder, activeTab, isRefreshing, showSuccessBanner,
    unusedError, unusedOfferings, stats, filteredTransactions,
  };
}