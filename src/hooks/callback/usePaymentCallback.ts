"use client";
import { api } from '@/lib/api/client';
import { AlertTriangle, CheckCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PaymentData, PaymentKind, PaymentStatus, PaymentSummary, StatusConfig } from './types';
import { getErrorMessage } from '@/lib/utils/errorHelpers';
import { useAnimationVariants } from './useAnimationVariants';

const PAYMENT_CALLBACK_RESULT_TTL_MS = 30 * 60 * 1000;
const PAYMENT_CALLBACK_STORAGE_PREFIX = 'monetoile_payment_callback:';
const PAYMENT_CALLBACK_PROCESSING_WINDOW_MS = 2 * 60 * 1000;

function resolvePaymentKind(searchParams: ReturnType<typeof useSearchParams>): PaymentKind {
  const explicitType = searchParams?.get('type') || searchParams?.get('productType');
  const bookId = searchParams?.get('bookId') || searchParams?.get('book_id');

  if (explicitType === 'book' || explicitType === 'BOOK' || bookId) {
    return 'book';
  }

  return 'consultation';
}

type PaymentVerifyResponse = {
  success?: boolean;
  message?: string;
  status?: string;
  data?: {
    _id: string;
    amount: number;
    method?: string;
    reference?: string;
    consultationId?: string | null;
    bookId?: string | null;
    paymentType?: PaymentKind | 'standard';
  };
};

type ProcessConsultationResponse = {
  success?: boolean;
  message?: string;
  status?: string;
  consultationId?: string | null;
  bookId?: string | null;
  downloadUrl?: string | null;
  data?: {
    amount?: number;
    reference?: string;
  };
};

type StoredPaymentCallbackResult = {
  token: string;
  status: PaymentStatus;
  paymentKind: PaymentKind;
  consultationId: string | null;
  downloadUrl: string | null;
  error: string;
  paymentSummary: PaymentSummary | null;
  shouldAutoRedirect: boolean;
  autoRedirectCountdown: number;
  createdAt: number;
};

type StoredPaymentCallbackState =
  | { token: string; state: 'processing'; startedAt: number }
  | { token: string; state: 'done'; startedAt: number; result: StoredPaymentCallbackResult };

function getPaymentCallbackStorageKey(token: string): string {
  return `${PAYMENT_CALLBACK_STORAGE_PREFIX}${token}`;
}

function readStoredPaymentCallbackState(token: string): StoredPaymentCallbackState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(getPaymentCallbackStorageKey(token));
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StoredPaymentCallbackState;
    return parsed?.token === token ? parsed : null;
  } catch {
    return null;
  }
}

function writeProcessingPaymentCallbackState(token: string) {
  if (typeof window === 'undefined') {
    return;
  }

  const state: StoredPaymentCallbackState = {
    token,
    state: 'processing',
    startedAt: Date.now(),
  };

  window.sessionStorage.setItem(getPaymentCallbackStorageKey(token), JSON.stringify(state));
}

function writeCompletedPaymentCallbackState(result: StoredPaymentCallbackResult) {
  if (typeof window === 'undefined') {
    return;
  }

  const state: StoredPaymentCallbackState = {
    token: result.token,
    state: 'done',
    startedAt: result.createdAt,
    result,
  };

  window.sessionStorage.setItem(getPaymentCallbackStorageKey(result.token), JSON.stringify(state));
}

function isStoredPaymentCallbackResultFresh(result: StoredPaymentCallbackResult): boolean {
  return Date.now() - result.createdAt < PAYMENT_CALLBACK_RESULT_TTL_MS;
}

function clearStoredPaymentCallbackState(token: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(getPaymentCallbackStorageKey(token));
}

