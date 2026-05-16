import { api } from '@/lib/api/client';
import { ConsultationChoice, Rubrique } from '@/lib/interfaces';

export async function updateConsultationChoice(rubriqueId: string, choiceId: string, update: Partial<ConsultationChoice>) {
  const res = await api.patch(`/rubriques/${rubriqueId}/consultation-choices/${choiceId}`, update);
  return res.data;
}

// Ajouter un choix de consultation à une rubrique
export async function addConsultationChoiceToRubrique(rubriqueId: string, data: { label: string; description: string }) {
  const res = await api.post(`/rubriques/${rubriqueId}/consultation-choices`, data);
  return res.data;
}

export async function getRubriques(): Promise<Rubrique[]> {
  const res = await api.get<Rubrique[]>('/rubriques');
  return Array.isArray(res.data) ? res.data : [];
}

export async function getRubrique(id: string): Promise<Rubrique & { consultations?: ConsultationChoice[] } | null> {
  try {
    const rubrique = await getRubriqueById(id);
    if (!rubrique) return null;
    return {
      ...rubrique, consultations: rubrique.consultationChoices || []
    };
  } catch {
    return null;
  }
}

export async function getRubriqueById(id: string): Promise<Rubrique> {
  const res = await api.get<Rubrique>(`/rubriques/${id}`);
  return res.data;
}  