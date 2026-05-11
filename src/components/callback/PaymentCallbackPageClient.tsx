'use client';
import type { PaymentStatus, PaymentSummary, StatusConfig } from '@/hooks/callback/types';
import { usePaymentCallback } from '@/hooks/callback/usePaymentCallback';
import { cx } from '@/lib/functions';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, Clock, Home, Loader2, RefreshCw, ShieldCheck, Sparkles, } from 'lucide-react';
import React from 'react';

const DM = {
  page: 'min-h-screen bg-[var(--bg-dark)] text-[var(--text-dark)]',
  shell: 'relative mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10',
  panel:
    'relative overflow-hidden rounded-[28px] border border-[var(--accent-violet)]/20 bg-gradient-lux-dark shadow-[0_24px_90px_rgba(79,92,255,0.18)]',
  panelSoft:
    'relative overflow-hidden rounded-[24px] border border-[var(--accent-violet)]/16 bg-gradient-lux-dark shadow-[0_18px_60px_rgba(143,92,255,0.10)]',
  ring: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-violet)]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-dark)]',
  title: 'text-[var(--text-dark)]',
  text: 'text-[var(--text-dark)]/80',
  textSoft: 'text-[var(--text-dark)]/60',
  badge:
    'inline-flex items-center gap-2 rounded-full border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-gold)]',
  btnPrimary:
    'inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--accent-violet)]/25 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-violet)] px-5 py-3 text-sm font-semibold text-[var(--bg-dark)] shadow-[0_12px_35px_rgba(143,92,255,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(143,92,255,0.25)] active:translate-y-0',
  btnDanger:
    'inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-gradient-to-r from-rose-400 via-rose-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(255,99,99,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(255,99,99,0.24)] active:translate-y-0',
};

function getStatusAccent(status: PaymentStatus) {
  switch (status) {
    case 'paid':
      return {
        glow: 'bg-emerald-400/14',
        ring: 'border-emerald-300/20',
        pill: 'text-emerald-200 bg-emerald-400/10 border-emerald-400/20',
      };
    case 'pending':
      return {
        glow: 'bg-amber-400/14',
        ring: 'border-amber-300/20',
        pill: 'text-amber-200 bg-amber-400/10 border-amber-400/20',
      };
    case 'failure':
    case 'error':
      return {
        glow: 'bg-rose-400/14',
        ring: 'border-rose-300/20',
        pill: 'text-rose-200 bg-rose-400/10 border-rose-400/20',
      };
    default:
      return {
        glow: 'bg-cyan-400/14',
        ring: 'border-cyan-300/20',
        pill: 'text-cyan-200 bg-cyan-400/10 border-cyan-400/20',
      };
  }
}

function AmbientBackground() {

  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full bg-[var(--accent-violet)]/12 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-80 w-80 rounded-full bg-[var(--accent-gold)]/16 blur-3xl" />
        <div className="absolute bottom-[-16%] left-[15%] h-96 w-96 rounded-full bg-[var(--pastel-sky)]/10 blur-3xl" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,var(--accent-gold)_1px,transparent_0)] [background-size:22px_22px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-violet)]/30 to-transparent" />
    </>
  );
}

const LoadingState: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cx(DM.page, 'relative flex items-center justify-center overflow-hidden')}>
      <AmbientBackground />

      <div className={DM.shell}>
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.35 }}
          className={cx(DM.panel, 'mx-auto max-w-2xl p-8 text-center sm:p-12')}
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#8fe9ff_0%,#5fc0ff_42%,#7c5cff_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(143,233,255,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(124,92,255,0.10),transparent_30%)]" />

          <div className="relative">
            <div className={DM.badge}>
              <Sparkles className="h-3.5 w-3.5" />
              Vérification sécurisée
            </div>

            <motion.div
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={reduceMotion ? undefined : { duration: 1.6, repeat: Infinity, ease: 'linear' }}
              className="relative mx-auto mt-7 h-24 w-24"
            >
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl" />
              <div className="absolute inset-0 rounded-full border border-cyan-300/25 bg-white/5 backdrop-blur-sm" />
              <div className="relative flex h-full w-full items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))]">
                <Loader2 className="h-10 w-10 text-cyan-200" />
              </div>
            </motion.div>

            <h2 className="mt-7 text-2xl font-semibold tracking-tight text-white sm:text-4xl">
              Vérification du paiement
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Nous confirmons votre transaction et préparons votre accès. Merci de patienter quelques instants.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Étape 1
                </div>
                <div className="mt-2 text-sm font-medium text-white">Validation</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Étape 2
                </div>
                <div className="mt-2 text-sm font-medium text-white">Activation</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Étape 3
                </div>
                <div className="mt-2 text-sm font-medium text-white">Redirection</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