export function usePaymentCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || '521545ds7528';
  const urlPaymentKind = useMemo(() => resolvePaymentKind(searchParams), [searchParams]);
  const urlBookId = useMemo(() => searchParams?.get('bookId') || searchParams?.get('book_id') || null, [searchParams]);

  const [paymentKind, setPaymentKind] = useState<PaymentKind>(urlPaymentKind);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>('pending');
  const [error, setError] = useState<string>('');
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
  const [shouldAutoRedirect, setShouldAutoRedirect] = useState(false);
  const [autoRedirectCountdown, setAutoRedirectCountdown] = useState(15);

  const applyStoredResult = useCallback((result: StoredPaymentCallbackResult) => {
    setPaymentKind(result.paymentKind);
    setConsultationId(result.consultationId);
    setError(result.error);
    setPaymentSummary(result.paymentSummary);
    setShouldAutoRedirect(result.shouldAutoRedirect);
    setAutoRedirectCountdown(result.autoRedirectCountdown);
    setStatus(result.status);
    setIsLoading(false);
    setIsProcessing(false);
  }, []);

  const statusConfig = useMemo<StatusConfig>(() => {
    const configs: Record<PaymentStatus, StatusConfig> = {
      pending: {
        icon: Clock,
        title: 'Paiement en cours',
        description: paymentKind === 'book'
          ? 'Votre paiement est en cours de traitement. Préparation de votre lien de téléchargement...'
          : 'Votre paiement est en cours de traitement. Veuillez patienter...',
        color: 'text-yellow-600',
        gradient: 'from-[#F8C96E]/18 via-[#4F83D1]/14 to-[#2E5AA6]/20',
        iconBg: 'bg-[#EEF5FF] dark:bg-[#1B3568]',
        iconColor: 'text-yellow-600',
        showDetails: true,
      },
      paid: {
        icon: CheckCircle2,
        title: 'Paiement réussi !',
        description: paymentKind === 'book'
          ? 'Votre livre est prêt à être téléchargé.'
          : 'Votre consultation a été créée avec succès !',
        color: 'text-green-600',
        gradient: 'from-[#4F83D1]/18 via-[#9BC2FF]/18 to-[#DDE7FA]/22',
        iconBg: 'bg-[#EEF5FF] dark:bg-[#1B3568]',
        iconColor: 'text-green-600',
        showDetails: true,
      },
      failure: {
        icon: XCircle,
        title: 'Paiement échoué',
        description: 'Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer.',
        color: 'text-red-600',
        gradient: 'from-red-500/20 via-[#2E5AA6]/10 to-[#4F83D1]/10',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        showDetails: true,
      },
      'no paid': {
        icon: AlertTriangle,
        title: 'Paiement non effectué',
        description: "Le paiement n'a pas été complété. Vous pouvez réessayer depuis votre profil.",
        color: 'text-orange-600',
        gradient: 'from-orange-500/20 via-[#2E5AA6]/12 to-[#4F83D1]/12',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        showDetails: false,
      },
      already_used: {
        icon: CheckCircle,
        title: 'Paiement déjà enregistré',
        description: paymentKind === 'book'
          ? 'Cette transaction a déjà été validée. Vous pouvez récupérer votre lien de téléchargement.'
          : 'Cette transaction a déjà été validée. Retrouvez votre contenu dans vos consultations ou votre bibliothèque.',
        color: 'text-emerald-700',
        gradient: 'from-[#2E5AA6]/14 via-[#4F83D1]/18 to-[#9BC2FF]/18',
        iconBg: 'bg-[#EEF5FF] dark:bg-[#1B3568]',
        iconColor: 'text-emerald-700',
        showDetails: false,
      },
      error: {
        icon: XCircle,
        title: 'Erreur',
        description: error || 'Une erreur inattendue est survenue.',
        color: 'text-red-600',
        gradient: 'from-red-500/20 via-[#2E5AA6]/10 to-[#4F83D1]/10',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        showDetails: false,
      },
    };
    return configs[status];
  }, [status, error, paymentKind]);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('Token de paiement manquant');
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    let pollInterval: number | null = null;
    let pollTimeout: number | null = null;

    const finishWithResult = (result: StoredPaymentCallbackResult) => {
      writeCompletedPaymentCallbackState(result);

      if (isMounted) {
        applyStoredResult(result);
      }
    };

    const failWithError = (message: string, paymentKindValue: PaymentKind, consultationIdValue: string | null = null, downloadUrlValue: string | null = null, summary: PaymentSummary | null = null) => {
      finishWithResult({
        token,
        status: 'error',
        paymentKind: paymentKindValue,
        consultationId: consultationIdValue,
        downloadUrl: downloadUrlValue,
        error: message,
        paymentSummary: summary,
        shouldAutoRedirect: false,
        autoRedirectCountdown: 15,
        createdAt: Date.now(),
      });
    };

    const run = async () => {
      const storedState = readStoredPaymentCallbackState(token);

      if (storedState?.state === 'done' && isStoredPaymentCallbackResultFresh(storedState.result)) {
        applyStoredResult(storedState.result);
        return;
      }

      if (
        storedState?.state === 'processing'
        && Date.now() - storedState.startedAt < PAYMENT_CALLBACK_PROCESSING_WINDOW_MS
      ) {
        pollInterval = window.setInterval(() => {
          const nextState = readStoredPaymentCallbackState(token);
         
          if (nextState?.state === 'done' && isStoredPaymentCallbackResultFresh(nextState.result)) {
            if (pollInterval) {
              window.clearInterval(pollInterval);
            }
            if (pollTimeout) {
              window.clearTimeout(pollTimeout);
            }
            applyStoredResult(nextState.result);
          }
        }, 300);

        pollTimeout = window.setTimeout(() => {
          if (pollInterval) {
            window.clearInterval(pollInterval);
          }

          clearStoredPaymentCallbackState(token);
          void run();
        }, PAYMENT_CALLBACK_PROCESSING_WINDOW_MS);
        return;
      }

      try {
        writeProcessingPaymentCallbackState(token);
        setIsLoading(true);
        setIsProcessing(true);

        if (!token.trim()) {
          failWithError('Token de paiement manquant', urlPaymentKind);
          return;
        }

        const verifyRes = await api.get<PaymentVerifyResponse>(`/payments/verify?token=${token}`);

        if (!verifyRes.data?.success || !verifyRes.data?.data) {
          failWithError(verifyRes.data?.message || 'Impossible de vérifier le paiement', urlPaymentKind);
          return;
        }

        const backendData = verifyRes.data.data;
        const effectivePaymentKind = backendData.paymentType === 'book' || backendData.paymentType === 'consultation'
          ? backendData.paymentType
          : urlPaymentKind;
        const effectiveBookId = backendData.bookId || urlBookId;
        const baseSummary: PaymentSummary = {
          amount: backendData.amount,
          method: backendData.method,
          reference: backendData.reference,
        };

        if (isMounted) {
          setPaymentKind(effectivePaymentKind);
          setPaymentSummary(baseSummary);
          if (backendData.consultationId) {
            setConsultationId(backendData.consultationId);
          }
        }

        const paymentData: PaymentData = {
          _id: backendData._id,
          tokenPay: token,
          numeroSend: '',
          nomclient: '',
          Montant: backendData.amount,
          frais: 0,
          statut: 'paid',
          createdAt: new Date().toISOString(),
          personal_Info: effectivePaymentKind === 'book' && effectiveBookId ? [{ bookId: effectiveBookId, type: 'book' }] : [],
        };

        try {
          const processEndpoint = effectivePaymentKind === 'book' ? '/payments/process-book' : '/payments/process-consultation';
          const processRes = await api.post<ProcessConsultationResponse>(processEndpoint, {
            token,
            paymentData,
          });

          const nextSummary: PaymentSummary = {
            amount: processRes.data?.data?.amount ?? baseSummary.amount,
            method: baseSummary.method,
            reference: processRes.data?.data?.reference ?? baseSummary.reference,
          };
          const nextConsultationId = processRes.data?.consultationId || backendData.consultationId || null;
          const nextDownloadUrl = effectivePaymentKind === 'book' ? processRes.data?.downloadUrl || null : null;

          if (isMounted) {
            setPaymentSummary(nextSummary);
            setConsultationId(nextConsultationId);
          }

          if (processRes.data?.success) {
            if (processRes.data?.status === 'already_used') {
              finishWithResult({
                token,
                status: 'already_used',
                paymentKind: effectivePaymentKind,
                consultationId: nextConsultationId,
                downloadUrl: nextDownloadUrl,
                error: '',
                paymentSummary: nextSummary,
                shouldAutoRedirect: false,
                autoRedirectCountdown: 15,
                createdAt: Date.now(),
              });
              return;
            }

            finishWithResult({
              token,
              status: 'paid',
              paymentKind: effectivePaymentKind,
              consultationId: nextConsultationId,
              downloadUrl: nextDownloadUrl,
              error: '',
              paymentSummary: nextSummary,
              shouldAutoRedirect: effectivePaymentKind === 'consultation',
              autoRedirectCountdown: 15,
              createdAt: Date.now(),
            });
            return;
          }

          const msg = (processRes.data?.message || '').toLowerCase();
          if (msg.includes('déjà') || msg.includes('already')) {
            finishWithResult({
              token,
              status: 'already_used',
              paymentKind: effectivePaymentKind,
              consultationId: nextConsultationId,
              downloadUrl: nextDownloadUrl,
              error: '',
              paymentSummary: nextSummary,
              shouldAutoRedirect: false,
              autoRedirectCountdown: 15,
              createdAt: Date.now(),
            });
            return;
          }

          failWithError(
            processRes.data?.message || 'Erreur lors du traitement du paiement',
            effectivePaymentKind,
            nextConsultationId,
            nextDownloadUrl,
            nextSummary,
          );
        } catch (error: unknown) {
          const nextError = getErrorMessage(error, 'Erreur de traitement du paiement');
          console.error('❌ Erreur traitement consultation:', nextError);
          failWithError(nextError, effectivePaymentKind, backendData.consultationId || null, null, baseSummary);
        }
      } catch (err: unknown) {
        console.error('❌ Erreur globale:', err);
        failWithError(getErrorMessage(err, 'Une erreur inattendue est survenue'), urlPaymentKind);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsProcessing(false);
        }
      }
    };

    void run();

    return () => {
      isMounted = false;
      if (pollInterval) {
        window.clearInterval(pollInterval);
      }
      if (pollTimeout) {
        window.clearTimeout(pollTimeout);
      }
    };
  }, [applyStoredResult, token, urlBookId, urlPaymentKind]);

  useEffect(() => {
    if (!shouldAutoRedirect) return;

    const interval = setInterval(() => {
      setAutoRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (consultationId) {
            router.replace(`/star/consultations/${consultationId}`);
            router.refresh();
          } else {
            router.replace('/star/consultations');
            router.refresh();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [shouldAutoRedirect, consultationId, router]);

  const handleRetry = useCallback(() => {
    router.refresh();
  }, [router]);

  const handleGoHome = useCallback(() => {
    router.replace(paymentKind === 'book' ? '/star/livres' : '/star/profil');
    router.refresh();
  }, [paymentKind, router]);

  const { itemVariants, pulseVariants } = useAnimationVariants();

  return {
    handleRetry, handleGoHome, isLoading, paymentSummary, autoRedirectCountdown, status,
    isProcessing, statusConfig, shouldAutoRedirect, itemVariants, pulseVariants,
  };
}