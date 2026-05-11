import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Offering } from '@/lib/interfaces';

type OfferingsResponse = {
  offerings?: Offering[];
};

export function useOfferingsWithCache() {
  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
    isSuccess,
  } = useQuery<Offering[]>({
    queryKey: ['offerings'],
    queryFn: async () => {
      const response = await api.get<OfferingsResponse>('/offerings');
      if (response.status === 200 && response.data?.offerings) {
        return response.data.offerings.map((offering) => {
          const normalizedId = offering._id || offering.id;
          return {
            ...offering,
            _id: normalizedId,
            id: normalizedId,
          };
        });
      }
      return [];
    },
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 30,   // 30 min
  });

  return {
    offerings: data,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
  };
}