interface StatusCardProps {
  status: PaymentStatus;
  statusConfig: StatusConfig;
  paymentSummary: PaymentSummary | null;
  isProcessing: boolean;
  shouldAutoRedirect: boolean;
  autoRedirectCountdown: number;
  itemVariants: Variants;
  pulseVariants: Variants;
}

export function StatusCard({
  status,
  statusConfig,
  paymentSummary,
  isProcessing,
  shouldAutoRedirect,
  autoRedirectCountdown,
  itemVariants,
  pulseVariants,
}: StatusCardProps) {
  const reduceMotion = useReducedMotion();
  const StatusIcon = statusConfig.icon;
  const tone = getStatusAccent(status);

  return (
    <motion.section
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cx(DM.panel, 'w-full')}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#8fe9ff_0%,#5fc0ff_42%,#7c5cff_100%)]" />
      <div className={cx('absolute right-0 top-0 h-40 w-40 rounded-full blur-3xl', tone.glow)} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(135,229,255,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(124,92,255,0.14),transparent_30%)]" />
      <div className="relative px-5 pb-5 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className={DM.badge}>
              <ShieldCheck className="h-3.5 w-3.5" />
              Paiement sécurisé
            </div>

            <div className="mt-5 flex items-start gap-4 sm:gap-5">
              <motion.div
                variants={pulseVariants}
                animate={!reduceMotion && status === 'pending' ? 'pulse' : undefined}
                className={cx(
                  'relative flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] border bg-white/[0.05] backdrop-blur-sm sm:h-24 sm:w-24',
                  tone.ring,
                )}
              >
                <div className={cx('absolute inset-0 rounded-[24px] blur-xl', tone.glow)} />
                <div className={cx('absolute inset-[1px] rounded-[23px] border border-white/10 bg-white/[0.03]')} />
                <StatusIcon className={cx('relative z-10 h-9 w-9 sm:h-11 sm:w-11', statusConfig.iconColor)} />
              </motion.div>

              <div className="min-w-0">
                <motion.h1
                  variants={itemVariants}
                  className="text-2xl font-semibold tracking-tight text-white sm:text-4xl"
                >
                  {statusConfig.title}
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base"
                >
                  {statusConfig.description}
                </motion.p>

                <div className="mt-4">
                  <span className={cx('inline-flex rounded-full border px-3 py-1 text-xs font-semibold', tone.pill)}>
                    Statut : {status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {shouldAutoRedirect && autoRedirectCountdown > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[24px] border border-cyan-300/18 bg-white/[0.04] p-5 text-center backdrop-blur-sm lg:w-[240px]"
            >
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/18 bg-cyan-300/10 text-cyan-200">
                <Clock className="h-5 w-5" />
              </div>

              <p className="mt-3 text-sm font-semibold text-white">
                Redirection automatique
              </p>

              <motion.div
                key={autoRedirectCountdown}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                className="mt-3 text-5xl font-semibold tracking-tight text-cyan-200"
              >
                {autoRedirectCountdown}
              </motion.div>

              <p className="mt-1 text-xs text-slate-400">secondes restantes</p>
            </motion.div>
          ) : null}
        </div>

        {statusConfig.showDetails && (
          <motion.div
            variants={itemVariants}
            className={cx(DM.panelSoft, 'mt-6 p-4 sm:mt-8 sm:p-6')}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-white sm:text-lg">
                  Détails de la transaction
                </h3>

                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Résumé de l’opération confirmée par le système de paiement.
                </p>
              </div>

              <div className="hidden rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300 sm:inline-flex">
                Transaction
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Montant
                </div>
                <div className="mt-2 text-sm font-semibold text-white sm:text-base">
                  {typeof paymentSummary?.amount === 'number'
                    ? `${paymentSummary.amount.toLocaleString('fr-FR')} FCFA`
                    : 'Indisponible'}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Référence
                </div>
                <div className="mt-2 break-all text-sm font-semibold text-white sm:text-base">
                  {paymentSummary?.reference || 'Indisponible'}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Méthode
                </div>
                <div className="mt-2 text-sm font-semibold text-white sm:text-base">
                  {paymentSummary?.method || 'Indisponible'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {isProcessing && (
          <motion.div
            variants={itemVariants}
            className="mt-5 flex items-center gap-3 rounded-2xl border border-cyan-300/16 bg-cyan-300/8 p-4"
          >
            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-cyan-200" />
            <div>
              <p className="text-sm font-medium text-white">
                Traitement de votre commande en cours
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Nous finalisons l’activation de votre accès.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}

function ActionPanel({
  status,
  handleRetry,
  handleGoHome,
  itemVariants,
}: {
  status: PaymentStatus;
  handleRetry: () => void;
  handleGoHome: () => void;
  itemVariants: Variants;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={itemVariants}
      className={cx(DM.panelSoft, 'mt-4 p-4 sm:mt-6 sm:p-6')}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        {(status === 'failure' || status === 'error') && (
          <motion.button
            type="button"
            whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
            whileTap={reduceMotion ? undefined : { scale: 0.99 }}
            onClick={handleRetry}
            className={cx(DM.btnDanger, DM.ring, 'w-full sm:flex-1')}
          >
            <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
            Réessayer
          </motion.button>
        )}

        <motion.button
          type="button"
          whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
          whileTap={reduceMotion ? undefined : { scale: 0.99 }}
          onClick={handleGoHome}
          className={cx(DM.btnPrimary, DM.ring, 'w-full sm:flex-1')}
        >
          <Home className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Retour au profil</span>
          <span className="sm:hidden">Profil</span>
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}

function SecureFooter({ itemVariants }: { itemVariants: Variants }) {
  return (
    <motion.div
      variants={itemVariants}
      className="mt-4 px-4 text-center sm:mt-6"
    >
      <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] text-slate-400 sm:text-sm">
        <ShieldCheck className="h-4 w-4 text-cyan-200" />

        <span>
          Paiement sécurisé par{' '}
          <a
            href="https://moneyfusion.net"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-cyan-200 transition hover:text-cyan-100 hover:underline"
          >
            MoneyFusion
          </a>
        </span>
      </div>
    </motion.div>
  );
}

export default function PaymentCallbackPageClient() {
  const reduceMotion = useReducedMotion();

  const {
    handleRetry, handleGoHome, isLoading,
    isProcessing, status, statusConfig, autoRedirectCountdown, paymentSummary,
    shouldAutoRedirect, itemVariants, pulseVariants,
  } = usePaymentCallback();

  if (isLoading) { return <LoadingState />; }

  return (
    <div className={cx(DM.page, 'relative overflow-hidden')}>
      <AmbientBackground />

      <div className={DM.shell}>
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
            className="relative z-10"
          >
            <StatusCard
              status={status}
              statusConfig={statusConfig}
              paymentSummary={paymentSummary}
              isProcessing={isProcessing}
              shouldAutoRedirect={shouldAutoRedirect}
              autoRedirectCountdown={autoRedirectCountdown}
              itemVariants={itemVariants}
              pulseVariants={pulseVariants}
            />

            <ActionPanel
              status={status}
              handleRetry={handleRetry}
              handleGoHome={handleGoHome}
              itemVariants={itemVariants}
            />
            <SecureFooter itemVariants={itemVariants} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}