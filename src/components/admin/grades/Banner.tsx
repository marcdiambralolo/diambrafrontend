'use client';
import { BannerState } from '@/hooks/admin/grades/useAdminGradesPage';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface BannerProps {
  banner: BannerState;
}

export default function Banner({ banner }: BannerProps) {
  if (!banner) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700',
  };

  return (
    <div
      className={`mb-4 px-4 py-3 rounded-lg border flex items-center gap-3 ${colors[banner.type]}`}
    >
      {icons[banner.type]}
      <span className="font-medium">{banner.message}</span>
    </div>
  );
}