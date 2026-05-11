'use client';
import { memo } from 'react';
import { motion,Variants  } from 'framer-motion';
import { Users } from 'lucide-react';

const emptyStateVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 }
  }
};

interface EmptyStateProps {
  hasFilters: boolean;
  onReset: () => void;
}

const EmptyState = memo<EmptyStateProps>(({ hasFilters, onReset }) => (
  <motion.div
    variants={emptyStateVariants}
    initial="hidden"
    animate="visible"
    className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center shadow-sm"
  >
    <div className="mb-4">
      <Users className="w-16 h-16 text-gray-300 mx-auto" />
    </div>
    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
      Aucun utilisateur trouvé
    </h3>
    <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
      {hasFilters
        ? 'Aucun résultat ne correspond à vos critères de recherche'
        : 'Commencez par ajouter votre premier utilisateur'}
    </p>

    {hasFilters && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg font-medium hover:shadow-md hover:from-blue-600 hover:to-blue-700 transition-all"
      >
        Réinitialiser les filtres
      </motion.button>
    )}
  </motion.div>
));

EmptyState.displayName = 'EmptyState';

export default EmptyState;