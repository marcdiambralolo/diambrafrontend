const CINQ_PORTES_RUBRIQUE_ID = '694acf59bd12675f59e7a7f2' as const;
const CINQ_PORTES_TYPE = 'CINQ_ETOILES' as const;

function toIdString(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const anyValue = value as { _id?: unknown; toString?: () => string };
    if (typeof anyValue._id === 'string') return anyValue._id;
    if (anyValue._id && typeof (anyValue._id as { toString?: () => string }).toString === 'function') {
      return (anyValue._id as { toString: () => string }).toString();
    }
    if (typeof anyValue.toString === 'function') return anyValue.toString();
  }
  return '';
}

export function isFreeCinqPortesConsultation(input?: {
  rubriqueId?: unknown;
  type?: unknown;
  serviceType?: unknown;
} | null): boolean {
  if (!input) return false;

  const rubriqueId = toIdString(input.rubriqueId);
  const type = String(input.type ?? input.serviceType ?? '').toUpperCase();

  return rubriqueId === CINQ_PORTES_RUBRIQUE_ID || type === CINQ_PORTES_TYPE;
}

export { CINQ_PORTES_RUBRIQUE_ID, CINQ_PORTES_TYPE };