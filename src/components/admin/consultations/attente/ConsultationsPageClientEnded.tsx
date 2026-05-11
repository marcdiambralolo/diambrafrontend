'use client';
import Toast from '@/components/admin/commons/Toast';
import { ConsultationsEmptyState } from '@/components/admin/consultations/commons/ConsultationsEmptyState';
import { ConsultationsError } from '@/components/admin/consultations/commons/ConsultationsError';
import { ConsultationsHeader } from '@/components/admin/consultations/commons/ConsultationsHeader';
import { ConsultationsList } from '@/components/admin/consultations/commons/ConsultationsList';
import { CosmicLoader } from '@/components/admin/consultations/commons/CosmicLoader';
import CacheLink from '@/components/commons/CacheLink';
import type { BatchProgress } from '@/hooks/admin/consultations/useAdminConsultationsPageEnded';
import { useAdminConsultationsPageEnded } from '@/hooks/admin/consultations/useAdminConsultationsPageEnded';
import { AnimatePresence, motion,Variants  } from 'framer-motion';
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  CheckSquare,
  Clock3,
  Eye,
  Loader2,
  Sparkles,
  Square,
  X
} from 'lucide-react';
import Link from 'next/link';
import { memo, useMemo } from 'react';

// ==================== CONSTANTES D'ANIMATION ====================
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const scaleOnHover: Variants = {
  whileHover: { scale: 1.02, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 }
};

type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | null;

// ==================== STATUS ICON ====================
const StatusIcon = memo(({ status }: { status: JobStatus; isFailed: boolean }) => {
  if (status === 'COMPLETED') return <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />;
  if (status === 'PROCESSING') return <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin flex-shrink-0" />;
  if (status === 'QUEUED') return <Clock3 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />;
  return <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />;
});

StatusIcon.displayName = 'StatusIcon';

