'use client';
import Pagination from '@/components/admin/users/home/Pagination';
import UserCard from '@/components/admin/users/home/UserCard';
import { User } from '@/lib/interfaces';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { memo } from 'react';

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
 
interface UsersGridProps {
  hasUsers: boolean;
  users: User[];
  containerVariants: Variants;
  cardVariants: Variants;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  handlePageChange: (page: number) => void;
  hasFilters: boolean;
  handleResetFilters: () => void;
}

export const UsersGrid = memo(function UsersGrid({
  hasUsers,
  users,
  containerVariants,
  cardVariants,
  currentPage,
  totalPages,
  loading,
  handlePageChange,
  hasFilters,
  handleResetFilters,
}: UsersGridProps) {
  if (!hasUsers) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="flex justify-center"
      >
        <EmptyState hasFilters={hasFilters} onReset={handleResetFilters} />
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 justify-items-center"
        role="region"
        aria-label="Liste des utilisateurs"
      >
        {users.map((user: User, idx: number) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, type: 'spring', stiffness: 200 }}
            className="w-full max-w-sm min-h-[340px] flex"
            style={{ minHeight: 340, height: '100%' }}
          >
            <div className="flex-1 flex flex-col h-full">
              <UserCard
                user={user}
                cardVariants={cardVariants}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center"
      >
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          onPageChange={handlePageChange}
        />
      </motion.div>
    </div>
  );
});