'use client';
import { fadeInUp, SIMULATION_STEPS, SimulationStep, STEP_WIDTHS, STEPS, useMarcheOffrandesMain } from '@/hooks/marcheoffrandes/useMarcheOffrandesMain';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, CreditCard, Loader2, Plus, ShoppingCart } from 'lucide-react';
import { memo, useCallback } from 'react';

const SimulationProgress = memo(({ step }: { step: SimulationStep }) => {
  const currentIndex = STEPS.indexOf(step);
  const progressWidth = STEP_WIDTHS[step] || "0%";

  return (
    <div className="space-y-4">
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-600"
          initial={{ width: "0%" }}
          animate={{ width: progressWidth }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className="flex justify-between items-center">
        {STEPS.map((s, idx) => {
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
});

const CartItem = memo(({
  item,
  onUpdateQuantity,
}: {
  item: any;
  onUpdateQuantity: (id: string, delta: number) => void;
}) => {
  const itemId = item._id || item.id;

  const handleDecrement = useCallback(() => onUpdateQuantity(itemId, -1), [onUpdateQuantity, itemId]);
  const handleIncrement = useCallback(() => onUpdateQuantity(itemId, 1), [onUpdateQuantity, itemId]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-md transition-shadow"
    >
      <div className="flex-grow min-w-0">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">{item.name}</h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {item.price.toLocaleString()} F × {item.quantity}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleDecrement}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 active:scale-90 flex items-center justify-center transition-all"
          aria-label="Diminuer la quantité"
        >
          <Plus className="w-4 h-4 rotate-45" />
        </button>

        <span className="font-bold text-base sm:text-lg w-6 sm:w-8 text-center text-gray-900 dark:text-white">
          {item.quantity}
        </span>

        <button
          onClick={handleIncrement}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 active:scale-90 flex items-center justify-center transition-all"
          aria-label="Augmenter la quantité"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
});

const ProductCard = memo(({ product, onAddToCart }: { product: any; onAddToCart: () => void }) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ y: -8, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
  >
    <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-2 text-center">
      {product.name}
    </h3>
    <div className="text-center mb-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-900/50 dark:to-gray-900/50 rounded-xl">
      <motion.p
        className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
      >
        {product.price.toLocaleString()} F
      </motion.p>
    </div>

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onAddToCart}
      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-base"
    >
      <ShoppingCart className="w-5 h-5" />
      Ajouter
    </motion.button>
  </motion.div>
));

const CartSummary = memo(({ cartTotal }: { cartTotal: number }) => (
  <>
    <div className="flex items-center justify-between mb-4">
      <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
      <span className="font-bold text-gray-900 dark:text-white">
        {cartTotal.toLocaleString()} F
      </span>
    </div>
    <div className="flex items-center justify-between mb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
      <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
      <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
        {cartTotal.toLocaleString()} F
      </span>
    </div>
  </>
));

const PaymentProgressSection = memo(({ simulationStep }: { simulationStep: SimulationStep }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="bg-white dark:bg-gray-800 mt-16 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-white animate-spin" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        Traitement du paiement
      </h3>
    </div>

    <SimulationProgress step={simulationStep} />

    <AnimatePresence>
      {simulationStep === "success" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 text-center"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
          <p className="text-green-700 dark:text-green-300 font-semibold">
            Paiement réussi !
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            Vos jetons ont été ajoutés à votre compte
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
));

export default function MarcheOffrandesMain() {
  const {
    cart, cartTotal, monoffre, simulationStep, showPaymentProgress,
    updateQuantity, handleAddToCart, handleSimulatedPayment,
  } = useMarcheOffrandesMain();

  if (showPaymentProgress) {
    return <PaymentProgressSection simulationStep={simulationStep} />;
  }

  return (
    <div className="mx-auto px-3 mt-8 sm:px-4 lg:px-6 py-6 sm:py-8 max-w-7xl  dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            ACHAT DE JETONS
          </h2>
        </div>
      </div>

      <div className="p-4 max-h-[600px] overflow-y-auto">
        {!(cart.length > 0) ? (
          <ProductCard product={monoffre} onAddToCart={handleAddToCart} />
        ) : (
          <>
            <div className="space-y-3 mb-4">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <CartItem
                    key={item._id || item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </AnimatePresence>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <CartSummary cartTotal={cartTotal} />

              <button
                onClick={handleSimulatedPayment}
                disabled={!(cart.length > 0)}
                className="w-full bg-gradient-to-r text-3xl from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-5 h-5" />
                Acquerir GRATUITEMENT
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}