'use client';
import NextImage from '@/components/commons/NextImage';
import { CategoryInfo, fadeInUp, useMarcheOffrandesMain } from '@/hooks/marcheoffrandes/useMarcheOffrandesMain';
import { Offering } from '@/lib/interfaces';
import { motion,Variants  } from 'framer-motion';
import { AlertCircle, Leaf, Package, Plus, ShoppingCart, Sparkles, Wine } from 'lucide-react';
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
      <div className="mb-3 sm:mb-4 text-center group-hover:scale-110 transition-transform">
                <span className="text-gray-300 dark:text-gray-600 text-5xl sm:text-6xl">🖼️</span>

      </div>

      <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-1 text-center 
                         group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
        {offering.name}
      </h3>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center 
                        mb-3 sm:mb-4 min-h-[32px] sm:min-h-[40px] px-1 line-clamp-2">
        {offering.description}
      </p>

      <div className="text-center mb-3 sm:mb-4 py-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
        <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
          {offering.price.toLocaleString()} F
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          ≈ ${offering.priceUSD.toFixed(1)} USD
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
      Chargement des offrandes...
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
      Aucune offrande trouvée
    </h3>

    <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-sm mb-4 px-4">
      Essayez une autre catégorie ou consultez toutes les offrandes disponibles
    </p>
    <button
      onClick={onReset}
      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-bold rounded-xl transition-colors shadow-lg hover:shadow-xl active:scale-95"
    >
      Voir toutes les offrandes
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
    offerings, loading, error, selectedCategory, cart, cartTotal, cartCount,
    filteredOfferings, showCart, showCheckout, simulationStep, handleProceedToCheckout,
    handleRetry, addToCart, removeFromCart, updateQuantity, clearCart, openCart, closeCart,
    setSelectedCategory, handleResetCategory, handleSimulatedPayment, handleClose,
  } = useMarcheOffrandesMain();

  const categories: CategoryInfo[] = [
    { id: 'all', name: 'Tout', icon: Sparkles, count: offerings.length },
    { id: 'animal', name: 'Animales', icon: Package, count: offerings.filter(o => o.category === 'animal').length },
    { id: 'vegetal', name: 'Végétales', icon: Leaf, count: offerings.filter(o => o.category === 'vegetal').length },
    { id: 'beverage', name: 'Boissons', icon: Wine, count: offerings.filter(o => o.category === 'beverage').length },
  ];

  if (loading) return <LoadingState />;
  if (error) return <div aria-live="polite"><ErrorState error={typeof error === 'string' ? error : (error ? String(error) : '')} onRetry={handleRetry} /></div>;
  if (filteredOfferings.length === 0) return <EmptyState onReset={handleResetCategory} />;

  return (
    <main id="marche-offrandes-main" aria-labelledby="marche-offrandes-title">
      <h1 id="marche-offrandes-title" className="sr-only">Marché des Offrandes</h1>
      <div className="relative white flex flex-col items-center justify-center mt-8">
        <div className="sticky top-0 z-40 bg-gradient-to-r from-[#0F1C3F]/95 to-[#162A56]/95 backdrop-blur-md border-b border-[#2E5AA6] shadow-sm w-full flex items-center justify-center">
          <div className="flex items-center justify-between px-4 py-3 w-full max-w-5xl">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl text-[#4F83D1] drop-shadow">Marché des Offrandes</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs sm:text-sm font-semibold text-[#E5E7EB]">
                {cartCount} article{cartCount !== 1 ? 's' : ''} — <span className="text-[#4F83D1] font-bold">{cartTotal.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 max-w-7xl flex flex-col items-center justify-center">
          <div className="mb-4 sm:mb-6 w-full flex justify-center items-center">
            <div className="text-center mb-6 sm:mb-10 w-full flex flex-col items-center justify-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black   mb-3 sm:mb-4   text-center drop-shadow">
                Bienvenue au marché des offrandes.
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-black max-w-2xl mx-auto leading-relaxed px-2 text-center">
                Ici vous trouverez tout ce dont vous aurez besoin pour votre quête de compréhension des mystères de votre vie.
                Sachez que ces offrandes sont symboliques et représentent les vibrations énergétiques compensatoires, qui correspondent aux demandes que vous allez faire.
              </p>
            </div>
          </div>

          <div className="mb-4 sm:mb-5 w-full flex justify-center items-center">
            <div className="relative w-full flex justify-center items-center">
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#0F1C3F] to-transparent z-10 pointer-events-none sm:hidden" />
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-[#162A56] to-transparent z-10 pointer-events-none sm:hidden" />
              <div className="flex overflow-x-auto gap-2 sm:gap-3 mb-6 sm:mb-8 pb-2 px-4 sm:mx-0 sm:px-0 scrollbar-hide items-center justify-center">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex-shrink-0 px-2 sm:px-5 py-2.5 sm:py-3 rounded-full sm:rounded-2xl font-bold flex items-center gap-2 transition-all text-sm sm:text-base shadow-sm border-2 ${selectedCategory === cat.id
                      ? 'bg-[#2E5AA6] text-white border-[#4F83D1] shadow-lg scale-105'
                      : 'bg-[#0F1C3F] text-[#E5E7EB] border-[#162A56] hover:bg-[#162A56] hover:border-[#2E5AA6] active:scale-95'
                      }`}
                  >
                    <cat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{cat.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-[#2E5AA6] text-white'} transition-colors`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-3 sm:mb-4 w-full flex justify-center items-center">
            <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-2 px-1">
              <p className="text-xs sm:text-sm text-[#4F83D1] font-medium text-center">
                {filteredOfferings.length} offrande{filteredOfferings.length !== 1 ? 's' : ''}
                {' '}disponible{filteredOfferings.length !== 1 ? 's' : ''}
              </p>
              {selectedCategory !== 'all' && (
                <button
                  onClick={handleResetCategory}
                  className="text-xs text-[#FFD600] hover:text-[#FFB300] font-semibold transition-colors hover:underline underline-offset-2 text-center"
                >
                  Voir tout
                </button>
              )}
            </div>
          </div>

          <div className="w-full flex justify-center items-center">
            <div className="w-full flex justify-center items-center">
              <section key={selectedCategory}
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