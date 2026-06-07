"use client";
import Loader from "@/app/loading";
import { useHistoriqueConsultations } from "@/hooks/learning/historique/useHistoriqueConsultations";
import { cx, formatEditionDate } from "@/lib/functions";
import type { Consultation } from "@/lib/interfaces";
import { ArrowLeft, Calendar, CheckCircle, Globe, History, Timer, Trophy, UserRound } from "lucide-react";
import { memo } from "react";
import ErrorPage from "../../commons/Erreur";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

interface ConsultationCardProps {
  consultation: Consultation;
  index: number;
  isDuplicate?: boolean;
  duplicateCount?: number;
}

const StatsCard = memo(({ icon, label, value, color }: StatsCardProps) => (
  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-xl`}>
    <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/10" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold opacity-90">{label}</span>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-black tracking-tight">{value}</div>
    </div>
  </div>
));

const ConsultationCard = memo(({
  consultation,
  isDuplicate = false,
  duplicateCount = 0
}: ConsultationCardProps) => {
  const nomJoueur = consultation.clientId?.username || 'Diambra';
  const country = consultation.clientId?.country || "Côte d'Ivoire";
  const timeSpent = consultation.timeSpent;
  const relativeDate = formatEditionDate(new Date(consultation.createdAt || ''));

  return (
    <article
      className={cx(
        "group relative overflow-hidden rounded-xl p-4",
        "bg-white dark:bg-gray-800",
        "border border-gray-100 dark:border-gray-700",
        "shadow-md hover:shadow-xl",
        "transition-shadow duration-200",
        isDuplicate && "ring-2 ring-green-500 ring-offset-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
      )}
    >
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <UserRound className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{nomJoueur}</span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <Timer className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{relativeDate}</span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <Globe className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{country}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {timeSpent}
          </div>

          {isDuplicate && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold shadow-md">
              <CheckCircle className="w-3 h-3" />
              {duplicateCount > 1 ? `x${duplicateCount}` : 'Doublon'}
            </div>
          )}
        </div>
      </div>
    </article>
  );
});

function HistoriquePageClientImpl() {
  const {
    loading, error, sortedConsultations, duplicateMap, hasConsultations,
    stats, formattedStartDate, formattedEndDate, edition } = useHistoriqueConsultations();

  if (loading) { return <Loader />; }

  if (error) { return (<ErrorPage />); }

  return (
    <div className="max-w-4xl mx-auto px-3 py-4 sm:px-4 sm:py-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-1.5 mb-4">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
            Édition terminée
          </span>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-4 mb-8">
          <StatsCard
            icon={<CheckCircle className="w-4 h-4" />}
            label="Historique des jeux"
            value={stats.completedPlayers || 0}
            color="from-green-600 to-emerald-600"
          />
        </div>
      )}

      {edition && (
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-purple-100 dark:border-purple-800 shadow-md">
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
        </div>
      )}

      {!hasConsultations ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <History className="w-12 h-12 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Aucune compétition</h3>
          <p className="text-gray-500 dark:text-gray-400">Aucune compétition n'a été jouée dans cette édition</p>
        </div>
      ) : (
        <div className="space-y-3">
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
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
      </div>
    </div>
  );
}

const HistoriquePageClient = memo(HistoriquePageClientImpl);

HistoriquePageClient.displayName = 'HistoriquePageClient';

export default HistoriquePageClient;