
import type { Analysis, Consultation } from '@/lib/interfaces';
import { api } from '../client';
import { normalizeThreadResponse, type MessagingThreadResponse } from './messaging.service';

export interface PaginatedConsultationsResult {
  consultations: Consultation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AnalysisJobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | null;

export interface ConsultationFrontDataResult {
  success: boolean;
  consultation: Consultation | null;
  analysis: Analysis | null;
  analysisStatus: {
    consultationId: string;
    jobId: string;
    status: AnalysisJobStatus;
    attempts: number;
    errorMessage: string | null;
    startedAt: string | null;
    finishedAt: string | null;
    dateGeneration: string | null;
    hasResult: boolean;
  };
  messaging: MessagingThreadResponse | null;
}

type PaginatedConsultationsPayload = PaginatedConsultationsResult | Consultation[];

type ConsultationFrontDataPayload = {
  success?: boolean;
  consultation?: Consultation | null;
  analysis?: Analysis | null;
  analysisStatus?: unknown;
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

function normalizeAnalysisStatus(payload: unknown, consultationId: string): ConsultationFrontDataResult['analysisStatus'] {
  if (!isRecord(payload)) {
    return {
      consultationId,
      jobId: consultationId,
      status: null,
      attempts: 0,
      errorMessage: null,
      startedAt: null,
      finishedAt: null,
      dateGeneration: null,
      hasResult: false,
    };
  }

  const rawStatus = payload.status;
  const status =
    rawStatus === 'QUEUED' || rawStatus === 'PROCESSING' || rawStatus === 'COMPLETED' || rawStatus === 'FAILED'
      ? rawStatus
      : null;

  return {
    consultationId: typeof payload.consultationId === 'string' ? payload.consultationId : consultationId,
    jobId: typeof payload.jobId === 'string' ? payload.jobId : consultationId,
    status,
    attempts: toPositiveNumber(payload.attempts, 0),
    errorMessage: typeof payload.errorMessage === 'string' ? payload.errorMessage : null,
    startedAt: typeof payload.startedAt === 'string' ? payload.startedAt : null,
    finishedAt: typeof payload.finishedAt === 'string' ? payload.finishedAt : null,
    dateGeneration: typeof payload.dateGeneration === 'string' ? payload.dateGeneration : null,
    hasResult: payload.hasResult === true,
  };
}

function normalizeFrontData(payload: ConsultationFrontDataPayload, consultationId: string): ConsultationFrontDataResult {
  return {
    success: payload.success === true,
    consultation: payload.consultation ?? null,
    analysis: payload.analysis ?? null,
    analysisStatus: normalizeAnalysisStatus(payload.analysisStatus, consultationId),
    messaging: payload.messaging ? normalizeThreadResponse(payload.messaging) : null,
  };
}

export const consultationsService = {
  async getMine() {
    const response = await api.get<PaginatedConsultationsPayload>('/consultations/my');
    return normalizeConsultationsPayload(response.data, { page: 1, limit: 50 });
  },

  async getAssigned(page = 1, limit = 100) {
    const response = await api.get<PaginatedConsultationsPayload>('/consultations/assigned', {
      params: { page, limit },
    });

    return normalizeConsultationsPayload(response.data, { page, limit });
  },

  async getFrontData(consultationId: string): Promise<ConsultationFrontDataResult> {
    const response = await api.get<ConsultationFrontDataPayload>(`/consultations/${consultationId}/front-data`);
    return normalizeFrontData(response.data, consultationId);
  },
};

export default consultationsService;
