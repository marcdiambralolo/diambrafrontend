import { User } from '@/lib/interfaces';
import { api } from '../client';
import { endpoints } from '../endpoints';

export interface GetConsultantsOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedConsultantsResult {
  consultants: User[];
  total: number;
  page: number;
  totalPages: number;
}

type UserPayload = User | { user?: User; data?: User; consultant?: User };

type ConsultantsPayload = {
  consultants?: unknown;
  users?: unknown;
  items?: unknown;
  data?: unknown;
  total?: unknown;
  page?: unknown;
  currentPage?: unknown;
  totalPages?: unknown;
  pagination?: {
    total?: unknown;
    page?: unknown;
    currentPage?: unknown;
    totalPages?: unknown;
  };
  meta?: {
    total?: unknown;
    page?: unknown;
    currentPage?: unknown;
    totalPages?: unknown;
  };
};

const DEFAULT_LIMIT = 6;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isUser(value: unknown): value is User {
  if (!isRecord(value)) return false;

  return typeof value.username === 'string'
    && typeof value.nom === 'string'
    && typeof value.prenoms === 'string'
    && typeof value.phone === 'string'
    && typeof value.country === 'string';
}

function toPositiveNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toUserArray(value: unknown): User[] {
  if (Array.isArray(value)) return value as User[];

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;

    if (Array.isArray(record.items)) return record.items as User[];
    if (Array.isArray(record.docs)) return record.docs as User[];
    if (Array.isArray(record.results)) return record.results as User[];
  }

  return [];
}

function pickFirstUserArray(...candidates: unknown[]): User[] {
  for (const candidate of candidates) {
    const users = toUserArray(candidate);
    if (users.length > 0) return users;
  }

  return [];
}

function normalizeConsultantsResponse(
  payload: ConsultantsPayload | User[],
  requestedPage: number,
  requestedLimit: number
): PaginatedConsultantsResult {
  const source = Array.isArray(payload) ? { consultants: payload } : payload;
  const items = pickFirstUserArray(source.consultants, source.users, source.items, source.data);

  const total = toPositiveNumber(
    source.total ?? source.pagination?.total ?? source.meta?.total,
    items.length
  );
  const page = toPositiveNumber(
    source.page ?? source.currentPage ?? source.pagination?.page ?? source.pagination?.currentPage ?? source.meta?.page ?? source.meta?.currentPage,
    requestedPage
  );
  const totalPages = Math.max(
    1,
    toPositiveNumber(
      source.totalPages ?? source.pagination?.totalPages ?? source.meta?.totalPages,
      Math.ceil(total / requestedLimit) || 1
    )
  );

  return {
    consultants: items,
    total,
    page,
    totalPages,
  };
}

function normalizeUserResponse(payload: UserPayload): User {
  if (isRecord(payload) && isUser(payload.user)) return payload.user;
  if (isRecord(payload) && isUser(payload.consultant)) return payload.consultant;
  if (isRecord(payload) && isUser(payload.data)) return payload.data;
  return payload as User;
}

export const usersService = {
  async getConsultants(options: GetConsultantsOptions = {}): Promise<PaginatedConsultantsResult> {
    const page = toPositiveNumber(options.page, 1);
    const limit = toPositiveNumber(options.limit, DEFAULT_LIMIT);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const response = await api.get<ConsultantsPayload | User[]>(`${endpoints.users.consultants}?${params.toString()}`, {
      timeout: 10000,
    });

    return normalizeConsultantsResponse(response.data, page, limit);
  },

  async getById(id: string): Promise<User> {
    const response = await api.get<UserPayload>(endpoints.users.byId(id), {
      timeout: 10000,
    });

    return normalizeUserResponse(response.data);
  },
};

export default usersService;