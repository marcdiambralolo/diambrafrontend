import { useConsultationChoicesBase, ChoiceWithRubriqueTitle } from './useConsultationChoicesBase';

export function useConsultationChoices() {
  return useConsultationChoicesBase<ChoiceWithRubriqueTitle>('/consultation-choices/allprompts');
}

export type { ChoiceWithRubriqueTitle };