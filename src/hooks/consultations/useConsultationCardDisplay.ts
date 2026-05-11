import { useMemo } from 'react';
import type { Consultation } from '@/lib/interfaces';

export function useConsultationCardDisplay(consultation: Consultation) {
 
  const formattedDate = useMemo(() => {
    const rawDate = consultation.dateGeneration;
    const dateValue = typeof rawDate === 'string' || typeof rawDate === 'number' || rawDate instanceof Date
      ? rawDate
      : consultation.createdAt;

    return new Date(dateValue).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [consultation.createdAt, consultation.dateGeneration]);

  const clientName = useMemo(() => {
    if (typeof consultation.clientDisplayName === 'string' && consultation.clientDisplayName.trim()) {
      return consultation.clientDisplayName.trim();
    }

    const formDataRecord = consultation.formData as Record<string, unknown> | undefined;
    const firstName = (typeof formDataRecord?.firstName === 'string' ? formDataRecord.firstName : consultation.formData?.prenoms) || '';
    const lastName = (typeof formDataRecord?.lastName === 'string' ? formDataRecord.lastName : consultation.formData?.nom) || '';
    return `${firstName} ${lastName}`.trim();
  }, [consultation.clientDisplayName, consultation.formData]);

  const tierceName = useMemo(() => {
    if (!consultation.tierce) return null;

    const tierceRecord = consultation.tierce as Record<string, unknown>;
    const prenoms = typeof tierceRecord.prenoms === 'string' ? tierceRecord.prenoms : '';
    const nom = typeof tierceRecord.nom === 'string' ? tierceRecord.nom : '';

    return `${prenoms} ${nom}`.trim();
  }, [consultation.tierce]);

  return { formattedDate, clientName, tierceName };
}
