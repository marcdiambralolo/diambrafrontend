import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/cache/queryClient';
import { walletService } from '@/lib/api/services';
import { Transaction } from '@/lib/interfaces';

export function useWalletTransactionsWithCache() {
  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
    isSuccess,
  } = useQuery<Transaction[]>({
    queryKey: QUERY_KEYS.WALLET_TRANSACTIONS,
    queryFn: () => walletService.getTransactions(),
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 30,   // 30 min
  });

  return {
    transactions: data,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
  };
}
