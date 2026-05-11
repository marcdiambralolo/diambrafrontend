'use client';

import { useAuthStore } from '@/lib/store/auth.store';
import { Shield } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

export const AdminSidebarHeader = React.memo(function AdminSidebarHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <Link
      href="/"
      className="flex items-center gap-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-indigo/40 rounded-xl transition-shadow"
      title="Retour à l'accueil"
      prefetch={false}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-transform">
        <Shield className="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-cosmic-indigo transition-colors">Administration</h2>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{user?.username || 'Administrateur'}</p>
      </div>
    </Link>
  );
});