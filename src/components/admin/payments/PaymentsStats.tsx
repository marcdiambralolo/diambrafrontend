'use client';
import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface StatsProps {
  stats: {
    total: number;
    pending: number;
    completed: number;
    failed: number;
    cancelled: number;
    totalAmount: number;
    completedAmount: number;
  } | null;
}

const PaymentsStats: React.FC<StatsProps> = ({ stats }) => {
  if (!stats) return null;
  return (
    <div className="space-y-3 mb-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 text-white">
          <p className="text-xs opacity-90 mb-1">Montant total</p>
          <p className="text-xl font-bold">{stats.totalAmount.toLocaleString()} F</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-3 text-white">
          <p className="text-xs opacity-90 mb-1">Montant encaissé</p>
          <p className="text-xl font-bold">{stats.completedAmount.toLocaleString()} F</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-white rounded-lg p-2.5 border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-green-50 rounded">
              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500">Réussis</p>
              <p className="text-lg font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-2.5 border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-orange-50 rounded">
              <Clock className="w-3.5 h-3.5 text-orange-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500">En attente</p>
              <p className="text-lg font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-2.5 border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-red-50 rounded">
              <XCircle className="w-3.5 h-3.5 text-red-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500">Échoués</p>
              <p className="text-lg font-bold text-gray-900">{stats.failed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-2.5 border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-gray-50 rounded">
              <AlertCircle className="w-3.5 h-3.5 text-gray-600" />
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Annulés</p>
              <p className="text-lg font-bold text-gray-900">{stats.cancelled}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsStats;