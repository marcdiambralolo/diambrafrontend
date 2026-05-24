import { User } from '@/lib/interfaces';
import { api } from '../client';
import { endpoints } from '../endpoints';

type UserPayload = User | { user?: User; data?: User; consultant?: User };

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

function normalizeUserResponse(payload: UserPayload): User {
  if (isRecord(payload) && isUser(payload.user)) return payload.user;
  if (isRecord(payload) && isUser(payload.consultant)) return payload.consultant;
  if (isRecord(payload) && isUser(payload.data)) return payload.data;
  return payload as User;
}

export const usersService = {

  async getById(id: string): Promise<User> {
    const response = await api.get<UserPayload>(endpoints.users.byId(id), {
      timeout: 10000,
    });

    return normalizeUserResponse(response.data);
  },
};

export default usersService;