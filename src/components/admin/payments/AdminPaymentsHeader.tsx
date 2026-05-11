'use client';
import { CreditCard, RefreshCw } from 'lucide-react';
import React from 'react';

interface AdminPaymentsHeaderProps {
  total: number;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const AdminPaymentsHeader: React.FC<AdminPaymentsHeaderProps> = ({ total, isRefreshing, onRefresh }) => (
  <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
      
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-50 rounded-lg">
            <CreditCard className="w-4 h-4 text-green-600" />
          </div>
          
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Paiements
            </h1>
            <p className="text-xs text-gray-500">{total} total</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`p-2 rounded-lg transition-all ${isRefreshing
              ? 'bg-gray-100 text-gray-400'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  </div>
);
