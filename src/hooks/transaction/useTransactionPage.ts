import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useRef } from "react";
import { api } from "@/lib/api/client";

// ==================== TYPES AMÉLIORÉS ====================
export interface TransactionItem {
    offeringId: string;
    quantity: number;
    name: string;
    category: string;
    unitPrice: number;
    totalPrice: number;
}

export interface Transaction {
    nom: any;
    _id: string;
    transactionId: string;
    paymentToken?: string;
    status: "pending" | "completed" | "failed" | "cancelled";
    totalAmount: number;
    items: TransactionItem[];
    paymentMethod?: string;
    completedAt?: string;
    createdAt: string;
    phone?: string;
    nomclient?: string;
    numeroSend?: string;
}

export interface PaymentInitiationResponse {
    success: boolean;
    paymentUrl?: string;
    tokenPay?: string;
    transactionId?: string;
    message?: string;
}


export const PAYMENT_METHODS = [
    { id: "orange-money-ci", name: "Orange Money", icon: "📱", color: "orange" },
    { id: "mtn-ci", name: "MTN Money", icon: "📱", color: "blue" },
    { id: "moov-ci", name: "Moov Money", icon: "📱", color: "yellow" },
    { id: "wave-ci", name: "Wave", icon: "🌊", color: "green" },
] as const;

export interface TransactionItem {
    offeringId: string;
    quantity: number;
    name: string;
    category: string;
    unitPrice: number;
    totalPrice: number;
}

export interface Transaction {
    nom: any;
    _id: string;
    transactionId: string;
    paymentToken?: string;
    status: "pending" | "completed" | "failed" | "cancelled";
    totalAmount: number;
    items: TransactionItem[];
    paymentMethod?: string;
    completedAt?: string;
    createdAt: string;
    phone?: string;
    nomclient?: string;
    numeroSend?: string;
}

export interface PaymentInitiationResponse {
    success: boolean;
    paymentUrl?: string;
    tokenPay?: string;
    transactionId?: string;
    message?: string;
}

export type PaymentStatus = "idle" | "initiating" | "pending_user_action" | "verifying" | "success" | "error";

