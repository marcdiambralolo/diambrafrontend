"use client";
import { api } from "@/lib/api/client";
import { cx } from "@/lib/functions";
import type { Consultation } from "@/lib/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, Clock, Gamepad2, History, Loader2, Target, Timer, Trophy, Sparkles
} from "lucide-react";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

// ============================================================================
// TYPES
// ============================================================================

interface ConsultationCardProps {
  consultation: Consultation;
  index: number;
}

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

const getRelativeTime = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return `il y a ${diffInSeconds} seconde${diffInSeconds > 1 ? 's' : ''}`;
  if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} minute${Math.floor(diffInSeconds / 60) > 1 ? 's' : ''}`;
  if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} heure${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''}`;
  return `le ${past.toLocaleDateString('fr-FR')}`;
};

const formatTimeSpent = (timeSpent?: string) => {
  if (!timeSpent) return null;
  const seconds = parseInt(timeSpent, 10);
  if (isNaN(seconds)) return timeSpent;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
};

// ============================================================================
// COMPOSANT CARTE CONSULTATION
// ============================================================================

function ConsultationCard({ consultation, index }: ConsultationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const createdAt = consultation.createdAt;
  const combinaison = consultation.combinaison || '????';
  const timeSpent = formatTimeSpent(consultation.timeSpent);

  const relativeDate = createdAt ? getRelativeTime(createdAt) : 'Date inconnue';
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : 'Date inconnue';

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cx(
        "group relative isolate overflow-hidden rounded-2xl p-4 cursor-pointer",
        "border border-purple-100 dark:border-purple-800",
        "bg-white dark:bg-gray-800",
        "shadow-lg hover:shadow-xl",
        "transition-all duration-300"
      )}
    >
      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent pointer-events-none" />

      <div className="relative z-10 flex items-start gap-3">
        {/* Icône */}
        <div className="flex-shrink-0">
          <div className={cx(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
            "bg-gradient-to-br from-purple-500 to-indigo-600",
            isHovered && "scale-110 shadow-lg"
          )}>
            <History className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          {/* Combinaison */}
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-3.5 h-3.5 text-purple-500" />
            <p className="text-xl font-black tracking-wider font-mono text-gray-800 dark:text-white">
              {combinaison.split('').map((digit, i) => (
                <span key={i} className="inline-block w-6 text-center">{digit}</span>
              ))}
            </p>
          </div>

          {/* Métadonnées */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {timeSpent && (
              <div className="flex items-center gap-1">
                <Timer className="w-3 h-3" />
                <span>{timeSpent}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{relativeDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ============================================================================
// COMPOSANT ÉTAT VIDE
// ============================================================================

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

ConsultationsEmpty.displayName = 'ConsultationsEmpty';

// ============================================================================
// COMPOSANT LOADING
// ============================================================================

const ConsultationsListLoading = memo(() => (
  <div className="flex min-h-[300px] items-center justify-center">
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="mx-auto mb-3"
      >
        <Loader2 className="w-8 h-8 text-purple-500" />
      </motion.div>
      <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
        Chargement...
      </p>
    </div>
  </div>
));

ConsultationsListLoading.displayName = 'ConsultationsListLoading';

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

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

  if (loading) return <ConsultationsListLoading />;

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      {/* En-tête */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 mb-3">
          <History className="w-3.5 h-3.5 text-purple-600" />
          <span className="text-[10px] font-bold uppercase text-purple-700">Historique</span>
        </div>  
      </div>

      {/* Liste des consultations */}
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