'use client';
import { fadeInUp, useMarcheOffrandesMain } from '@/hooks/marcheoffrandes/useMarcheOffrandesMain';
import { Offering } from '@/lib/interfaces';
import { motion } from 'framer-motion';
import { AlertCircle, Plus, ShoppingCart } from 'lucide-react';
import React from 'react';
import { CartModal } from './CartModal';
import CheckoutModal from './CheckoutModal';

interface OfferingCardProps {
  offering: Offering;
  onAddToCart: (offering: Offering) => void;
}

export const OfferingCard: React.FC<OfferingCardProps> = ({ offering, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(offering);
  };

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 
                     border-2 border-gray-200 dark:border-gray-700 
                     shadow-md hover:shadow-xl transition-all group cursor-pointer"
    >

      <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-1 text-center 
                         group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
        {offering.name}
      </h3>

      <div className="text-center mb-3 sm:mb-4 py-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
        <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
          {offering.price.toLocaleString()} F
        </p>
      </div>
      <div className="space-y-2">
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 
                             hover:from-amber-600 hover:to-orange-700
                             text-white py-3 sm:py-3.5 rounded-xl font-bold 
                             shadow-md hover:shadow-lg active:scale-95 transition-all 
                             flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Ajouter au panier
        </button>
      </div>
    </motion.div>
  );
};

export const LoadingState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-16 sm:py-20"
  >
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="text-4xl mb-4"
    >
      🌀
    </motion.span>
    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
      Chargement des jetons...
    </p>
  </motion.div>
);

export const EmptyState = ({ onReset }: { onReset: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col items-center justify-center py-16 sm:py-20"
  >
    <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
      <span className="text-4xl">🔍</span>
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
      Aucun jeton trouvé
    </h3>
    <button
      onClick={onReset}
      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-bold rounded-xl transition-colors shadow-lg hover:shadow-xl active:scale-95"
    >
      Voir tous les jetons
    </button>
  </motion.div>
);

export const ErrorState = ({ error, onRetry }: { error: string; onRetry?: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-16 sm:py-20"
  >
    <div className="w-16 h-16 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-4">
      <span className="text-3xl">❌</span>
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
      Erreur de chargement
    </h3>
    <p className="text-sm text-red-600 dark:text-red-400 text-center max-w-md mb-4">
      {error}
    </p>

    {onRetry && (
      <button
        onClick={onRetry}
        className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors active:scale-95"
      >
        Réessayer
      </button>
    )}
  </motion.div>
);

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
    loading, error, cart, cartTotal, cartCount,
    filteredOfferings, showCart, showCheckout, simulationStep, handleProceedToCheckout,
    handleRetry, addToCart, removeFromCart, updateQuantity, clearCart, openCart, closeCart,
    handleResetCategory, handleSimulatedPayment, handleClose,
  } = useMarcheOffrandesMain();

  if (loading) return <LoadingState />;
  if (error) return <div aria-live="polite"><ErrorState error={typeof error === 'string' ? error : (error ? String(error) : '')} onRetry={handleRetry} /></div>;
  if (filteredOfferings.length === 0) return <EmptyState onReset={handleResetCategory} />;

  return (
    <main id="marche-offrandes-main" aria-labelledby="marche-offrandes-title">
      <h1 id="marche-offrandes-title" className="sr-only">Marché des Offrandes</h1>
      <div className="relative white flex flex-col items-center justify-center mt-8">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 max-w-7xl flex flex-col items-center justify-center">
          <div className="mb-4 sm:mb-6 w-full flex justify-center items-center">
            <div className="text-center mb-6 sm:mb-10 w-full flex flex-col items-center justify-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black   mb-3 sm:mb-4   text-center drop-shadow">
                ACQUERIR DES JETONS
              </h2>
            </div>
          </div>

          <div className="w-full flex justify-center items-center">
            <div className="w-full flex justify-center items-center">
              <section key="offerings-list"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 mb-6 sm:mb-8 items-center justify-center"
                role="region"
                aria-label="Liste des offrandes disponibles"
              >
                {filteredOfferings.map((offering) => (
                  <div key={offering._id || offering.id} className="h-full flex items-center justify-center">
                    <OfferingCard offering={offering} onAddToCart={addToCart} />
                  </div>
                ))}
              </section>
            </div>
          </div>
        </div>

        {cartCount > 0 && (
          <div className="fixed bottom-4 sm:bottom-6 left-0 w-full flex justify-center items-center z-40">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={openCart}
              className="w-28 h-28 sm:w-28 sm:h-28 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-2xl flex items-center justify-center text-white active:scale-90 transition-transform relative"
            >
              <ShoppingCart className="w-12 h-12 sm:w-14 sm:h-14" />
              <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center text-xxs font-black border-2 border-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            </motion.button>
          </div>
        )}

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
          error={error}
          handleRetry={handleRetry}
          handleClose={handleClose}
          handleSimulatedPayment={handleSimulatedPayment}
        />
        <div className="h-16 sm:h-20 w-full" />
      </div>
    </main>
  );
}