export function useTransactionPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("orange-money-ci");

    const hasInitiatedPayment = useRef(false);
    const verificationAttempts = useRef(0);

    const transactionId = searchParams?.get("transactionId");
    const tokenPay = searchParams?.get("tokenPay");
    const status = searchParams?.get("status");
    const consultationId = searchParams?.get("consultationId");

    useEffect(() => {
        if (tokenPay && status && transactionId && !transaction) {
            const verifyPaymentFromCallback = async () => {
                setPaymentStatus("verifying");
                try {
                    const response = await api.post("/payments/moneyfusion/verify", {
                        tokenPay,
                        status,
                        transactionId,
                    });
                    const data = response.data as { success: boolean; transaction?: Transaction };
                    if (data.success && data.transaction) {
                        setTransaction(data.transaction);
                        setPaymentStatus(data.transaction.status === "completed" ? "success" : "error");
                        if (data.transaction.status !== "completed") {
                            setPaymentError("Le paiement n'a pas été confirmé. Veuillez réessayer.");
                        }
                    } else {
                        setPaymentStatus("error");
                        setPaymentError("La vérification du paiement a échoué.");
                    }
                } catch (err: any) {
                    setPaymentStatus("error");
                    setPaymentError(err?.response?.data?.message || "Erreur lors de la vérification");
                } finally {
                    setIsLoading(false);
                }
            };
            verifyPaymentFromCallback();
        }
    }, [tokenPay, status, transactionId, transaction]);

    useEffect(() => {
        if (!transactionId || tokenPay) return;
        const fetchTransaction = async () => {
            try {
                const response = await api.get(`/wallet/transactions/${transactionId}`);
                const tx = response.data as Transaction;
                setTransaction(tx);
                if (tx.status === "completed") {
                    setPaymentStatus("success");
                } else if (tx.status === "failed" || tx.status === "cancelled") {
                    setPaymentStatus("error");
                    setPaymentError("Cette transaction n'est plus valide.");
                }
            } catch (err: any) {
                setError(err?.response?.data?.message || "Transaction introuvable");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTransaction();
    }, [transactionId, tokenPay]);

    const initiatePayment = useCallback(async () => {
        if (!transaction || paymentStatus !== "idle" || hasInitiatedPayment.current) return;
        hasInitiatedPayment.current = true;
        setPaymentStatus("initiating");
        setPaymentError(null);
        if (!transaction.nomclient && !transaction.nom) {
            setPaymentError("Informations client manquantes.");
            setPaymentStatus("error");
            hasInitiatedPayment.current = false;
            return;
        }
        if (!transaction.numeroSend && !transaction.phone) {
            setPaymentError("Numéro de téléphone client manquant.");
            setPaymentStatus("error");
            hasInitiatedPayment.current = false;
            return;
        }
        if (transaction.items.length === 0) {
            setPaymentError("Aucun article dans la transaction.");
            setPaymentStatus("error");
            hasInitiatedPayment.current = false;
            return;
        }
        try {
            const payload = {
                totalPrice: transaction.totalAmount,
                articles: transaction.items.map(item => ({
                    name: item.name,
                    value: item.unitPrice,
                    quantity: item.quantity,
                })),
                nomclient: transaction.nomclient || transaction.nom || "",
                numeroSend: transaction.numeroSend || transaction.phone || "",
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}/star/transaction`,
                webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/moneyfusion/webhook`,
                personal_Info: {
                    transactionId: transaction._id,
                    consultationId: consultationId || null,
                    originalTransactionId: transaction.transactionId,
                },
                withdraw_mode: selectedPaymentMethod,
                countryCode: "ci",
            };
            const response = await api.post<PaymentInitiationResponse>(
                "/payments/moneyfusion/initiate",
                payload
            );
            const data = response.data;
            if (data.success && data.paymentUrl) {
                setPaymentStatus("pending_user_action");
                window.location.href = data.paymentUrl;
            } else {
                throw new Error(data.message || "Échec de l'initiation du paiement");
            }
        } catch (err: any) {
            setPaymentStatus("error");
            setPaymentError(err?.response?.data?.message || err.message || "Erreur de communication avec le service de paiement");
            hasInitiatedPayment.current = false;
        }
    }, [transaction, selectedPaymentMethod, paymentStatus, consultationId]);

    useEffect(() => {
        if (paymentStatus !== "pending_user_action" && paymentStatus !== "verifying") return;
        const interval = setInterval(async () => {
            if (verificationAttempts.current >= 24) {
                clearInterval(interval);
                if (paymentStatus === "pending_user_action") {
                    setPaymentStatus("error");
                    setPaymentError("Le délai de vérification a expiré. Veuillez contacter le support.");
                }
                return;
            }
            verificationAttempts.current++;
            try {
                const response = await api.get(`/wallet/transactions/${transaction?._id}/status`);
                const tx = response.data as Transaction;
                if (tx.status === "completed") {
                    setTransaction(tx);
                    setPaymentStatus("success");
                    clearInterval(interval);
                } else if (tx.status === "failed" || tx.status === "cancelled") {
                    setPaymentStatus("error");
                    setPaymentError("Le paiement a échoué. Veuillez réessayer.");
                    clearInterval(interval);
                }
            } catch { }
        }, 5000);
        return () => clearInterval(interval);
    }, [paymentStatus, transaction?._id]);

    useEffect(() => {
        if (paymentStatus === "success" && consultationId) {
            const redirectTimer = setTimeout(() => {
                router.push(`/consultations/${consultationId}/success`);
            }, 3000);
            return () => clearTimeout(redirectTimer);
        }
    }, [paymentStatus, consultationId, router]);

    const handleRetry = () => {
        hasInitiatedPayment.current = false;
        verificationAttempts.current = 0;
        setPaymentStatus("idle");
        setPaymentError(null);
    };

    return {
        transaction,
        isLoading,
        error,
        paymentStatus,
        paymentError,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        initiatePayment,
        handleRetry,
        totalAmount: transaction?.totalAmount || 0,
        consultationId,
        router,
    };
}
