'use client';
import { motion } from 'framer-motion';

interface UsersErrorStateProps {
  error: string;
  handleRefresh: () => void;
  isRefreshing: boolean;
}

const UsersErrorState = ({ error, handleRefresh, isRefreshing }: UsersErrorStateProps) => (
  <div className="flex items-center justify-center  bg-gray-50 px-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-sm w-full bg-white rounded-xl shadow-xl border border-gray-200 p-6"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-2">Erreur de chargement</h3>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{error}</p>
      
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="w-full px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isRefreshing ? 'Chargement...' : 'Réessayer'}
      </button>
    </motion.div>
  </div>
);

export default UsersErrorState;