import { useMemo } from 'react';
import type { ConsultationChoice } from '@/lib/interfaces';

type ChoiceWithRubriqueTitle = ConsultationChoice & { rubriqueTitle?: string };

export function useConsultationChoicesFilter(choices: ChoiceWithRubriqueTitle[], search?: string|null) {
 
  return useMemo(() => {
    if (!search) return choices;
    const lower = search.toLowerCase();
    return choices.filter(c =>
      c.title.toLowerCase().includes(lower) ||
      c.description.toLowerCase().includes(lower) ||
      c.rubriqueTitle?.toLowerCase().includes(lower)
    );
  }, [choices, search]);
}
