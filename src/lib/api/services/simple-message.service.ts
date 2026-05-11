// ...existing code (une seule déclaration import/type/export) ...
import { api } from "../client";

export type SimpleMessage = {
  _id?: string;
  fromUserId: string;
  toUserId: string;
  text: string;
  subject?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
};

export const simpleMessageService = {
  async getInbox(userId: string): Promise<SimpleMessage[]> {
    const res = await api.get(`/messaging/simple-messages/${userId}`);
    return res.data as SimpleMessage[];
  },

  /**
   * Envoie un message simple à un utilisateur
   */
  async sendSimpleMessage({ toUserId, fromUserId, text, subject, email, phone }: {
    toUserId: string;
    fromUserId: string;
    text: string;
    subject?: string;
    email?: string;
    phone?: string;
  }): Promise<{ success: boolean; message: SimpleMessage }> {
    const res = await api.post('/messaging/simple-message', {
      toUserId,
      fromUserId,
      text,
      subject,
      email,
      phone,
    });
    return res.data as { success: boolean; message: SimpleMessage };
  },
  async deleteMessage(messageId: string): Promise<{ success: boolean }> {
    const res = await api.delete(`/messaging/simple-message/${messageId}`);
    return res.data as { success: boolean };
  }
};
