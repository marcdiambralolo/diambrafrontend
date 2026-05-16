'use client';
import { fadeInUp, useMarcheOffrandesMain } from '@/hooks/marcheoffrandes/useMarcheOffrandesMain';
 import { Offering } from '@/lib/interfaces';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { AlertCircle, CheckCircle2, ChevronRight, CreditCard, Loader2, Plus, ShoppingCart, Sparkles, X } from 'lucide-react';
import React from 'react';

export type SimulationStep = "idle" | "processing" | "validating" | "saving" | "success";


export const SIMULATION_STEPS = {
    processing: { duration: 20, label: "Traitement de la commande..." },
    validating: { duration: 20, label: "Validation des jetons..." },
    saving: { duration: 20, label: "Enregistrement de la transaction..." },
    success: { duration: 50, label: "Opération réalisée avec succès !" },
};

function SimulationProgress({ step }: { step: SimulationStep }) {
  const steps: SimulationStep[] = ["processing", "validating", "saving", "success"];
  const currentIndex = steps.indexOf(step);

  return (
    <div className="space-y-4">
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-600"
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
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20"
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
  }>;
  totalAmount: number;
  simulationStep: SimulationStep;
  error?: string | null;
  handleRetry: () => void;
  handleClose: () => void;
  handleSimulatedPayment: () => void;
}

function CheckoutModal({
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 
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
                       bg-gradient-to-r from-amber-500 to-orange-600
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
                               bg-gradient-to-r from-amber-50 to-orange-50
                               dark:from-amber-950/20 dark:to-orange-950/20
                               rounded-lg border border-amber-200 dark:border-amber-800">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Total à payer
                  </span>
                  <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
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
                className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 
                         hover:from-amber-600 hover:to-orange-700 
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

interface CartModalTotalActionsProps {
  cartTotal: number;
  onProceedToCheckout: () => void;
  onClearCart: () => void;
}

const CartModalTotalActions: React.FC<CartModalTotalActionsProps> = ({ cartTotal, onProceedToCheckout, onClearCart }) => (
  <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4 mb-4">
    <div className="flex items-center justify-between mb-6">
      <span className="text-xl sm:text-2xl font-black text-white dark:text-white">Total</span>
      <div className="text-right">
        <p className="text-2xl sm:text-3xl font-black text-white dark:text-white">
          {cartTotal.toLocaleString()} F
        </p>
        <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-400">
          ≈ ${(cartTotal / 563.5).toFixed(2)} USD
        </p>
      </div>
    </div>

    <div className="space-y-2">
      <button
        onClick={onProceedToCheckout}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 rounded-xl font-black text-base sm:text-lg shadow-xl hover:shadow-2xl active:scale-98 transition-all flex items-center justify-center gap-3"
      >
        <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
        Procéder au paiement
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={onClearCart}
        className="w-full py-3 text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl active:scale-95 transition-all"
      >
        Vider le panier
      </button>
    </div>
  </div>
);

export interface CartItem extends Offering {
  _id: string;
  quantity: number;
}

interface CartModalItemProps {
  item: CartItem;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveFromCart: (id: string) => void;
}

const CartModalItem: React.FC<CartModalItemProps> = ({ item, onUpdateQuantity, onRemoveFromCart }) => {
  const itemId = item._id || item.id;
  return (
    <div
      className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
    >
      <span className="text-gray-300 dark:text-gray-600 text-5xl sm:text-6xl">🖼️</span>

      <div className="flex-grow min-w-0">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">{item.name}</h3>
        <p className="text-xs sm:text-sm text-black dark:text-gray-400">
          {item.price.toLocaleString()} F × {item.quantity}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onUpdateQuantity(itemId, -1)}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-amber-500 active:scale-90 flex items-center justify-center transition-all"
        >
          <Plus className="w-4 h-4 rotate-45" />
        </button>
        <span className="font-bold text-base sm:text-lg w-6 sm:w-8 text-center text-gray-900 dark:text-white">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(itemId, 1)}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-amber-500 active:scale-90 flex items-center justify-center transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <button
        onClick={() => onRemoveFromCart(itemId)}
        className="text-red-500 hover:text-red-700 active:scale-90 transition-all p-2"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

interface CartModalEmptyProps {
  onClose: () => void;
}

const CartModalEmpty: React.FC<CartModalEmptyProps> = ({ onClose }) => (
  <div className="text-center py-12">
    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
      <ShoppingCart className="w-10 h-10 text-white" />
    </div>
    <p className="text-gray-400 text-lg font-medium mb-6">Votre panier est vide</p>
    <button
      onClick={onClose}
      className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 active:scale-95 transition-all shadow"
    >
      Continuer mes achats
    </button>
  </div>
);

interface CartModalHeaderProps {
  cartCount: number;
  cartTotal: number;
  onClose: () => void;
}

const CartModalHeader: React.FC<CartModalHeaderProps> = ({ cartCount, cartTotal, onClose }) => (
  <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-600 z-10 p-4 sm:p-6 border-b border-amber-400 rounded-t-3xl shadow-md">
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 drop-shadow">
        <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7" />
        Mon Panier
      </h2>
      <button
        onClick={onClose}
        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 active:scale-90 flex items-center justify-center transition-all shadow"
      >
        <X className="w-6 h-6 text-white" />
      </button>
    </div>
    {cartCount > 0 && (
      <p className="text-sm text-white/90">
        {cartCount} jeton{cartCount > 1 ? 's' : ''} · {cartTotal.toLocaleString()} F
      </p>
    )}
  </div>
);

interface CartModalProps {
  showCart: boolean;
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  onClose: () => void;
  onProceedToCheckout: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveFromCart: (id: string) => void;
  onClearCart: () => void;
}

const slideFromBottom: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.2 } }
};

