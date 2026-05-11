import { api } from "@/lib/api/client";
import { QUERY_KEYS, queryClient } from "@/lib/cache/queryClient";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { getErrorMessage } from '@/lib/utils/errorHelpers';

type TransactionResponse = {
    message?: string;
};

export type SimulationStep = "idle" | "processing" | "validating" | "saving" | "success";

type CartItem = {
    _id?: string;
    id?: string;
    name: string;
    quantity: number;
    price: number;
    category?: string;
    icon?: string;
};

export const SIMULATION_STEPS = {
    processing: { duration: 20, label: "Traitement de la commande..." },
    validating: { duration: 20, label: "Validation des offrandes..." },
    saving: { duration: 20, label: "Enregistrement de la transaction..." },
    success: { duration: 50, label: "Opération réalisée avec succès !" },
};

export function useSimulationProgress(onClose: () => void, cart: CartItem[], totalAmount: number,
    onClearCart: () => void, consultationId?: string, categoryId?: string, bookId?: string) {
    const router = useRouter();

    const [simulationStep, setSimulationStep] = useState<SimulationStep>("idle");
    const [error, setError] = useState<string | null>(null);
    const isSubmittingRef = useRef(false);

    const handleRetry = useCallback(() => {
        isSubmittingRef.current = false;
        setError(null);
        setSimulationStep("idle");
    }, []);

    const handleClose = useCallback(() => {
        if (simulationStep !== "idle" && simulationStep !== "success") {
            return;
        }
        onClose();
        isSubmittingRef.current = false;
        setError(null);
        setSimulationStep("idle");
    }, [simulationStep, onClose]);

    const handleSimulatedPayment = useCallback(async () => {
        if (isSubmittingRef.current) {
            return;
        }

        isSubmittingRef.current = true;
        setError(null);
        setSimulationStep("processing");

        try {
            await new Promise((resolve) => setTimeout(resolve, SIMULATION_STEPS.processing.duration));
            setSimulationStep("validating");
            await new Promise((resolve) => setTimeout(resolve, SIMULATION_STEPS.validating.duration));

            if (cart.length === 0) {
                throw new Error("Le panier est vide");
            }

            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
            const paymentToken = `SIM-${timestamp}-${randomSuffix}`;
            const transactionId = `TXN-SIM-${timestamp}`;

            const transactionData = {
                transactionId,
                paymentToken,
                status: "completed",
                totalAmount,
                items: cart.map((item) => {
                    const offeringId = item._id || item.id;

                    return {
                        offeringId,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        category: item.category,
                        icon: item.icon,
                        unitPrice: item.price,
                        totalPrice: item.price * item.quantity,
                    };
                }),
                paymentMethod: "simulation",
                completedAt: new Date().toISOString(),
            };

            setSimulationStep("saving");
            await new Promise((resolve) => setTimeout(resolve, SIMULATION_STEPS.saving.duration));

            const response = await api.post<TransactionResponse>("/wallet/transactions", transactionData);

            if (response.status !== 200 && response.status !== 201) {
                throw new Error(response.data?.message || "Échec de l'enregistrement");
            }

            localStorage.setItem("last_simulated_purchase", JSON.stringify(transactionData));
            localStorage.setItem("payment_token", paymentToken);
            localStorage.setItem("transaction_id", transactionId);

            queryClient.removeQueries({ queryKey: QUERY_KEYS.WALLET_TRANSACTIONS, exact: true });
            queryClient.removeQueries({ queryKey: QUERY_KEYS.WALLET_UNUSED_OFFERINGS, exact: true });

            setSimulationStep("success");

            onClearCart();
            let walletUrl = "/star/wallet";
            const params = [];
            if (consultationId) params.push(`consultationId=${encodeURIComponent(consultationId)}`);
            if (categoryId) params.push(`categoryId=${encodeURIComponent(categoryId)}`);
            if (bookId) params.push(`bookId=${encodeURIComponent(bookId)}`);

            params.push(`r=${Date.now()}`);
            if (params.length > 0) walletUrl += `?${params.join("&")}`;
            router.push(walletUrl);
        } catch (err: unknown) {
            console.error("❌ [CheckoutModal] Erreur simulation:", err);
            isSubmittingRef.current = false;
            setError(getErrorMessage(err, "Une erreur est survenue lors de la simulation"));
            setSimulationStep("idle");
        }
    }, [bookId, cart, categoryId, consultationId, totalAmount, onClearCart, router]);

    return {
        error, simulationStep, setSimulationStep, handleSimulatedPayment,
        setError, handleRetry, handleClose,
    };
}