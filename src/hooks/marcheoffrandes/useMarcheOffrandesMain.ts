"use client";
import { api } from "@/lib/api/client";
import { QUERY_KEYS } from "@/lib/cache/queryClient";
import { useAuth } from "@/lib/hooks";
import type { Offering } from "@/lib/interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { Variants } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const STEPS: SimulationStep[] = ["processing", "validating", "saving", "success"];

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

export const STEP_WIDTHS = {
  idle: "0%",
  processing: "25%",
  validating: "50%",
  saving: "75%",
  success: "100%"
} as const;

export const slideFromBottom: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.2 } }
};

export type SimulationStep = "idle" | "processing" | "validating" | "saving" | "success";

export const SIMULATION_STEPS = {
  processing: { duration: 2000, label: "Traitement de la commande..." },
  validating: { duration: 2000, label: "Validation des jetons..." },
  saving: { duration: 2000, label: "Enregistrement de la transaction..." },
  success: { duration: 3000, label: "Opération réalisée avec succès !" },
};

interface CartItem extends Offering {
  _id: string;
  quantity: number;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useMarcheOffrandesMain() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const monjeu = searchParams?.get("monjeu");
 const { user } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [simulationStep, setSimulationStep] = useState<SimulationStep>("idle");

  const isSubmittingRef = useRef(false);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );


  const addToCart = useCallback((offering: Offering) => {
    setCart((prev) => {
      const uniqueId = offering._id || offering.id;
      if (!uniqueId) return prev;

      const existingIndex = prev.findIndex(
        (item) => item._id === uniqueId || item.id === uniqueId
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }

      return [
        ...prev,
        {
          ...offering,
          _id: String(uniqueId),
          id: uniqueId,
          quantity: 1,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item._id !== id && item.id !== id) return item;
          const nextQuantity = Math.max(0, item.quantity + delta);
          return nextQuantity === 0 ? null : { ...item, quantity: nextQuantity };
        })
        .filter(Boolean) as CartItem[]
    );
  }, []);

  const handleSimulatedPayment = useCallback(async () => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    setSimulationStep("processing");
    await sleep(400);

    try {
      await sleep(200); // Petit délai pour l'UX

      setSimulationStep("validating");
      await sleep(200);

      const timestamp = Date.now();
      const randomSuffix = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID().slice(0, 8).toUpperCase()
        : Math.random().toString(36).substring(2, 8).toUpperCase();

      const paymentToken = `SIM-${timestamp}-${randomSuffix}`;
      const transactionId = `TXN-SIM-${timestamp}`;

      const transactionData = {
        transactionId,
        paymentToken,
        status: "completed",
        totalAmount: cartTotal,
        items: cart.map((item) => {
          const offeringId = item._id || item.id;
          return {
            offeringId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
          };
        }),
        paymentMethod: "simulation",
        completedAt: new Date().toISOString(),
      };

      setSimulationStep("saving");
      await sleep(200);
      const response = await api.post<any>("/wallet/transactions", transactionData, {
        timeout: 30000, // 30 secondes timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });


      if (!response || (response.status && response.status >= 400)) {
        throw new Error(response?.data?.message || `Erreur HTTP ${response?.status}`);
      }

      try {
        localStorage.setItem("last_simulated_purchase", JSON.stringify(transactionData));
        localStorage.setItem("payment_token", paymentToken);
        localStorage.setItem("transaction_id", transactionId);
      } catch (storageError) {
        console.warn("⚠️ LocalStorage non disponible:", storageError);
      }

      try {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WALLET_TRANSACTIONS }),
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WALLET_UNUSED_OFFERINGS }),
        ]);
      } catch (queryError) {
        console.warn("⚠️ Erreur lors de l'invalidation des queries:", queryError);
      }

      setSimulationStep("success");

      const qs = new URLSearchParams();
      const query = qs.toString();
      let walletUrl = `/star/profil${query ? `?${query}` : ""}`;
      if (monjeu) {
        walletUrl= `/star/choix/${monjeu}`;
      }

      const transactionIdParam = `transactionId=${encodeURIComponent(transactionId)}`;
      const redirectUrl = walletUrl.includes('?')
        ? `${walletUrl}&${transactionIdParam}&monjeu=${monjeu}`
        : `${walletUrl}?${transactionIdParam}&monjeu=${monjeu}`;

      if (user && user.secretCode) {
        router.push(redirectUrl);
      } else {
        router.push(`/star/profil/doors?monjeu=${monjeu}`);
      }

    } catch (err: unknown) {
      console.error("❌ [CheckoutModal] Erreur détaillée:", err);
      setSimulationStep("idle");
    } finally {
      if (simulationStep !== "success") {
        isSubmittingRef.current = false;
      }
    }
  }, [cart, cartTotal, queryClient, router, simulationStep]);

  const monoffre: Offering = {
    _id: "6945ae01b8af14d5f56cec09",
    name: "Jeton",
    price: 200,
    createdAt: "2025-12-19T19:56:49.465Z",
    updatedAt: "2026-04-25T23:40:33.398Z",
    id: "6945ae01b8af14d5f56cec09",
    offeringId: "6945ae01b8af14d5f56cec09",
    quantity: 1,
  };

  useEffect(() => {
    addToCart(monoffre);
  }, []);

  const handleAddToCart = useCallback(() => {
    addToCart(monoffre);
  }, [addToCart, monoffre]);

  const isProcessing = simulationStep !== "idle";

  return {
    cart, cartTotal, monoffre, simulationStep, showPaymentProgress: isProcessing,
    updateQuantity, handleAddToCart, handleSimulatedPayment,
  };
}