"use client";
import Loader from "@/app/loading";
import { api } from "@/lib/api/client";
import { cx, formatEditionDate, getRelativeTime } from "@/lib/functions";
import type { Consultation } from "@/lib/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Calendar, CheckCircle, Gamepad2, History, Timer, UserRound, Zap } from "lucide-react";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

const getEditionStatus = (status: string, isActive: boolean) => {
  if (isActive && status === 'active') {
    return { label: 'En cours', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: <Zap className="w-3 h-3" /> };
  }
  if (status === 'ended') {
    return { label: 'Terminée', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800', icon: <Award className="w-3 h-3" /> };
  }
  return { label: 'À venir', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: <Calendar className="w-3 h-3" /> };
};

interface ConsultationCardProps {
  consultation: Consultation;
  index: number;
  isDuplicate?: boolean;
  duplicateCount?: number;
}

export function ConsultationCard({ consultation, index, isDuplicate = false, duplicateCount = 0 }: ConsultationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const nomJoueur = consultation.clientId?.username || 'Diambra';
  const combinaison = consultation.combinaison || '????';
  const timeSpent = consultation.timeSpent;
  const createdAt = consultation.createdAt;

  const gameEdition = consultation.idjeu as any;
  const editionStatus = gameEdition ? getEditionStatus(gameEdition.status, gameEdition.isActive) : null;
  const editionStartDate = gameEdition?.startgameDate ? new Date(gameEdition.startgameDate) : null;
  const editionEndDate = gameEdition?.endgameDate ? new Date(gameEdition.endgameDate) : null;
  const relativeDate = createdAt ? getRelativeTime(createdAt) : 'Date inconnue';
  const formattedStartDate = formatEditionDate(editionStartDate);
  const formattedEndDate = formatEditionDate(editionEndDate);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cx(
        "group relative overflow-hidden rounded-xl p-4",
        "bg-white dark:bg-gray-800",
        "border border-gray-100 dark:border-gray-700",
        "shadow-sm hover:shadow-lg",
        "transition-all duration-300",
        isDuplicate && "ring-2 ring-green-500 ring-offset-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
      )}
    >
      {isDuplicate && (
        <div className="absolute top-2 right-2 z-10 mb-2">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-bold shadow-md">
            <CheckCircle className="w-3 h-3" />
            {duplicateCount > 1 ? `x${duplicateCount}` : 'Doublon'}
          </div>
        </div>
      )}

      <div className="relative z-10 space-y-3 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Gamepad2 className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">{relativeDate}</span>
          </div>

          {editionStatus && (
            <div className={cx(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
              editionStatus.bg,
              editionStatus.color
            )}>
              {editionStatus.icon}
              {editionStatus.label}
            </div>
          )}
        </div>

        <div className="flex justify-center gap-1 py-2">
          {combinaison.split('').map((digit, i) => (
            <span
              key={i}
              className={cx(
                "w-10 h-10 flex items-center justify-center rounded-lg font-bold text-xl transition-all",
                isDuplicate
                  ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/30"
                  : "bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 text-gray-800 dark:text-white",
                "shadow-inner"
              )}
            >
              {digit}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <UserRound className="w-3 h-3" />
            <span>{nomJoueur}</span>
          </div>
          {timeSpent && (
            <div className="flex items-center gap-1">
              <Timer className="w-3 h-3" />
              <span>{timeSpent}</span>
            </div>
          )}
        </div>

        {editionStartDate && editionEndDate && (
          <div className="pt-2 text-center">
            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>
                {formattedStartDate} → {formattedEndDate}
              </span>
            </div>
          </div>
        )}
      </div>

      {isHovered && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-purple-500/5 to-transparent" />
      )}
    </motion.article>
  );
}

const sortByCombinaison = (consultations: Consultation[]): Consultation[] => {
  return [...consultations].sort((a, b) => {
    const valueA = parseInt(a.combinaison || '0', 10);
    const valueB = parseInt(b.combinaison || '0', 10);
    return valueA - valueB;
  });
};

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
  </motion.div>
));

function HistoriquePageClientImpl() {
  const params = useParams();
  const gameId = useMemo(() => params?.id as string, [params?.id]);

  const [sortedConsultations, setSortedConsultations] = useState<Consultation[]>([]);
  const [duplicateMap, setDuplicateMap] = useState<Map<string, { count: number; isDuplicate: boolean }>>(new Map());
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
      }>("/admin/last-ended-game/stats");
      console.log(response);

      const data = response.data?.consultations ?? [];
      const sorted = sortByCombinaison(data);
      setSortedConsultations(sorted);

      // ✅ Identifier les combinaisons en double
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
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {sortedConsultations.length} jeu{sortedConsultations.length > 1 ? 'x' : ''}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {sortedConsultations.length === 0 ? (
          <ConsultationsEmpty key="empty" />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {sortedConsultations.map((consultation, index) => {
              const comb = consultation.combinaison || '????';
              const duplicateInfo = duplicateMap.get(comb);
              const isDuplicate = duplicateInfo?.isDuplicate || false;
              const duplicateCount = duplicateInfo?.count || 0;

              return (
                <ConsultationCard
                  key={consultation._id ?? consultation.id ?? index}
                  consultation={consultation}
                  index={index}
                  isDuplicate={isDuplicate}
                  duplicateCount={duplicateCount}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {sortedConsultations.length > 1 && (
        <div className="text-center mt-4">
          <p className="text-[12px] text-gray-400">
            ⚡ Trié par combinaison (ordre croissant)
          </p>
        </div>
      )}
    </main>
  );
}

const HistoriquePageClient = memo(HistoriquePageClientImpl);

export default HistoriquePageClient;