const CartModal: React.FC<CartModalProps> = ({
  showCart,
  cart,
  cartTotal,
  cartCount,
  onClose,
  onProceedToCheckout,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart
}) => {

  return (
    <AnimatePresence>
      {showCart && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            variants={slideFromBottom}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-gray-900 to-gray-950 rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto shadow-2xl border-t-2 border-amber-500"
          >
            <CartModalHeader cartCount={cartCount} cartTotal={cartTotal} onClose={onClose} />
            <div className="p-4 sm:p-6">
              {cart.length === 0 ? (
                <CartModalEmpty onClose={onClose} />
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <CartModalItem
                        key={item._id || item.id}
                        item={item}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemoveFromCart={onRemoveFromCart}
                      />
                    ))}
                  </div>

                  <CartModalTotalActions
                    cartTotal={cartTotal}
                    onProceedToCheckout={onProceedToCheckout}
                    onClearCart={onClearCart}
                  />
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ErrorAlert = ({ message, onRetry }: { message: string; onRetry: () => void }) => {

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
          Erreur lors du chargement des données
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

export default function MarcheOffrandesMain() {
  const {
   cart, cartTotal, cartCount, monoffre, showCart, showCheckout, simulationStep,
    handleProceedToCheckout, removeFromCart, updateQuantity, clearCart,
    handleRetry, addToCart, closeCart, handleSimulatedPayment, handleClose,
  } = useMarcheOffrandesMain();
 
  
  return (
    <main id="marche-offrandes-main" aria-labelledby="marche-offrandes-title">     

      <h1 id="marche-offrandes-title" className="sr-only">Acquerir des jetons</h1>
      <div className="relative white flex flex-col items-center justify-center mt-8">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 max-w-7xl flex flex-col items-center justify-center">
          <div className="mb-4 sm:mb-6 w-full flex justify-center items-center">
            <div className="text-center mb-6 sm:mb-10 w-full flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent mb-3 sm:mb-4 text-center drop-shadow">
                  ⚡ ACQUERIR DES JETONS ⚡
                </h2>
              </motion.div>
            </div>
          </div>

          <div className="w-full flex justify-center items-center">
            <div className="w-full flex justify-center items-center">
              <section key="offerings-list"
                className="grid grid-cols-1 gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 mb-6 sm:mb-8 items-center justify-center"
                role="region"
                aria-label="Liste des offrandes disponibles"
              >
                <div key={monoffre._id || monoffre.id} className="h-full flex items-center justify-center">
                  <motion.div
                    variants={fadeInUp}
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 
                     border-2 border-gray-200 dark:border-gray-700 
                     shadow-md hover:shadow-2xl transition-all group cursor-pointer
                     overflow-hidden"
                  >
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-1 text-center 
                         group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                      {monoffre.name}
                    </h3>

                    <div className="text-center mb-3 sm:mb-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-900/50 dark:to-gray-900/50 rounded-xl">
                      <motion.p
                        className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                      >
                        {monoffre.price.toLocaleString()} F
                      </motion.p>
                    </div>

                    <div className="space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(monoffre)}
                        disabled={false}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 
                     hover:from-amber-600 hover:to-orange-700
                     text-white py-3 sm:py-3.5 rounded-xl font-bold 
                     shadow-md hover:shadow-lg active:scale-95 transition-all 
                     flex items-center justify-center gap-2 text-sm sm:text-base
                     disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        
                        Acheter
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <CartModal
          showCart={showCart}
          cart={cart}
          cartTotal={cartTotal}
          cartCount={cartCount}
          onClose={closeCart}
          onProceedToCheckout={handleProceedToCheckout}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          onClearCart={clearCart}
        />

        <CheckoutModal
          isOpen={showCheckout}
          cart={cart}
          totalAmount={cartTotal}
          simulationStep={simulationStep}
          handleRetry={handleRetry}
          handleClose={handleClose}
          handleSimulatedPayment={handleSimulatedPayment}
        />
        <div className="h-16 sm:h-20 w-full" />
      </div>
    </main>
  );
}