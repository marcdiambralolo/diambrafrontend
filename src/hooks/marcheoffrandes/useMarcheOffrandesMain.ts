"use client";
import { api } from "@/lib/api/client";
import { QUERY_KEYS } from "@/lib/cache/queryClient";
import type { Offering } from "@/lib/interfaces";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Variants } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";

type OfferingsResponse = {
  offerings?: Offering[];
};

type TransactionResponse = {
  message?: string;
};

export type SimulationStep =
  | "idle"
  | "processing"
  | "validating"
  | "saving"
  | "success";

export type Category = "all" | "banque";

interface CartItem extends Offering {
  _id: string;
  quantity: number;
}

const SIMULATION_STEPS = {
  processing: { duration: 200, label: "Traitement de la commande..." },
  validating: { duration: 300, label: "Validation des offrandes..." },
  saving: { duration: 300, label: "Enregistrement de la transaction..." },
  success: { duration: 300, label: "Commande acceptée avec succès !" },
} as const;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildWalletUrl(params: {
  consultationId?: string;
  categoryId?: string;
  bookId?: string;
}) {
  const qs = new URLSearchParams();
  if (params.consultationId) qs.set("consultationId", params.consultationId);
  if (params.categoryId) qs.set("categoryId", params.categoryId);
  if (params.bookId) qs.set("bookId", params.bookId);
  const query = qs.toString();
  return `/star/transaction${query ? `?${query}` : ""}`;
}

function getSafeErrorMessage(err: unknown, fallback = "Une erreur est survenue pendant la simulation.") {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

export function useMarcheOffrandesMain() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const consultationId = searchParams?.get("consultationId") || "";
  const categoryId = searchParams?.get("categoryId") || "";
  const bookId = searchParams?.get("bookId") || "";

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCartRaw] = useState(false);
  const [showCheckout, setShowCheckoutRaw] = useState(false);
  const [simulationStep, setSimulationStep] = useState<SimulationStep>("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const isSubmittingRef = useRef(false); 

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
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
    setShowCart(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id && item.id !== id));
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

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const setShowCart = useCallback((v: boolean) => setShowCartRaw(v), []);
  const setShowCheckout = useCallback((v: boolean) => setShowCheckoutRaw(v), []);

  const openCart = useCallback(() => {
    setPaymentError(null);
    setShowCheckout(false);
    setShowCart(true);
  }, [setShowCart, setShowCheckout]);

  const closeCart = useCallback(() => setShowCart(false), [setShowCart]);

  const openCheckout = useCallback(() => {
    if (cart.length === 0) return;
    setPaymentError(null);
    setShowCart(false);
    setShowCheckout(true);
  }, [cart.length, setShowCart, setShowCheckout]);

  const closeCheckout = useCallback(() => {
    setShowCheckout(false);
  }, [setShowCheckout]);

  const handleProceedToCheckout = useCallback(() => {
    if (cart.length === 0) return;
    openCheckout();
  }, [cart.length, openCheckout]);


  const handleRetry = useCallback(() => {
    setPaymentError(null);
    router.refresh();
  }, [router]);

  const handleClose = useCallback(() => {
    if (simulationStep !== "idle" && simulationStep !== "success") return;

    closeCheckout();
    isSubmittingRef.current = false;
    setSimulationStep("idle");
    setPaymentError(null);
  }, [simulationStep, closeCheckout]);

  const handleSimulatedPayment = useCallback(async () => {
    if (isSubmittingRef.current) return;

    if (cart.length === 0) {
      setPaymentError("Le panier est vide.");
      return;
    }

    isSubmittingRef.current = true;
    setPaymentError(null);
    setSimulationStep("processing");

    try {
      await sleep(SIMULATION_STEPS.processing.duration);

      setSimulationStep("validating");
      await sleep(SIMULATION_STEPS.validating.duration);

      const timestamp = Date.now();
      const randomSuffix =
        typeof crypto !== "undefined" && "randomUUID" in crypto
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
      await sleep(SIMULATION_STEPS.saving.duration);

      const response = await api.post<TransactionResponse>("/wallet/transactions", transactionData);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data?.message || "Échec de l'enregistrement");
      }

      localStorage.setItem("last_simulated_purchase", JSON.stringify(transactionData));
      localStorage.setItem("payment_token", paymentToken);
      localStorage.setItem("transaction_id", transactionId);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WALLET_TRANSACTIONS }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WALLET_UNUSED_OFFERINGS }),
      ]);

      setSimulationStep("success");
      clearCart();

      await sleep(SIMULATION_STEPS.success.duration);
      // Passe l'id de transaction simulée dans la query string
      const walletUrl = buildWalletUrl({ consultationId, categoryId, bookId });
      const transactionIdParam = `transactionId=${encodeURIComponent(transactionId)}`;
      const redirectUrl = walletUrl.includes('?') ? `${walletUrl}&${transactionIdParam}` : `${walletUrl}?${transactionIdParam}`;
      router.push(redirectUrl);
    } catch (err: unknown) {
      console.error("❌ [CheckoutModal] Erreur simulation:", err);
      setPaymentError(getSafeErrorMessage(err, "Erreur lors de la validation de l’offrande."));
      setSimulationStep("idle");
      isSubmittingRef.current = false;
      return;
    }

    isSubmittingRef.current = false;
  }, [bookId, cart, cartTotal, categoryId, clearCart, consultationId, queryClient, router]);

  const monoffre: Offering = {
    _id: "6945ae01b8af14d5f56cec09",
    name: "Jeton",
    price: 200,
    description: "Symbole de pureté et d'harmonie.",
    createdAt: "2025-12-19T19:56:49.465Z",
    updatedAt: "2026-04-25T23:40:33.398Z",
    id: "6945ae01b8af14d5f56cec09",
    offeringId: "6945ae01b8af14d5f56cec09",
    quantity: 1,
  };

  console.log("Offrande sélectionnée (monoffre) :", monoffre);

  return {
   cart, cartTotal, cartCount, monoffre,
    showCart, showCheckout, simulationStep, paymentError,
    handleRetry, addToCart, removeFromCart, updateQuantity, clearCart, openCart, closeCart,
    handleProceedToCheckout, handleSimulatedPayment, handleClose,
  };
}