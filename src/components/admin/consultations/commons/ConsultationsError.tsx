'use client';
import { AlertCircle, RefreshCw, Wifi, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConsultationsErrorProps {
  error: string;
  onRetry: () => void;
}

export function ConsultationsError({ error, onRetry }: ConsultationsErrorProps) {
  const isTimeoutError = error.includes('Délai dépassé') || error.includes('timeout');
  const isNetworkError = error.includes('connexion') || error.includes('réseau');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-[60vh] bg-gray-50 dark:bg-gray-950 p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-red-100 dark:border-red-900/40 p-8"
      >
        <motion.div
          className="flex justify-center mb-4"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isTimeoutError ? (
            <Clock className="w-12 h-12 text-orange-500" />
          ) : isNetworkError ? (
            <Wifi className="w-12 h-12 text-red-500" />
          ) : (
            <AlertCircle className="w-12 h-12 text-rose-500" />
          )}
        </motion.div>

        {/* Titre */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {isTimeoutError ? 'Requête trop longue' : isNetworkError ? 'Erreur réseau' : 'Erreur'}
        </h3>

        {/* Message d'erreur */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {error}
        </p>

        {/* Conseils */}
        {isTimeoutError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/40 rounded-lg p-4 mb-6 text-left"
          >
            <p className="text-xs font-semibold text-orange-900 dark:text-orange-300 mb-2">
              Conseils :
            </p>
            <ul className="text-xs text-orange-800 dark:text-orange-300 space-y-1">
              <li>• Vérifiez votre connexion internet</li>
              <li>• Patientez quelques secondes et réessayez</li>
              <li>• Vérifiez que le serveur backend fonctionne</li>
            </ul>
          </motion.div>
        )}

        {isNetworkError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-lg p-4 mb-6 text-left"
          >
            <p className="text-xs font-semibold text-red-900 dark:text-red-300 mb-2">
              Conseils :
            </p>
            <ul className="text-xs text-red-800 dark:text-red-300 space-y-1">
              <li>• Vérifiez votre connexion internet</li>
              <li>• Vérifiez l'URL du serveur backend</li>
              <li>• Assurez-vous que le serveur est démarré</li>
            </ul>
          </motion.div>
        )}

        {/* Boutons */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#2E5AA6]/20 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}