'use client';
import React from 'react';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminLogoutButton = React.memo(function AdminLogoutButton({ onLogout, isLoggingOut }: { onLogout: () => void, isLoggingOut: boolean }) {

  return (
    <motion.button
      onClick={onLogout}
      disabled={isLoggingOut}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 font-bold text-sm hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoggingOut ? (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full" />
      ) : (
        <LogOut className="w-5 h-5" />
      )}
      
      {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
    </motion.button>
  );
});