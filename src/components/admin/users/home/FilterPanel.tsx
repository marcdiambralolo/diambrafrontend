'use client';
import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const filterPanelVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.2 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.15 } }
};

type UserStatus = 'all' | 'active' | 'inactive';
type UserRole = 'all' | 'USER' | 'ADMIN' | 'SUPER_ADMIN';

interface FilterPanelProps {
  statusFilter: UserStatus;
  roleFilter: UserRole;
  loading: boolean;
  hasActiveFilters: boolean;
  onStatusChange: (status: UserStatus) => void;
  onRoleChange: (role: UserRole) => void;
  onReset: () => void;
}

const FilterPanel = memo<FilterPanelProps>(({ statusFilter, roleFilter, loading, hasActiveFilters, onStatusChange, onRoleChange, onReset }) => (
  <motion.div
    variants={filterPanelVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="bg-white dark:bg-[#162A56] border border-cosmic-indigo dark:border-cosmic-pink rounded-lg p-3 mt-2 overflow-hidden shadow-sm"
  >
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-medium text-cosmic-indigo dark:text-cosmic-pink mb-1.5 block">Statut</label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as UserStatus)}
          disabled={loading}
          className="w-full bg-white dark:bg-[#162A56] border border-cosmic-indigo dark:border-cosmic-pink text-sm text-cosmic-purple dark:text-cosmic-pink px-2 py-2 rounded-lg focus:ring-2 focus:ring-cosmic-indigo dark:focus:ring-cosmic-pink focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-[#0F1C3F] disabled:cursor-not-allowed transition-all"
          aria-label="Filtrer par statut"
        >
          <option value="all">Tous statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
        </select>
      </div>
      
      <div>
        <label className="text-xs font-medium text-cosmic-indigo dark:text-cosmic-pink mb-1.5 block">Rôle</label>
        <select
          value={roleFilter}
          onChange={(e) => onRoleChange(e.target.value as UserRole)}
          disabled={loading}
          className="w-full bg-white dark:bg-[#162A56] border border-cosmic-indigo dark:border-cosmic-pink text-sm text-cosmic-purple dark:text-cosmic-pink px-2 py-2 rounded-lg focus:ring-2 focus:ring-cosmic-indigo dark:focus:ring-cosmic-pink focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-[#0F1C3F] disabled:cursor-not-allowed transition-all"
          aria-label="Filtrer par rôle"
        >
          <option value="all">Tous rôles</option>
          <option value="USER">Utilisateur</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
    </div>
    <AnimatePresence>
      {hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          onClick={onReset}
          disabled={loading}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mt-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <X className="w-3 h-3" />
          Réinitialiser les filtres
        </motion.button>
      )}
    </AnimatePresence>
  </motion.div>
));

FilterPanel.displayName = 'FilterPanel';

export default FilterPanel;