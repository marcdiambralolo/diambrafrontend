'use client';
import React from 'react';
import { Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';

type PaymentStatus = 'all' | 'pending' | 'completed' | 'failed' | 'cancelled';
type PaymentMethod = 'all' | 'orange_money' | 'mtn_money' | 'moov_money' | 'wave';

interface PaymentsFiltersProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  statusFilter: PaymentStatus;
  setStatusFilter: (v: PaymentStatus) => void;
  methodFilter: PaymentMethod;
  setMethodFilter: (v: PaymentMethod) => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  handleResetFilters: () => void;
}

const PaymentsFilters: React.FC<PaymentsFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
  showFilters,
  setShowFilters,
  handleResetFilters,
}) => (
  <div className="mb-4">
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Rechercher (ref, nom, tel)..."
          className="w-full bg-white border border-gray-300 text-sm text-gray-900 pl-8 pr-8 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg font-medium transition-all ${showFilters || statusFilter !== 'all' || methodFilter !== 'all' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
      >
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">Filtres</span>
      </button>
    </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-3 mt-2"
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Statut</label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as PaymentStatus)}
                className="w-full bg-white border border-gray-300 text-sm text-gray-900 px-2 py-1.5 rounded focus:ring-2 focus:ring-green-400"
              >
                <option value="all">Tous</option>
                <option value="completed">Réussis</option>
                <option value="pending">En attente</option>
                <option value="failed">Échoués</option>
                <option value="cancelled">Annulés</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Méthode</label>
              <select
                value={methodFilter}
                onChange={e => setMethodFilter(e.target.value as PaymentMethod)}
                className="w-full bg-white border border-gray-300 text-sm text-gray-900 px-2 py-1.5 rounded focus:ring-2 focus:ring-green-400"
              >
                <option value="all">Tous</option>
                <option value="orange_money">Orange Money</option>
                <option value="mtn_money">MTN Money</option>
                <option value="moov_money">Moov Money</option>
                <option value="wave">Wave</option>
              </select>
            </div>
          </div>
          {(statusFilter !== 'all' || methodFilter !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1 mt-2"
            >
              <X className="w-3 h-3" />
              Réinitialiser
            </button>
          )}
        </motion.div>
      )}
  </div>
);

export default PaymentsFilters;