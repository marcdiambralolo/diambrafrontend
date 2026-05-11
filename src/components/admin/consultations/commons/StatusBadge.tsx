'use client';
import { memo, useMemo } from 'react';
import { CheckCircle, Loader, Clock, XCircle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = memo(({ status }: StatusBadgeProps) => {
  const config = useMemo(() => {
    const configs: Record<string, { color: string; icon: JSX.Element; text: string }> = {
      'COMPLETED': {
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400',
        icon: <CheckCircle className="w-2.5 h-2.5" />,
        text: 'Complétée'
      },
      'GENERATING': {
        color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
        icon: <Loader className="w-2.5 h-2.5 animate-spin" />,
        text: 'En cours'
      },
      'PENDING': {
        color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
        icon: <Clock className="w-2.5 h-2.5" />,
        text: 'En attente'
      },
      'ERROR': {
        color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400',
        icon: <XCircle className="w-2.5 h-2.5" />,
        text: 'Erreur'
      }
    };
    return configs[status] || {
      color: 'bg-gray-50 text-gray-700 border-gray-200',
      icon: <AlertCircle className="w-2.5 h-2.5" />,
      text: status
    };
  }, [status]);

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${config.color}`}>
      {config.icon}
      {config.text}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

export default StatusBadge;