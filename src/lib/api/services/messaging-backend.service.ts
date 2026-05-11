import { api } from '../client';

export type Message = {
  _id?: string;
  conversationId: string;
  from: string;
  to: string;
  text: string;
  status?: 'sent' | 'delivered' | 'read';
  createdAt?: string;
  updatedAt?: string;
};

export const messagingBackendService = {
  async getConversations(userId: string) {
    const res = await api.get(`/messaging/conversations/${userId}`);
    return res.data;
  },
  async getMessages(conversationId: string, { limit = 30, skip = 0 } = {}) {
    const res = await api.get(`/messaging/messages/${conversationId}`, { data: { limit, skip } });
    return res.data;
  },
  async sendMessage(data: { conversationId: string; from: string; to: string; text: string }) {
    const res = await api.post(`/messaging/send`, data);
    return res.data;
  },
  async markAsRead(conversationId: string, userId: string) {
    const res = await api.post(`/messaging/messages/${conversationId}/read`, { userId });
    return res.data;
  },
};
