import { api } from '../client';
import type { Analysis, Consultation } from '@/lib/interfaces';

export interface AnalysisByChoiceResponse {
  success: boolean;
  choiceId: string;
  total: number;
  consultations: Consultation[];
}

export const analysesService = {
  // Créer une analyse
  create: async (consultationId: string, texte: string): Promise<Analysis | null> => {
    const res = await api.post<Analysis | null>('/analyses', { consultationId, texte });
    return res.data;
  },

  list: async (): Promise<Analysis[]> => {
    const res = await api.get<Analysis[]>('/analyses');
    return res.data;
  },

  // Récupérer une analyse par son id
  get: async (id: string): Promise<Analysis | null> => {
    const res = await api.get<Analysis | null>(`/analyses/${id}`);
    return res.data;
  },

  // Mettre à jour le texte d'une analyse
  update: async (id: string, texte: string): Promise<Analysis | null> => {
    const res = await api.put<Analysis | null>(`/analyses/${id}`, { texte });
    return res.data;
  },

 
  remove: async (id: string): Promise<Analysis | null> => {
    const res = await api.delete<Analysis | null>(`/analyses/${id}`);
    return res.data;
  },

  // Récupérer toutes les analyses pour un choiceId donné
  getByChoice: async (choiceId: string): Promise<AnalysisByChoiceResponse> => {
    const res = await api.get<AnalysisByChoiceResponse>(`/analyses/by-choice/${choiceId}`);
    return res.data;
  },
};
