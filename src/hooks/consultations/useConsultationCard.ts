import { useMemo } from 'react';
import type { Consultation } from '@/lib/interfaces';

export function useConsultationCard(consultation: Consultation) {
  const typeConfig = useMemo(() => {
    const configs: Record<string, { icon: string; text: string; gradient: string }> = {
      'NOMBRES_PERSONNELS': { icon: '🔢', text: 'Numérologie', gradient: 'from-emerald-500 to-teal-500' },
      'CYCLES_PERSONNELS': { icon: '🌙', text: 'Cycles', gradient: 'from-[#163A74] to-[#2E5AA6]' },
      'TAROT': { icon: '🃏', text: 'Tarot', gradient: 'from-[#0F1C3F] to-[#2E5AA6]' },
      'ASTROLOGIE': { icon: '⭐', text: 'Astrologie', gradient: 'from-blue-500 to-cyan-500' },
      'RELATIONS': { icon: '💑', text: 'Relations', gradient: 'from-[#2E5AA6] to-[#9BC2FF]' },
      'VOYANCE': { icon: '🔮', text: 'Guidance', gradient: 'from-[#163A74] to-[#4F83D1]' },
      'VIE_PERSONNELLE': { icon: '🌟', text: 'Vie Personnelle', gradient: 'from-amber-500 to-orange-500' }
    };
   
    return configs[consultation.type] || {
      icon: '📋',
      text: consultation.type,
      gradient: 'from-gray-500 to-gray-600'
    };
  }, [consultation.type]);

   const hasTierce = useMemo(() => !!consultation.tierce, [consultation.tierce]);
 
  return {  typeConfig, hasTierce  };
}