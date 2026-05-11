'use client';
import { CreditCard } from 'lucide-react';
import React from 'react';

interface AdminPaymentsEmptyStateProps {
  searchQuery: string;
  statusFilter: string;
  methodFilter: string;
  onResetFilters: () => void;
}

export const AdminPaymentsEmptyState: React.FC<AdminPaymentsEmptyStateProps> = ({
  searchQuery,
  statusFilter,
  methodFilter,
  onResetFilters,
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
    <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />

    <h3 className="text-base font-bold text-gray-900 mb-1">
      Aucun paiement
    </h3>
    <p className="text-sm text-gray-500 mb-4">
      {searchQuery || statusFilter !== 'all' || methodFilter !== 'all'
        ? 'Aucun résultat trouvé'
        : 'Les paiements apparaîtront ici'}
    </p>
    
    {(searchQuery || statusFilter !== 'all' || methodFilter !== 'all') && (
      <button
        onClick={onResetFilters}
        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-lg font-medium hover:shadow-md"
      >
        Réinitialiser
      </button>
    )}
  </div>
);