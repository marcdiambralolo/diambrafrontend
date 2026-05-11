'use client';
import { motion } from 'framer-motion';
import CacheLink from '@/components/commons/CacheLink';
import { ArrowLeft, User } from 'lucide-react';

export function NewUserHeader() {

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 sm:mb-6"
    >
      <CacheLink
        href={`/admin/users?r=${Date.now()}`}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 mb-3 sm:mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </CacheLink>
      
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] p-2 shadow-lg sm:p-2.5">
          <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            Nouvel utilisateur
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Créez un compte utilisateur
          </p>
        </div>
      </div>
    </motion.div>
  );
}