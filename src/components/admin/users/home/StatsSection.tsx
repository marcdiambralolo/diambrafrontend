'use client';
import UsersStats from '@/components/admin/users/home/UsersStats';
import { memo } from 'react';

type UsersStatsData = React.ComponentProps<typeof UsersStats>['stats'];

interface StatsSectionProps {
  stats: UsersStatsData | null | undefined;
}

export const StatsSection = memo(function StatsSection({ stats }: StatsSectionProps) {
  return (
    <div className="flex justify-center"    >
      {stats && <UsersStats stats={stats} />}
    </div>
  );
});