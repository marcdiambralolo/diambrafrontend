import { api } from '@/lib/api/client';

export interface ConsultationChoiceStatusDto {
  choiceId: string;
  choiceTitle: string;
  buttonStatus: 'CONSULTER' | 'RÉPONSE EN ATTENTE' | "VOIR L'ANALYSE";
  hasActiveConsultation: boolean;
  consultationId: string | null;
}

export interface UserConsultationChoicesStatusDto {
  choices: ConsultationChoiceStatusDto[];
}

export async function getChoiceStatus(choiceId: string): Promise<ConsultationChoiceStatusDto> {
  const response = await api.get<ConsultationChoiceStatusDto>(`/consultation-choice-status/me/${choiceId}`);
  return response.data;
}

export async function getUserChoicesStatus(choiceIds?: string[]): Promise<UserConsultationChoicesStatusDto> {
  const params = choiceIds && choiceIds.length > 0 
    ? `?choiceIds=${choiceIds.join(',')}` 
    : '';
  const response = await api.get<UserConsultationChoicesStatusDto>(`/consultation-choice-status/me${params}`);
  return response.data;
}