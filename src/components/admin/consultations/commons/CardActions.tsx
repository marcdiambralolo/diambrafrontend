'use client';
import { cx } from '@/lib/functions';
import { motion, useReducedMotion } from 'framer-motion';
import { Eye, Mail, Sparkles, Wand2, BellRing, Loader2, Clock3, AlertTriangle } from 'lucide-react';
import { memo, useMemo } from 'react';
import CacheLink from '@/components/commons/CacheLink';
import { useQueryClient } from '@tanstack/react-query';
import { prefetchConsultationFrontData } from '@/lib/cache/route-prefetch';

type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | null;

interface CardActionsProps {
  isCompleted: boolean;
  isNotified: boolean;
  consultationId: string;
  jobStatus?: JobStatus;
  onGenerateAnalysis: (id: string) => void;
  onRetry?: (id: string) => void;
  onNotify: (id: string) => void;
}

const cardShimmer = {
  hidden: { x: '-140%' },
  show: { x: '320%' },
};

const CardActions = memo<CardActionsProps>(function CardActions({
  isCompleted,
  isNotified,
  consultationId,
  jobStatus = null,
  onGenerateAnalysis,
  onRetry,
  onNotify,
}) {
  const reduce = useReducedMotion() ?? false;
  const isQueued = jobStatus === 'QUEUED';
  const isProcessing = jobStatus === 'PROCESSING';
  const isBusy = isQueued || isProcessing;
  const isFailed = jobStatus === 'FAILED';

  // Notifier si consultation complétée ET pas encore notifiée
  const canNotify = isCompleted && !isNotified;

  const primaryLabel = useMemo(() => {
    if (isProcessing) return 'Analyse en cours';
    if (isQueued) return 'Dans la file';
    if (isFailed) return 'Relancer analyse';
    if (!isCompleted) return 'Générer analyse';
    return 'Voir';
  }, [isCompleted, isFailed, isProcessing, isQueued]);

  const baseBtn =
    'relative inline-flex w-full items-center justify-center gap-2 ' +
    'rounded-2xl px-4 py-2.5 text-xs font-extrabold text-white ' +
    'shadow-lg transition-all duration-300 overflow-hidden ' +
    'active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F83D1]/70';

  const shimmer = !reduce ? (
    <motion.span
      aria-hidden="true"
      variants={cardShimmer}
      initial="hidden"
      animate="show"
      transition={{ duration: 1.9, repeat: Infinity, ease: 'linear' }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
    />
  ) : null;

  const queryClient = useQueryClient();

  return (
    <div className="w-full">
      {/* Ligne d’actions principales */}
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-stretch">
        {!isCompleted ? (
          <div className="flex w-full flex-col gap-2">
            <motion.button
              type="button"
              onClick={() => onGenerateAnalysis(consultationId)}
              whileHover={reduce ? undefined : { scale: 1.02, y: -1 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              disabled={isBusy || isFailed}
              className={cx(
                baseBtn,
                isBusy
                  ? 'bg-gradient-to-r from-slate-500 via-slate-600 to-slate-500 shadow-slate-500/25 cursor-not-allowed opacity-90'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 shadow-amber-500/35 hover:shadow-amber-500/45',
              )}
              aria-label="Générer l’analyse"
              title="Générer l’analyse"
            >
              {shimmer}
              {isProcessing ? (
                <Loader2 className="h-4 w-4 relative z-10 animate-spin" />
              ) : isQueued ? (
                <Clock3 className="h-4 w-4 relative z-10" />
              ) : (
                <Wand2 className="h-4 w-4 relative z-10" />
              )}
              <span className="relative z-10">{primaryLabel}</span>
              {!isBusy ? <Sparkles className="h-4 w-4 relative z-10" /> : null}
            </motion.button>

            {isFailed && onRetry ? (
              <motion.button
                type="button"
                onClick={() => onRetry(consultationId)}
                whileHover={reduce ? undefined : { scale: 1.02, y: -1 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
                className={cx(
                  baseBtn,
                  'bg-gradient-to-r from-red-500 via-rose-500 to-red-500 shadow-red-500/35 hover:shadow-red-500/45',
                )}
                aria-label="Relancer l’analyse"
                title="Relancer l’analyse"
              >
                {shimmer}
                <AlertTriangle className="h-4 w-4 relative z-10" />
                <span className="relative z-10">Relancer l'analyse</span>
                <Sparkles className="h-4 w-4 relative z-10" />
              </motion.button>
            ) : null}
          </div>
        ) : null}

        {/* 2) Voir (si completed) */}
        {isCompleted ? (
          <CacheLink
            href={`/admin/consultations/${consultationId}`}
            className={cx(
              baseBtn,
              'bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#2E5AA6]',
              'shadow-[#2E5AA6]/35 hover:shadow-[#2E5AA6]/45',
            )}
            aria-label="Voir la consultation"
            title="Voir la consultation"
            onMouseEnter={() => prefetchConsultationFrontData(queryClient, consultationId)}
            onFocus={() => prefetchConsultationFrontData(queryClient, consultationId)}
            onTouchStart={() => prefetchConsultationFrontData(queryClient, consultationId)}
          >
            {shimmer}
            <Eye className="h-4 w-4 relative z-10" />
            <span className="relative z-10">{primaryLabel}</span>
          </CacheLink>
        ) : null}

        {/* 3) Notifier (si completed && !notified) */}
        {canNotify ? (
          <motion.button
            type="button"
            onClick={() => onNotify(consultationId)}
            whileHover={reduce ? undefined : { scale: 1.02, y: -1 }}
            whileTap={reduce ? undefined : { scale: 0.98 }}
            className={cx(
              baseBtn,
              'bg-slate-900 hover:bg-slate-800',
              'shadow-slate-900/25 hover:shadow-slate-900/35',
            )}
            aria-label="Notifier le client"
            title="Notifier le client"
          >
            {!reduce ? (
              <span
                aria-hidden="true"
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(255,255,255,0.18),transparent_70%)]"
              />
            ) : null}
            <BellRing className="h-4 w-4 relative z-10" />
            <span className="relative z-10">Notifier</span>
          </motion.button>
        ) : null}
      </div>

      {/* Badge “déjà notifié” (état) */}
      {isNotified ? (
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 520, damping: 28 }}
          className="
            mt-2 flex w-full items-center justify-center gap-2
            rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5
            text-xs font-extrabold text-emerald-800 shadow-sm
          "
          aria-label="Client déjà notifié"
        >
          <Mail className="h-4 w-4" />
          Client déjà notifié
          {!reduce ? (
            <span
              aria-hidden="true"
              className="ml-1 inline-flex h-2 w-2 rounded-full bg-emerald-600 shadow-[0_0_0_6px_rgba(16,185,129,0.18)]"
            />
          ) : null}
        </motion.div>
      ) : null}
    </div>
  );
}, (prev, next) => {
  return (
    prev.isCompleted === next.isCompleted &&
    prev.isNotified === next.isNotified &&
    prev.consultationId === next.consultationId
  );
});

CardActions.displayName = 'CardActions';

export default CardActions;