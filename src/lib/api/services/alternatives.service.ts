import { api } from '@/lib/api/client';
import { OfferingAlternative } from '@/lib/interfaces';

export async function getChoiceAlternatives(choiceId: string): Promise<OfferingAlternative[]> {
  const res = await api.get<{ alternatives: OfferingAlternative[] }>(`/rubriques/choice/${choiceId}/alternatives`);
   return Array.isArray(res.data) ? res.data : [];
}
