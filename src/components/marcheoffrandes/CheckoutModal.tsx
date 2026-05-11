"use client";
import { SIMULATION_STEPS, SimulationStep } from "@/hooks/marcheoffrandes/useSimulationProgress";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, CreditCard, Loader2, ShoppingCart, Sparkles, X } from "lucide-react";
import NextImage from "../commons/NextImage";

export function ErrorAlert({ message, onRetry }: { message: string; onRetry: () => void }) {

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                 rounded-lg p-4 flex items-start gap-3"
    >
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">
          Erreur lors du chargement des données.
        </p>
        <p className="text-xs text-red-600 dark:text-red-300 mt-1">{message}</p>
        <button
          onClick={onRetry}
          className="mt-2 text-xs font-semibold text-red-700 dark:text-red-400 
                     hover:text-red-900 dark:hover:text-red-200 underline"
        >
          Réessayer
        </button>
      </div>
    </motion.div>
  );
}

export function SimulationProgress({ step }: { step: SimulationStep }) {
  const steps: SimulationStep[] = ["processing", "validating", "saving", "success"];
  const currentIndex = steps.indexOf(step);

  return (
    <div className="space-y-4">
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#163A74] to-[#4F83D1]"
          initial={{ width: "0%" }}
          animate={{
            width: step === "idle" ? "0%" :
              step === "processing" ? "25%" :
                step === "validating" ? "50%" :
                  step === "saving" ? "75%" : "100%"
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className="flex justify-between items-center">
        {steps.map((s, idx) => {
          const isActive = idx <= currentIndex;
          const isCurrent = s === step;

          return (
            <motion.div
              key={s}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isActive ? 1 : 0.4,
                scale: isCurrent ? 1.1 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                  ${isActive
                    ? "bg-gradient-to-r from-[#163A74] to-[#4F83D1] text-white shadow-lg shadow-[#2E5AA6]/20"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                  }`}
              >
                {isCurrent && <Loader2 className="w-4 h-4 animate-spin" />}
                {isActive && !isCurrent && <CheckCircle2 className="w-4 h-4" />}
              </div>

              <span className={`text-xs font-medium ${isActive ? "text-gray-900 dark:text-gray-100" : "text-gray-400"}`}>
                {idx + 1}
              </span>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {SIMULATION_STEPS[step as keyof typeof SIMULATION_STEPS]?.label || "Préparation..."}
      </motion.p>
    </div>
  );
}

interface CheckoutModalProps {
  isOpen: boolean;
  cart: Array<{
    _id: string;
    id: string;
    name: string;
    price: number;
    quantity: number;
    category: string;
    description: string;
    illustrationUrl?: string;
  }>;
  totalAmount: number;
  simulationStep: SimulationStep;
  error: string | null;
  handleRetry: () => void;
  handleClose: () => void;
  handleSimulatedPayment: () => void;
}

export default function CheckoutModal({
  isOpen,
  cart,
  totalAmount,
  simulationStep, error, handleRetry, handleClose, handleSimulatedPayment,
}: CheckoutModalProps) {

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-[9999] w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col"
        >
          <div className="relative px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#163A74] to-[#4F83D1] 
                               flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Finaliser l'achat
                  </h3>
                </div>
              </div>

              <button
                onClick={handleClose}
                disabled={simulationStep !== "idle" && simulationStep !== "success"}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 
                         hover:bg-gray-200 dark:hover:bg-gray-700 
                         flex items-center justify-center transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute -top-3 right-6 px-3 py-1 rounded-full 
                       bg-gradient-to-r from-[#163A74] to-[#4F83D1] 
                       text-white text-xs font-semibold shadow-lg 
                       flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" />
              <span>Paiement sécurisé</span>
            </motion.div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {error ? (
              <ErrorAlert message={error} onRetry={handleRetry} />
            ) : simulationStep !== "idle" ? (
              <SimulationProgress step={simulationStep} />
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Récapitulatif
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                    {cart.map((item, idx) => {
                      const itemId = item._id || item.id;
                      return (
                        <motion.div
                          key={itemId}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {item.illustrationUrl ? (
                              <NextImage
                                src={item.illustrationUrl}
                                alt={item.name + ' illustration'}
                                width={96}
                                height={96}
                                className="object-cover w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
                                style={{ width: 'auto', height: 'auto' }}
                                priority
                              />
                            ) : (
                              <span className="text-gray-300 dark:text-gray-600 text-5xl sm:text-6xl">🖼️</span>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Quantité: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {(item.price * item.quantity).toLocaleString()} FCFA
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 
                               bg-gradient-to-r from-[#EEF4FF] to-[#DDE7FA] 
                               dark:from-[#0F1C3F]/60 dark:to-[#162A56]/60 
                               rounded-lg border border-[#9BC2FF] dark:border-[#2E5AA6]">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Total à payer
                  </span>
                  <span className="text-xl font-bold text-[#2E5AA6] dark:text-[#9BC2FF]">
                    {totalAmount.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            )}
          </div>

          {simulationStep === "idle" && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSimulatedPayment}
                disabled={cart.length === 0}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#163A74] to-[#4F83D1] 
                         hover:from-[#0F1C3F] hover:to-[#2E5AA6] 
                         text-white font-semibold shadow-lg 
                         flex items-center justify-center gap-2 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-5 h-5" />
                <span>Effectuer le paiement</span>
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}