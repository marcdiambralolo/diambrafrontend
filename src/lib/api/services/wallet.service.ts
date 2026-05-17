import type { OfferingDetails, Transaction, WalletOffering } from '@/lib/interfaces';
import { api } from '../client';

export interface UnusedOfferingStock {
  offeringId: string;
  quantity: number;
  offering: OfferingDetails | null;
  name: string;
  price: number;
}

type TransactionsResponse = {
  transactions?: Transaction[];
};

type RawUnusedOfferingStock = {
  offeringId?: string;
  quantity?: number;
  offering?: Partial<OfferingDetails> | null;
  name?: string;
  price?: number;
};

type UnusedOfferingsResponse = RawUnusedOfferingStock[] | { offerings?: RawUnusedOfferingStock[] };

export interface ValidateConsultationOfferingsResult {
  success: boolean;
  message: string;
  consultationId?: string;
  consultationStatus?: string;
  consumedOfferings: Array<{
    offeringId: string;
    quantity: number;
    remainingQuantity?: number;
  }>;
}

function normalizeOfferingDetails(value: RawUnusedOfferingStock): OfferingDetails | null {
  const offering = value.offering;
  const offeringId = typeof value.offeringId === 'string'
    ? value.offeringId
    : typeof offering?._id === 'string'
      ? offering._id
      : '';

  if (!offeringId) {
    return null;
  }

  return {
    _id: offeringId,
    name: offering?.name || value.name || '  inconnue',
    price: typeof offering?.price === 'number' ? offering.price : typeof value.price === 'number' ? value.price : 0,
  };
}

function normalizeUnusedOffering(value: RawUnusedOfferingStock): UnusedOfferingStock {
  const offering = normalizeOfferingDetails(value);

  return {
    offeringId: offering?._id || '',
    quantity: typeof value.quantity === 'number' ? value.quantity : 0,
    offering,
    name: offering?.name || '  inconnue',
    price: offering?.price || 0,
  };
}

export function toWalletOffering(offering: UnusedOfferingStock): WalletOffering {
  return {
    offeringId: offering.offeringId,
    quantity: offering.quantity,
    name: offering.name,
    price: offering.price,
  };
}

export const walletService = {
  async getTransactions(): Promise<Transaction[]> {
    const response = await api.get<Transaction[] | TransactionsResponse>('/wallet/transactions', {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
      },
    });

    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    }

    if (response.status === 200 && Array.isArray(data.transactions)) {
      return data.transactions;
    }

    return [];
  },

  async getUnusedOfferings(): Promise<UnusedOfferingStock[]> {
    const response = await api.get<UnusedOfferingsResponse>('/offering-stock/available');
    const data = response.data;

    if (response.status === 200 && Array.isArray(data)) {
      return data.map(normalizeUnusedOffering);
    }

    if (response.status === 200 && !Array.isArray(data) && Array.isArray(data.offerings)) {
      return data.offerings.map(normalizeUnusedOffering);
    }

    return [];
  },

  async getUnusedWalletOfferings(): Promise<WalletOffering[]> {
    const offerings = await this.getUnusedOfferings();
    return offerings.map(toWalletOffering);
  },

  async validateConsultationOfferings(
    consultationId: string,
    offerings: Array<{ offeringId: string; quantity: number }>,
  ): Promise<ValidateConsultationOfferingsResult> {
    const response = await api.post<Partial<ValidateConsultationOfferingsResult>>(
      `/wallet/consultations/${consultationId}/validate-offerings`,
      { offerings },
    );

    return {
      success: response.data?.success === true,
      message: response.data?.message || '',
      consultationId: response.data?.consultationId,
      consultationStatus: response.data?.consultationStatus,
      consumedOfferings: Array.isArray(response.data?.consumedOfferings) ? response.data.consumedOfferings : [],
    };
  },
};

export default walletService;