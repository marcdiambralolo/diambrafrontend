// app/admin/consultations/page.tsx
'use client';

import ConsultationCard from '@/components/commons/ConsultationCard';
import { useAdminConsultationsPageFinished } from '@/hooks/admin/consultations/useAdminConsultationsPageFinished';
import { ChevronLeft, ChevronRight, FileText, RefreshCw } from 'lucide-react';

export default function ConsultationsPage() {
  const {
    consultations,
    totalPages,
    currentPage,
    loading,
    error,
    isRefreshing,
    handleRefresh,
    handlePageChange,
  } = useAdminConsultationsPageFinished();

  // Affichage du chargement
  if (loading && consultations.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-gray-200 animate-pulse dark:bg-gray-800" />
        ))}
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="text-center max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
          <FileText className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Erreur</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      {/* En-tête */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Consultations</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {consultations.length} résultat{consultations.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grille des consultations */}
      <div className="max-w-6xl mx-auto">
        {consultations.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl">
            <FileText className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Aucune consultation</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Aucune consultation trouvée</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {consultations.map((consultation, index) => (
                <ConsultationCard           
                  consultation={consultation}
                  index={index}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`min-w-[40px] h-10 px-2 rounded-lg font-medium transition ${
                          pageNum === currentPage
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                            : 'border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}