'use client';
import React from 'react';

interface AdminPaymentsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export const AdminPaymentsPagination: React.FC<AdminPaymentsPaginationProps> = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}) => (
  <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-3 py-2">
 
    <p className="text-xs text-gray-600">
      Page {currentPage}/{totalPages}
    </p>

    <div className="flex gap-1.5">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ←
      </button>
      
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded font-medium hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        →
      </button>
    </div>
  </div>
);