import { api } from '../client';

export type MessagingBackendMessage = {
  id?: string;
  _id?: string;
  from?: 'client' | 'medium';
  text?: string;
  ts?: number;
  sentAt?: string;
  createdAt?: string;
  status?: 'sent' | 'delivered' | 'read';
};

export type MessagingThreadResponse = {
  success?: boolean;
  consultationId?: string;
  consultantId?: string;
  accessRole?: 'client' | 'consultant';
  messages?: MessagingBackendMessage[];
  unread?: {
    client?: number;
    consultant?: number;
  };
  lastMessage?: MessagingBackendMessage | null;
};

export type MessagingMutationResponse = {
  success?: boolean;
  consultationId?: string;
  message?: MessagingBackendMessage | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeMessage(payload: unknown): MessagingBackendMessage | null {
  if (!isRecord(payload)) {
    return null;
  }

  const text = typeof payload.text === 'string' ? payload.text : '';
  if (!text.trim()) {
    return null;
  }

  return {
    id: typeof payload.id === 'string' ? payload.id : undefined,
    _id: typeof payload._id === 'string' ? payload._id : undefined,
    from: payload.from === 'client' ? 'client' : 'medium',
    text,
    ts: typeof payload.ts === 'number' ? payload.ts : undefined,
    sentAt: typeof payload.sentAt === 'string' ? payload.sentAt : undefined,
    createdAt: typeof payload.createdAt === 'string' ? payload.createdAt : undefined,
    status:
      payload.status === 'read' || payload.status === 'delivered' || payload.status === 'sent'
        ? payload.status
        : 'sent',
  };
}

export function normalizeThreadResponse(payload: unknown): MessagingThreadResponse {
  if (!isRecord(payload)) {
    return { messages: [] };
  }

  const messages = Array.isArray(payload.messages)
    ? payload.messages.map(normalizeMessage).filter((message): message is MessagingBackendMessage => Boolean(message))
    : [];

  return {
    success: payload.success === true,
    consultationId: typeof payload.consultationId === 'string' ? payload.consultationId : undefined,
    consultantId: typeof payload.consultantId === 'string' ? payload.consultantId : undefined,
    accessRole: payload.accessRole === 'client' ? 'client' : payload.accessRole === 'consultant' ? 'consultant' : undefined,
    messages,
    unread: isRecord(payload.unread)
      ? {
          client: typeof payload.unread.client === 'number' ? payload.unread.client : 0,
          consultant: typeof payload.unread.consultant === 'number' ? payload.unread.consultant : 0,
        }
      : undefined,
    lastMessage: normalizeMessage(payload.lastMessage),
  };
}

function normalizeMutationResponse(payload: unknown): MessagingMutationResponse {
  if (!isRecord(payload)) {
    return { message: null };
  }

  return {
    success: payload.success === true,
    consultationId: typeof payload.consultationId === 'string' ? payload.consultationId : undefined,
    message: normalizeMessage(payload.message),
  };
}

export const messagingService = {
    /**
     * Envoie un message simple à un médium (pas de thread)
     */
    async sendSimpleMessage({ toConsultantId, text, subject, email, phone, fromUserId }: {
      toConsultantId: string;
      text: string;
      subject?: string;
      email?: string;
      phone?: string;
      fromUserId: string;
    }): Promise<{ success: boolean; message: any }> {
      const response = await api.post('/messaging/simple-message', {
        toUserId: toConsultantId,
        text,
        subject,
        email,
        phone,
        fromUserId,
      });
      return response.data as { success: boolean; message: any };
    },
  async getClientThread(consultantId: string): Promise<MessagingThreadResponse> {
    const response = await api.get<unknown>(`/consultation-messages/consultants/${consultantId}/thread`);
    return normalizeThreadResponse(response.data);
  },

  async sendClientMessage(consultantId: string, text: string): Promise<MessagingMutationResponse> {
    const response = await api.post<unknown>(`/consultation-messages/consultants/${consultantId}/messages`, { text });
    return normalizeMutationResponse(response.data);
  },

  async getConsultationThread(consultationId: string): Promise<MessagingThreadResponse> {
    const response = await api.get<unknown>(`/consultation-messages/consultations/${consultationId}`);
    return normalizeThreadResponse(response.data);
  },

  async sendConsultationMessage(consultationId: string, text: string): Promise<MessagingMutationResponse> {
    const response = await api.post<unknown>(`/consultation-messages/consultations/${consultationId}/messages`, { text });
    return normalizeMutationResponse(response.data);
  },
};

export default messagingService;
