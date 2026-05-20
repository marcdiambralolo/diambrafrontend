import { useUnusedOfferingsWithCache } from '@/hooks/cache/useUnusedOfferingsWithCache';
import { useWalletTransactionsWithCache } from '@/hooks/cache/useWalletTransactionsWithCache';
import { buildUrl } from '@/lib/functions';
import { Stats } from '@/lib/interfaces';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type SortOrder = 'newest' | 'oldest' | 'amount_high' | 'amount_low';
export type WalletTab = 'transactions' | 'unused-offerings';

const SORT_FUNCTIONS: Record<SortOrder, (a: any, b: any) => number> = {
  newest: (a, b) => getSafeTime(b.completedAt) - getSafeTime(a.completedAt),
  oldest: (a, b) => getSafeTime(a.completedAt) - getSafeTime(b.completedAt),
  amount_high: (a, b) => Number(b.totalAmount || 0) - Number(a.totalAmount || 0),
  amount_low: (a, b) => Number(a.totalAmount || 0) - Number(b.totalAmount || 0),
};

const WALLET_TABS: WalletTab[] = ['transactions', 'unused-offerings'];

function getSafeTime(value?: string | null): number {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
}

function isWalletTab(value: string | null): value is WalletTab {
  return WALLET_TABS.includes(value as WalletTab);
}

function computeStats(transactions: any[]): Stats {
  const totalTransactions = transactions.length;
  const totalSpent = transactions.reduce((sum, transaction) => {
    const amount = Number(transaction.totalAmount || 0);
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  return { totalTransactions, totalSpent };
}

export function useWalletPageWithCache() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams?.get('tab');
  const [activeTab, setActiveTab] = useState<WalletTab>('unused-offerings');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    transactions: rawTransactions,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useWalletTransactionsWithCache();

  const {
    unusedOfferings,
    isLoading: isLoadingUnused,
    error: unusedError,
    refetch: refetchUnused,
  } = useUnusedOfferingsWithCache();

  useEffect(() => {
    if (isWalletTab(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const stats = useMemo(() => computeStats(rawTransactions), [rawTransactions]);

  const filteredTransactions = useMemo(() => {
    const sortFn = SORT_FUNCTIONS[sortOrder];
    return [...rawTransactions].sort(sortFn);
  }, [rawTransactions, sortOrder]);

  const isLoadingCurrentTab = activeTab === 'transactions'
    ? isLoadingTransactions
    : isLoadingUnused;

  const isPageLoading = isLoadingTransactions || isLoadingUnused;

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.allSettled([refetchTransactions(), refetchUnused()]);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchTransactions, refetchUnused]);

  const backLink = useMemo(() => ({
    href: buildUrl('/star/profil', {}),
    label: "Retour à l'accueil",
    helper: "Retournez à l'accueil.",
  }), []);

  return { 
    onRefresh, setSortOrder, setActiveTab,
    isLoading: isLoadingCurrentTab || isPageLoading, backLink,
    unusedError, unusedOfferings, stats, sortOrder, filteredTransactions,
    activeTab, isRefreshing,  
  };
}