// PATCH d'un choix de consultation (gradeId, etc)
export async function updateConsultationChoice(rubriqueId: string, choiceId: string, update: Partial<ConsultationChoice>) {
  const res = await api.patch(`/rubriques/${rubriqueId}/consultation-choices/${choiceId}`, update);
  return res.data;
}
import { api } from '@/lib/api/client';
import { isFreeCinqPortesConsultation } from '@/lib/consultations/isFreeCinqPortes';
import { Consultation, ConsultationChoice, ConsultationOffering, Rubrique } from '@/lib/interfaces';

// Ajouter un choix de consultation à une rubrique
export async function addConsultationChoiceToRubrique(rubriqueId: string, data: { label: string; description: string }) {
  const res = await api.post(`/rubriques/${rubriqueId}/consultation-choices`, data);
  return res.data;
}

// ─── Rubrique CRUD ────────────────────────────────────────────

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

export async function reorderConsultationChoices(
  rubriqueId: string,
  choices: Array<{ choiceId: string; order: number }>
): Promise<Rubrique> {
  const res = await api.put<Rubrique>(
    `/rubriques/${rubriqueId}/reorder-choices`,
    { choices }
  );
  return res.data;
}

export interface ConsultationChoiceWithCount {
  _id: string;
  title: string;
  description: string;
  frequence: string;
  participants: string;
  order?: number;
  offering: ConsultationOffering;
  consultationCount: number;
  showButtons: boolean;
}

export interface RubriqueWithCount {
  _id: string;
  titre: string;
  description: string;
  categorie: string;
  typeconsultation: string;
  consultationChoices: ConsultationChoiceWithCount[];
}

export async function getRubriqueWithConsultationCount(
  rubriqueId: string
): Promise<RubriqueWithCount> {
  const res = await api.get<RubriqueWithCount>(
    `/rubriques/${rubriqueId}/choices-with-count`
  );
  return res.data;
}

// ─── Choices & consultations par rubrique ─────────────────────

export async function getChoicesWithCount(rubriqueId: string): Promise<Rubrique> {
  const response = await api.get<Rubrique>(`/rubriques/${rubriqueId}/choices-with-count`);
  return response.data;
}

type RubriqueConsultationsResponse = {
  consultations?: Consultation[];
};

const EXCLUDED_CONSULTATION_TITLES = ['5 portes', 'la carte'] as const;
const DISPLAYABLE_STATUSES = ['PENDING', 'PROCESSING', 'GENERATING', 'COMPLETED', 'FAILED', 'ERROR'] as const;
const HIDDEN_STATUSES = ['AWAITING_PAYMENT', 'CANCELLED', 'REFUNDED'] as const;

function shouldKeepConsultation(consultation: Consultation) {
  if (typeof consultation.title !== 'string') {
    return false;
  }
  const normalizedTitle = consultation.title.toLowerCase();
  return !EXCLUDED_CONSULTATION_TITLES.some((term) => normalizedTitle.includes(term));
}

function hasAnalysisArtifacts(consultation: Consultation) {
  return Boolean(
    consultation.dateGeneration
    || consultation.completedAt
    || consultation.completedDate
    || consultation.analysisNotified
    || consultation.pdfFile
    || consultation.result
  );
}

function shouldDisplayRubriqueConsultation(consultation: Consultation) {
  if (!shouldKeepConsultation(consultation)) {
    return false;
  }
  const normalizedStatus = String(consultation.status ?? '').toUpperCase();
  const isFreeCinqPortes = isFreeCinqPortesConsultation(consultation);
  const isPaid = isFreeCinqPortes || consultation.isPaid === true || Boolean(consultation.paymentId);

  if (hasAnalysisArtifacts(consultation)) {
    return true;
  }
  if (!isFreeCinqPortes && HIDDEN_STATUSES.includes(normalizedStatus as typeof HIDDEN_STATUSES[number])) {
    return false;
  }
  if (!isPaid) {
    return false;
  }
  return DISPLAYABLE_STATUSES.includes(normalizedStatus as typeof DISPLAYABLE_STATUSES[number]);
}

export async function getConsultationsByRubrique(rubriqueId: string): Promise<any[]> {
  const response = await api.get<RubriqueConsultationsResponse>(`/rubriques/${rubriqueId}`);
   const result = response.data?.consultations;
  if (!Array.isArray(result)) {
    return [];
  }

  return result.filter(shouldDisplayRubriqueConsultation);
}

export async function getDoorsConsultations(): Promise<Consultation[]> {
  const response = await api.get<Consultation>('/consultations/rubrique/694acf59bd12675f59e7a7f2');
  const result = response.data?.consultations;
  if (!Array.isArray(result)) {
    return [];
  }

  return result;
}

export async function getRubriqueCinqEtoiles(): Promise<any[]> {
  const response = await api.get<any>('/rubriques/cinqetoiles');
   const result = response.data?.consultationChoices;
  if (!Array.isArray(result)) {
    return [];
  }
  return result;

}