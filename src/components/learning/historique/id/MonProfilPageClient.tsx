"use client";
import Loader from "@/app/loading";
import { staggerContainer } from "@/lib/animations";
import { api } from "@/lib/api/client";
import { cx, formatEditionDate } from "@/lib/functions";
import type { Consultation } from "@/lib/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Calendar, CheckCircle, Globe, History, Timer, Trophy, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useState } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  delay?: number;
}

const StatsCard = memo(({ icon, label, value, color, delay = 0 }: StatsCardProps) => (
  <motion.div
    variants={fadeInUp}
    custom={delay}
    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-xl group`}
  >
    <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-700" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold opacity-90">{label}</span>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-black tracking-tight">{value}</div>
    </div>
  </motion.div>
));

interface ConsultationCardProps {
  consultation: Consultation;
  index: number;
  isDuplicate?: boolean;
  duplicateCount?: number;
}

export function ConsultationCard({ consultation, index, isDuplicate = false, duplicateCount = 0 }: ConsultationCardProps) {
  const nomJoueur = consultation.clientId?.username || 'Diambra';
  const country = consultation.clientId?.country || 'Côte d\'Ivoire';
  const timeSpent = consultation.timeSpent;
  const relativeDate = formatEditionDate(new Date(consultation.createdAt || ''));

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
      whileHover={{ y: -4 }}
      className={cx(
        "group relative overflow-hidden rounded-xl p-4 cursor-pointer",
        "bg-white dark:bg-gray-800",
        "border border-gray-100 dark:border-gray-700",
        "shadow-md hover:shadow-xl",
        "transition-all duration-300",
        isDuplicate && "ring-2 ring-green-500 ring-offset-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
      )}
    >
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent pointer-events-none" />
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <UserRound className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{nomJoueur}</span>
            </div>
            {timeSpent && (
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <Timer className="w-3.5 h-3.5" />
                <span className="text-xs  font-medium">{relativeDate}</span>
              </div>
            )}    <Globe className="w-3.5 h-3.5" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{country}</span>
          </div>
        </div>

        <div className="flex justify-center gap-0.5 py-2">
          {timeSpent}
          {isDuplicate && (
            <div className="relative   z-10">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold shadow-md">
                <CheckCircle className="w-3 h-3" />
                {duplicateCount > 1 ? `x${duplicateCount}` : 'Doublon'}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function HistoriquePageClientImpl() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [sortedConsultations, setSortedConsultations] = useState<Consultation[]>([]);
  const [duplicateMap, setDuplicateMap] = useState<Map<string, { count: number; isDuplicate: boolean }>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/admin/last-ended-learning/stats");
      setData(response.data);

      const consultations = (response.data as any)?.consultations as Consultation[] ?? [];
      const sorted = [...consultations].sort((a, b) => {
        const valueA = parseInt(a.combinaison || '0', 10);
        const valueB = parseInt(b.combinaison || '0', 10);
        return valueA - valueB;
      });
      setSortedConsultations(sorted);

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
  }, []);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  if (loading) return <Loader />;

  const edition = data?.latestEdition;
  const stats = data?.stats;
  const editionStartDate = edition.startDate ? new Date(edition.startDate) : null;
  const editionEndDate = edition?.endDate ? new Date(edition?.endDate) : null;
  const formattedStartDate = formatEditionDate(editionStartDate);
  const formattedEndDate = formatEditionDate(editionEndDate);

  return (
    <div className="max-w-4xl mx-auto px-3 py-4 sm:px-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-1.5 mb-4">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
            Édition terminée
          </span>
        </div>
      </motion.div>

      {stats && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-8"
        >
          <StatsCard
            icon={<CheckCircle className="w-4 h-4" />}
            label="Historique des jeux"
            value={stats.completedPlayers || 0}
            color="from-green-600 to-emerald-600"
            delay={0.1}
          />
        </motion.div>
      )}

      {edition && (
        <motion.div
          variants={fadeInUp}
          className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-purple-100 dark:border-purple-800 shadow-md"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Période de l'édition de jeu</p>
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">

                    <span>{formattedStartDate} → {formattedEndDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {sortedConsultations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <History className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Aucune competition</h3>
            <p className="text-gray-500 dark:text-gray-400">Aucune competition n'a été jouée dans cette édition</p>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4 space-x-2"
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

      <div className="mt-8 text-center">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
      </div>
    </div>
  );
}

const HistoriquePageClient = memo(HistoriquePageClientImpl);

export default HistoriquePageClient;