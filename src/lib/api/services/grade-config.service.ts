import { api } from '../client';
import {
  GradeConfig,
  CreateGradeConfigDto,
  UpdateGradeConfigDto,
  EnrichedGradeConfig,
} from '@/lib/types/grade-config.types';
import { ConsultationChoice } from '@/lib/interfaces';

/**
 * Erreur API avec message lisible
 */
class GradeConfigServiceError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'GradeConfigServiceError';
  }
}

function toGradeConfigServiceError(error: unknown, fallbackMessage: string): GradeConfigServiceError {
  if (typeof error === 'object' && error !== null) {
    const maybeError = error as {
      response?: { status?: number; data?: { message?: string } };
    };

    return new GradeConfigServiceError(
      maybeError.response?.status || 500,
      maybeError.response?.data?.message || fallbackMessage,
    );
  }

  return new GradeConfigServiceError(500, fallbackMessage);
}

/**
 * Service pour gérer la configuration des grades (admin)
 */
export const gradeConfigService = {
  /**
   * Récupérer tous les grades configurés
   */
  async getAllGradeConfigs(): Promise<GradeConfig[]> {
    try {
      const response = await api.get<GradeConfig[]>('/admin/grades');
      return (response.data || []).map((g: any) => ({
        ...g,
        _id: g._id || g.id || '',
        requirements: {
          consultations: g.requirements?.consultations ?? g.consultations ?? 0,
          rituels: g.requirements?.rituels ?? g.rituels ?? 0,
          livres: g.requirements?.livres ?? g.livres ?? 0,
        },
      }));
    } catch (error: unknown) {
      throw toGradeConfigServiceError(error, 'Erreur lors du chargement des grades');
    }
  },

  /**
   * Récupérer un grade par son ID
   */
  async getGradeConfigById(id: string): Promise<GradeConfig> {
    try {
      const response = await api.get<GradeConfig>(`/admin/grades/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw toGradeConfigServiceError(error, 'Erreur lors du chargement du grade');
    }
  },

  /**
   * Créer une nouvelle configuration de grade
   */
  async createGradeConfig(data: CreateGradeConfigDto): Promise<GradeConfig> {
    try {
      const response = await api.post<GradeConfig>('/admin/grades', data);
      return response.data;
    } catch (error: unknown) {
      throw toGradeConfigServiceError(error, 'Erreur lors de la création du grade');
    }
  },

  /**
   * Mettre à jour une configuration de grade
   * @param id - ID du grade
   * @param data - Données à mettre à jour (consultationChoiceIds, nextGradeId, description)
   * @throws GradeConfigServiceError avec codes spécifiques:
   *   - 400: Données invalides (IDs de choix invalides, nextGradeId invalide, niveau inférieur, boucle, etc)
   *   - 404: Grade introuvable
   *   - 403: Accès refusé (non admin)
   *   - 401: Non authentifié
   */
  async updateGradeConfig(id: string, data: UpdateGradeConfigDto): Promise<GradeConfig> {
    try {
      const response = await api.patch<GradeConfig>(`/admin/grades/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      const serviceError = toGradeConfigServiceError(error, 'Erreur lors de la mise à jour du grade');
      const statusCode = serviceError.statusCode;

      // Messages d'erreur spécifiques selon le statut
      let userMessage = serviceError.message;
      switch (statusCode) {
        case 400:
          userMessage = 'Les données envoyées sont invalides. Vérifiez les IDs des choix et le grade suivant.';
          break;
        case 404:
          userMessage = 'Le grade n\'existe pas.';
          break;
        case 403:
          userMessage = 'Vous n\'avez pas les permissions pour modifier les grades.';
          break;
        case 401:
          userMessage = 'Authentification requise.';
          break;
      }

      throw new GradeConfigServiceError(statusCode, userMessage);
    }
  },

  /**
   * Supprimer une configuration de grade
   */
  async deleteGradeConfig(id: string): Promise<void> {
    try {
      await api.delete(`/admin/grades/${id}`);
    } catch (error: unknown) {
      throw toGradeConfigServiceError(error, 'Erreur lors de la suppression du grade');
    }
  },

  /**
   * Récupérer tous les choix de consultations disponibles
   * Agrège ALL les choix de TOUTES les rubriques
   */
  async getAvailableConsultationChoices(): Promise<ConsultationChoice[]> {
    try {
      const response = await api.get<ConsultationChoice[]>('/admin/consultation-choices');
      return response.data;
    } catch (error: unknown) {
      throw toGradeConfigServiceError(error, 'Erreur lors du chargement des choix de consultations');
    }
  },

  /**
   * Réordonner les choix de consultations pour un grade
   * @param gradeId - ID du grade
   * @param choices - Liste ordonnée des choix: [{ choiceId, order }]
   */
  async reorderGradeChoices(
    gradeId: string,
    choices: Array<{ choiceId: string; order: number }>
  ): Promise<GradeConfig> {
    try {
      const response = await api.put<GradeConfig>(`/admin/grades/${gradeId}/reorder-choices`, { choices });
      return response.data;
    } catch (error: unknown) {
      throw toGradeConfigServiceError(error, 'Erreur lors du réordonnancement des choix');
    }
  },

  /**
   * Récupérer les grades avec informations enrichies
   */
  async getEnrichedGradeConfigs(): Promise<EnrichedGradeConfig[]> {
    try {
      const response = await api.get<EnrichedGradeConfig[]>('/admin/grades/enriched');
      return response.data;
    } catch (error: unknown) {
      throw toGradeConfigServiceError(error, 'Erreur lors du chargement des grades enrichis');
    }
  },

  /**
   * Mettre à jour le grade suivant
   * @param gradeId - ID du grade courant
   * @param nextGradeId - ID du grade suivant (null pour retirer)
   * @throws GradeConfigServiceError avec codes spécifiques:
   *   - 400: nextGradeId invalide, de niveau inférieur, ou créerait une boucle
   *   - 404: Grade introuvable
   */
  async updateNextGrade(gradeId: string, nextGradeId: string | null): Promise<GradeConfig> {
    try {
      const response = await api.patch<GradeConfig>(`/admin/grades/${gradeId}/next-grade`, { nextGradeId });
      return response.data;
    } catch (error: unknown) {
      const serviceError = toGradeConfigServiceError(error, 'Erreur lors de la mise à jour du grade suivant');
      const statusCode = serviceError.statusCode;

      let userMessage = serviceError.message;
      switch (statusCode) {
        case 400:
          userMessage = 'Le grade suivant est invalide ou créerait une boucle. Vérifiez le niveau.';
          break;
        case 404:
          userMessage = 'Le grade n\'existe pas.';
          break;
        case 403:
          userMessage = 'Vous n\'avez pas les permissions requises.';
          break;
      }

      throw new GradeConfigServiceError(statusCode, userMessage);
    }
  },
};

export { GradeConfigServiceError };