// ==================== STATUS BADGE ====================
const StatusBadge = memo(({ status }: { status: JobStatus }) => {
  const config = {
    COMPLETED: { label: 'Terminé', className: 'bg-emerald-50 text-emerald-700' },
    PROCESSING: { label: 'En cours', className: 'bg-indigo-50 text-indigo-700' },
    QUEUED: { label: 'En file', className: 'bg-slate-100 text-slate-600' },
  } as const;

  const current = status === 'COMPLETED' || status === 'PROCESSING' || status === 'QUEUED' ? config[status] : null;
  if (!current) return null;

  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-medium flex-shrink-0 ${current.className}`}>
      {current.label}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

// ==================== ACTION BUTTONS ====================
const ActionButtons = memo(({ result, notifyingIds, onNotify }: { 
  result: any; 
  notifyingIds: Set<string>; 
  onNotify: (id: string) => void;
}) => {
  const isNotifying = notifyingIds.has(result.id);

  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <CacheLink
        href={`/admin/consultations/${result.id}`}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium transition-colors"
        title="Voir l'analyse"
        target="_blank"
      >
        <Eye className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Voir</span>
      </CacheLink>

      {result.notified ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium">
          <CheckCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Notifié</span>
        </span>
      ) : (
        <button
          onClick={() => onNotify(result.id)}
          disabled={isNotifying}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
          title="Notifier le client"
        >
          {isNotifying ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Bell className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{isNotifying ? 'Envoi...' : 'Notifier'}</span>
        </button>
      )}
    </div>
  );
});

ActionButtons.displayName = 'ActionButtons';

// ==================== BATCH RESULT ITEM ====================
const BatchResultItem = memo(({ result, jobStatuses, notifyingIds, onNotify }: { 
  result: any; 
  idx: number; 
  jobStatuses?: Record<string, { status?: JobStatus }>; 
  notifyingIds: Set<string>; 
  onNotify: (id: string) => void;
}) => {
  const currentStatus = result.status ?? jobStatuses?.[result.id]?.status ?? null;
  const isCompleted = currentStatus === 'COMPLETED';
  const isProcessing = currentStatus === 'PROCESSING';
  const isQueued = currentStatus === 'QUEUED';
  const isFailed = currentStatus === 'FAILED' || (!currentStatus && !!result.error);

  const rowClass = useMemo(() => {
    if (isCompleted) return 'bg-white';
    if (isProcessing || isQueued) return 'bg-indigo-50/30';
    return 'bg-rose-50/30';
  }, [isCompleted, isProcessing, isQueued]);

  return (
    <motion.div
      variants={fadeInUp}
      className={`flex items-center gap-3 px-4 py-3 text-sm border-b last:border-b-0 border-gray-100 ${rowClass}`}
    >
      <StatusIcon status={currentStatus} isFailed={isFailed} />

      <span className="font-medium text-gray-800 truncate flex-1 min-w-0">
        {result.title}
      </span>

      {currentStatus && !isFailed && <StatusBadge status={currentStatus} />}

      {result.error && (
        <span className="text-rose-500 text-xs truncate max-w-[150px] flex-shrink-0">
          {result.error}
        </span>
      )}

      {isCompleted && <ActionButtons result={result} notifyingIds={notifyingIds} onNotify={onNotify} />}
    </motion.div>
  );
});

BatchResultItem.displayName = 'BatchResultItem';

// ==================== BATCH GENERATE PANEL ====================
interface BatchGeneratePanelProps {
  isRunning: boolean;
  progress: BatchProgress | null;
  pendingCount: number;
  notifyingIds: Set<string>;
  jobStatuses?: Record<string, { status?: JobStatus }>;
  onStart: () => void;
  onStop: () => void;
  onClear: () => void;
  onNotify: (id: string) => void;
}

export const BatchGeneratePanel = memo(function BatchGeneratePanel({
  isRunning,
  progress,
  pendingCount,
  notifyingIds,
  jobStatuses,
  onStart,
  onStop,
  onClear,
  onNotify,
}: BatchGeneratePanelProps) {
  const stats = useMemo(() => {
    if (!progress) return null;
    const results = progress.results;
    return {
      successCount: results.filter((r) => r.status === 'COMPLETED').length,
      processingCount: results.filter((r) => r.status === 'PROCESSING').length,
      queuedCount: results.filter((r) => r.status === 'QUEUED').length,
      errorCount: results.filter((r) => r.status === 'FAILED' || (!r.status && !!r.error)).length,
    };
  }, [progress]);

  const progressPercent = useMemo(() => progress ? Math.round((progress.current / progress.total) * 100) : 0, [progress]);
  const isDone = progress && !isRunning;

  if (pendingCount === 0 && !progress && !isRunning) return null;

  return (
    <div className="space-y-3">
      {!isRunning && !progress && pendingCount > 0 && (
        <motion.button
          {...scaleOnHover}
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 font-semibold text-white shadow-md transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Générer par lot ({pendingCount} en attente)
        </motion.button>
      )}

      <AnimatePresence>
        {(isRunning || progress) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-lg bg-white border border-gray-100 shadow-sm"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  {isRunning ? (
                    <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                  ) : isDone ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : null}
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {isRunning ? `Génération en cours — Lot ${progress?.currentBatch}/${progress?.totalBatches}` : 'Génération terminée'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {isRunning && (
                    <button
                      onClick={onStop}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 text-rose-600 text-xs font-medium transition-colors hover:bg-rose-100"
                    >
                      <Square className="w-3 h-3" />
                      Arrêter
                    </button>
                  )}
                  {isDone && (
                    <button onClick={onClear} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {progress && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{progress.current} / {progress.total}</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            {stats && progress?.results?.length && progress?.results?.length > 0 && (
              <div className="px-4 py-2 flex flex-wrap gap-3 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-1.5 text-xs">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-700 font-medium">{stats.successCount} réussie(s)</span>
                </div>
                {stats.queuedCount > 0 && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock3 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-600">{stats.queuedCount} en file</span>
                  </div>
                )}
                {stats.processingCount > 0 && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                    <span className="text-indigo-600">{stats.processingCount} en cours</span>
                  </div>
                )}
                {stats.errorCount > 0 && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-rose-600">{stats.errorCount} erreur(s)</span>
                  </div>
                )}
              </div>
            )}

            {/* Results List */}
            {progress && progress.results.length > 0 && (
              <div className="max-h-60 overflow-y-auto">
                {progress.results.map((result, idx) => (
                  <BatchResultItem
                    key={result.id}
                    result={result}
                    idx={idx}
                    jobStatuses={jobStatuses}
                    notifyingIds={notifyingIds}
                    onNotify={onNotify}
                  />
                ))}
              </div>
            )}

            {/* Footer */}
            {isDone && (
              <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/30">
                <button
                  onClick={onClear}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium transition-colors hover:bg-gray-200"
                >
                  Fermer le rapport
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// ==================== NAVIGATION TABS ====================
const NavigationTabs = memo(function NavigationTabs() {
  return (
    <div className="flex justify-center gap-3 py-4">
      <Link
        href="/admin/consultations"
        className="rounded-lg px-5 py-2 font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
      >
        En Attente
      </Link>
      <Link
        href="/admin/consultations/pending"
        className="rounded-lg px-5 py-2 font-medium text-white bg-rose-500 shadow-sm hover:bg-rose-600 transition-all"
      >
        Non notifiées
      </Link>
      <Link
        href="/admin/consultations/ended"
        className="rounded-lg px-5 py-2 font-medium text-white bg-emerald-500 shadow-sm hover:bg-emerald-600 transition-all"
      >
        Terminées
      </Link>
    </div>
  );
});

// ==================== COMPOSANT PRINCIPAL ====================
export default function ConsultationsPageClientEnded() {
  const {
    notifyingIds, consultationsenattente, isRunning, pendingTotal, totalPages,
    error, currentPage, loading, isRefreshing, progress, pendingCount, jobStatuses,
    toastMessage, toastType, hasBatchFailures, handleToastClose,
    startBatchGeneration, stopBatchGeneration, clearProgress, handleRefresh,
    handleNotifyUser, handlePageChange, handleGenerateAnalysis, handleRetryAnalysis,
  } = useAdminConsultationsPageEnded();

  if (loading) return <CosmicLoader />;

  if (error) {
    return <ConsultationsError error={error} onRetry={handleRefresh} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
        
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              <CheckSquare className="h-4 w-4 text-emerald-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Consultations terminées</h1>
          </div>
          <p className="text-sm text-gray-500">
            Gérez les analyses générées et notifiez vos clients
          </p>
        </motion.div>

        {/* Navigation */}
        <NavigationTabs />

        {/* Header avec stats */}
        <ConsultationsHeader
          total={pendingTotal}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          loading={loading}
        />

        {/* Zone de contenu */}
        <div className="mt-6 space-y-4">
          {/* Alerte d'erreur batch */}
          <AnimatePresence>
            {progress && !isRunning && hasBatchFailures && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700 flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Certaines analyses n'ont pas pu être générées. Consultez le détail ci-dessous.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Panel de génération par lot */}
          <BatchGeneratePanel
            isRunning={isRunning}
            progress={progress}
            pendingCount={pendingCount}
            notifyingIds={notifyingIds}
            jobStatuses={jobStatuses}
            onStart={startBatchGeneration}
            onStop={stopBatchGeneration}
            onClear={clearProgress}
            onNotify={handleNotifyUser}
          />

          {/* Liste des consultations */}
          {consultationsenattente.length > 0 ? (
            <ConsultationsList
              consultations={consultationsenattente}
              onGenerateAnalysis={handleGenerateAnalysis}
              currentPage={currentPage}
              totalPages={totalPages}
              total={pendingTotal}
              onPageChange={handlePageChange}
              loading={loading}
              onNotify={handleNotifyUser}
              jobStatuses={jobStatuses}
              onRetryAnalysis={handleRetryAnalysis}
            />
          ) : (
            <ConsultationsEmptyState />
          )}
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <Toast message={toastMessage} type={toastType} onClose={handleToastClose} />
        )}
      </AnimatePresence>
    </main>
  );
}