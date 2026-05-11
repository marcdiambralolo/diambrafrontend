import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/cache/queryClient';
import { walletService, type UnusedOfferingStock } from '@/lib/api/services/wallet.service';

function getErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return 'Erreur inconnue';
}

export function useUnusedOfferingsWithCache() {
  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
    isSuccess,
  } = useQuery<UnusedOfferingStock[]>({
    queryKey: QUERY_KEYS.WALLET_UNUSED_OFFERINGS,
    queryFn: () => walletService.getUnusedOfferings(),
    staleTime: 1000*2, // 2 seconds
    gcTime: 1000 *2,   // 2 seconds
  });

  return {
    unusedOfferings: data,
    isLoading,
    isError,
    isSuccess,
    error: getErrorMessage(error),
    refetch,
  };
}
