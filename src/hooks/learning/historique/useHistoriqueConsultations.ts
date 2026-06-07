import { api } from "@/lib/api/client";
import { formatEditionDate } from "@/lib/functions";
import { Consultation } from "@/lib/interfaces";
import { useState, useCallback, useEffect } from "react";
interface Edition {
  startDate?: string;
  endDate?: string;
}

interface Stats {
  completedPlayers?: number;
}

interface ApiResponse {
  latestEdition?: Edition;
  stats?: Stats;
  consultations?: Consultation[];
}

export function useHistoriqueConsultations() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [sortedConsultations, setSortedConsultations] = useState<Consultation[]>([]);
  const [duplicateMap, setDuplicateMap] = useState<Map<string, { count: number; isDuplicate: boolean }>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérification de la validité du temps
  const isValidTimeSpent = useCallback((consultation: Consultation): boolean => {
    const timeSpent = consultation?.timeSpent;
    if (!timeSpent) return false;

    const numericMatch = timeSpent.match(/(\d+(?:\.\d+)?)/);
    if (!numericMatch) return false;

    const numericValue = parseFloat(numericMatch[1]);
    return !isNaN(numericValue) && numericValue > 0;
  }, []);

  // Récupération des données
  const fetchConsultations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/admin/last-ended-learning/stats");
      const responseData = response.data as ApiResponse;
      setData(responseData);

      const consultations = responseData?.consultations ?? [];

      // Tri par combinaison
      const sorted = [...consultations].sort((a, b) => {
        const valueA = parseInt(a.combinaison || '0', 10);
        const valueB = parseInt(b.combinaison || '0', 10);
        return valueA - valueB;
      });

      setSortedConsultations(sorted.filter(isValidTimeSpent));

      // Détection des doublons
      const combinaisonCount = new Map<string, number>();
      sorted.forEach((consultation) => {
        const comb = consultation.combinaison || '????';
        combinaisonCount.set(comb, (combinaisonCount.get(comb) || 0) + 1);
      });

      const newDuplicateMap = new Map<string, { count: number; isDuplicate: boolean }>();
      combinaisonCount.forEach((count, comb) => {
        newDuplicateMap.set(comb, { count, isDuplicate: count >= 2 });
      });
      setDuplicateMap(newDuplicateMap);

    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [isValidTimeSpent]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  // Calcul des valeurs dérivées
  const edition = data?.latestEdition;
  const stats = data?.stats;
  const editionStartDate = edition?.startDate ? new Date(edition.startDate) : null;
  const editionEndDate = edition?.endDate ? new Date(edition.endDate) : null;
  const formattedStartDate = formatEditionDate(editionStartDate);
  const formattedEndDate = formatEditionDate(editionEndDate);
  const hasConsultations = sortedConsultations.length > 0;

  return {
    // États
    loading,
    error,
    sortedConsultations,
    duplicateMap,
    hasConsultations,
    
    // Données d'édition
    edition,
    stats,
    formattedStartDate,
    formattedEndDate,
    
    // Actions
    fetchConsultations,
    isValidTimeSpent,
    
    // Données brutes
    rawData: data,
  };
}