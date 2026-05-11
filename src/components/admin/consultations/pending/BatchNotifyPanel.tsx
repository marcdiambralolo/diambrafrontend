'use client';

import React, { memo, useMemo } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BellRing, Loader2, XOctagon, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cx } from '@/lib/functions';

export interface BatchResult {
  id: string;
  title: string;
  success: boolean;
  error?: string;
  notified?: boolean;
}

export interface BatchProgress {
  current: number;
  total: number;
  currentBatch: number;
  totalBatches: number;
  results: BatchResult[];
}



const BatchNotifyPanel = memo(function BatchNotifyPanel({
  isRunning,
  progress,
  totalToNotify,
  onStart,
  onStop,
  onClear,
}: {
  isRunning: boolean;
  progress: BatchProgress | null;
  totalToNotify: number;
  onStart: () => void;
  onStop: () => void;
  onClear: () => void;
}) {
  const reduce = useReducedMotion() ?? false;

  const percent = useMemo(() => {
    if (!progress || progress.total <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round((progress.current / progress.total) * 100)));
  }, [progress]);

  const successCount = useMemo(() => (progress ? progress.results.filter(r => r.success).length : 0), [progress]);
  const errorCount = useMemo(() => (progress ? progress.results.filter(r => !r.success).length : 0), [progress]);
  const last = useMemo(() => (progress ? progress.results.at(-1) : null), [progress]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-extrabold text-slate-700 shadow-sm">
            <BellRing className="h-4 w-4 text-slate-900" />
            Notification par lot
          </div>

          <h3 className="mt-3 text-lg font-black text-slate-900">
            Notifier les consultations terminées non notifiées
          </h3>

          <p className="mt-1 text-sm font-semibold text-slate-600">
            {totalToNotify > 0
              ? `${totalToNotify} consultation${totalToNotify > 1 ? 's' : ''} à notifier`
              : 'Aucune consultation à notifier.'}
          </p>
        </div>

        {/* Boutons (colorés autorisés) */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onStart}
            disabled={isRunning || totalToNotify === 0}
            className={cx(
              'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold text-white transition',
              'bg-slate-900 hover:bg-slate-800 shadow-sm',
              (isRunning || totalToNotify === 0) && 'opacity-40 cursor-not-allowed',
            )}
          >
            {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <BellRing className="h-4 w-4" />}
            Lancer
          </button>

          <button
            type="button"
            onClick={onStop}
            disabled={!isRunning}
            className={cx(
              'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold text-white transition',
              'bg-rose-600 hover:bg-rose-500 shadow-sm',
              !isRunning && 'opacity-40 cursor-not-allowed',
            )}
          >
            <XOctagon className="h-4 w-4" />
            Stop
          </button>

          <button
            type="button"
            onClick={onClear}
            disabled={!progress || isRunning}
            className={cx(
              'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold text-white transition',
              'bg-[#2E5AA6] hover:bg-[#3E6FB5] shadow-sm shadow-[#2E5AA6]/20',
              (!progress || isRunning) && 'opacity-40 cursor-not-allowed',
            )}
          >
            <Trash2 className="h-4 w-4" />
            Effacer
          </button>
        </div>
      </div>

      <AnimatePresence>
        {progress ? (
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 8 }}
            className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm font-extrabold text-slate-900">
                Progression : {progress.current}/{progress.total} ({percent}%)
              </div>
              <div className="text-xs font-semibold text-slate-600">
                Batch {progress.currentBatch}/{progress.totalBatches}
              </div>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full border border-slate-200 bg-white">
              <div className="h-full bg-slate-900 transition-all" style={{ width: `${percent}%` }} />
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <div className="text-[11px] font-extrabold text-slate-600">Succès</div>
                <div className="text-sm font-black text-slate-900">{successCount}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <div className="text-[11px] font-extrabold text-slate-600">Erreurs</div>
                <div className="text-sm font-black text-slate-900">{errorCount}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <div className="text-[11px] font-extrabold text-slate-600">Dernier</div>
                <div className="text-sm font-bold text-slate-900 truncate">
                  {last?.title ?? '—'}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {progress.results.slice(-4).reverse().map((r) => (
                <div
                  key={`${r.id}-${r.title}`}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-slate-900 truncate">{r.title}</div>
                    {r.error ? (
                      <div className="mt-0.5 text-[11px] font-semibold text-slate-600">
                        <AlertTriangle className="mr-1 inline-block h-3.5 w-3.5" />
                        {r.error}
                      </div>
                    ) : null}
                  </div>
                  <div className="shrink-0">
                    {r.success ? (
                      <CheckCircle2 className="h-4 w-4 text-slate-900" />
                    ) : (
                      <span className="text-[11px] font-extrabold text-slate-700">KO</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
});

export default BatchNotifyPanel;
