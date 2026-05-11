export interface ConsultationNavigationParams {
  consultationId?: string | null;
  rubriqueId?: string | null;
  choiceId?: string | null;
  r?: string | number | null;
}

export function buildConsultationSearchParams(params: ConsultationNavigationParams): string {
  const searchParams = new URLSearchParams();

  if (params.consultationId) {
    searchParams.set('consultationId', params.consultationId);
  }

  if (params.rubriqueId) {
    searchParams.set('rubriqueId', params.rubriqueId);
  }

  if (params.choiceId) {
    searchParams.set('choiceId', params.choiceId);
  }

  return searchParams.toString();
}

export function buildCategoryConsultationPath(
  categoryId: string,
  segment: 'consulter' | 'genereanalyse' | 'documentpdf',
  params: ConsultationNavigationParams,
): string {
  const query = buildConsultationSearchParams(params);

  return query
    ? `/star/category/${categoryId}/${segment}?${query}`
    : `/star/category/${categoryId}/${segment}`;
}