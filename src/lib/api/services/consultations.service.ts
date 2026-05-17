import type { Consultation } from '@/lib/interfaces';
import { api } from '../client';
import { normalizeThreadResponse, type MessagingThreadResponse } from './messaging.service';

export interface PaginatedConsultationsResult {
  consultations: Consultation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ConsultationFrontDataResult {
  success: boolean;
  consultation: Consultation | null;
  messaging: MessagingThreadResponse | null;
}

type PaginatedConsultationsPayload = PaginatedConsultationsResult | Consultation[];

type ConsultationFrontDataPayload = {
  success?: boolean;
  consultation?: Consultation | null;
  messaging?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toPositiveNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeConsultationsPayload(payload: PaginatedConsultationsPayload, defaults?: Partial<PaginatedConsultationsResult>): PaginatedConsultationsResult {
  const record = isRecord(payload) ? payload : null;
  const consultations = Array.isArray(record?.consultations)
    ? record.consultations
    : Array.isArray(payload)
      ? payload
      : [];
  const defaultLimit = (defaults?.limit ?? consultations.length) || 1;

  const page = toPositiveNumber(record?.page, defaults?.page ?? 1);
  const limit = toPositiveNumber(record?.limit, defaultLimit);
  const total = toPositiveNumber(record?.total, defaults?.total ?? consultations.length);
  const defaultTotalPages = (defaults?.totalPages ?? Math.ceil(total / limit)) || 1;
  const totalPages = Math.max(1, toPositiveNumber(record?.totalPages, defaultTotalPages));

  return {
    consultations,
    total,
    page,
    limit,
    totalPages,
  };
}

function normalizeFrontData(payload: ConsultationFrontDataPayload, consultationId: string): ConsultationFrontDataResult {
  return {
    success: payload.success === true,
    consultation: payload.consultation ?? null,
    messaging: payload.messaging ? normalizeThreadResponse(payload.messaging) : null,
  };
}

export const consultationsService = {
  async getMine() {
    const response = await api.get<PaginatedConsultationsPayload>('/consultations/me');
    return normalizeConsultationsPayload(response.data, { page: 1, limit: 50 });
  },

  async getFrontData(consultationId: string): Promise<ConsultationFrontDataResult> {
    const response = await api.get<ConsultationFrontDataPayload>(`/consultations/${consultationId}/front-data`);
    return normalizeFrontData(response.data, consultationId);
  },
};

export default consultationsService;