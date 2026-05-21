"use client";
import Loader from "@/app/loading";
import ConsultationCard from "@/components/commons/ConsultationCard";
import { api } from "@/lib/api/client";
import type { Consultation } from "@/lib/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import { History } from "lucide-react";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

const ConsultationsEmpty = memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-12"
  >
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
      <History className="w-8 h-8 text-purple-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
      Aucun historique
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Vous n'avez pas encore joué de parties
    </p>
  </motion.div>
));

function HistoriquePageClientImpl() {
  const params = useParams();

  const gameId = useMemo(() => params?.id as string, [params?.id]);

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultations = useCallback(async () => {
    if (!gameId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get<{
        success: boolean;
        consultations: Consultation[];
      }>(`/consultations/by-idjeu/${gameId}`);

      setConsultations(response.data?.consultations ?? []);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  if (loading) return <Loader />;

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 mb-3">
          <History className="w-3.5 h-3.5 text-purple-600" />
          <span className="text-[10px] font-bold uppercase text-purple-700">Historique</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {consultations.length === 0 ? (
          <ConsultationsEmpty key="empty" />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {consultations.map((consultation, index) => (
              <ConsultationCard
                key={consultation._id ?? consultation.id ?? index}
                consultation={consultation}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

const HistoriquePageClient = memo(HistoriquePageClientImpl);

export default HistoriquePageClient;