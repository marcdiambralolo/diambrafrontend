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
    return ''; 
  }, [consultation.clientDisplayName ]);


  return { formattedDate, clientName };
}