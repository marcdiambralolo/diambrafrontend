import { Offering } from '@/lib/interfaces';
import { api } from '../client';

export const offeringsService = {
  list: async (): Promise<Offering[]> => {
    const response = await api.get<{ offerings: Offering[] }>('/offerings');
    return response.data.offerings;
  },
};

export default offeringsService;