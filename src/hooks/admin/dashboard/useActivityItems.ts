import { useMemo } from "react";
import { Users, FileText, DollarSign, Activity } from "lucide-react";
import type { ActivityItem } from "@/components/admin/dashboard/activity/ActivityCardItem";

type ActivityStats = {
  users: { total: number };
  consultations: { total: number };
  activity?: { todayUsers: number; todayConsultations: number; todayRevenue: number; growth: number };
};

type DerivedStats = Record<string, string | number | undefined> & {
  averageRevenue?: string | number;
};

export function useActivityItems(stats: ActivityStats, derivedStats: DerivedStats | null) {

  return useMemo<ActivityItem[]>(
    () => {
      const activity = stats.activity ?? { todayUsers: 0, todayConsultations: 0, todayRevenue: 0, growth: 0 };
      const userPercent = stats.users.total > 0 ? `+${((activity.todayUsers / stats.users.total) * 100).toFixed(1)}%` : "+0.0%";
      const consultationPercent = stats.consultations.total > 0
        ? `+${((activity.todayConsultations / stats.consultations.total) * 100).toFixed(1)}%`
        : "+0.0%";

      return [
        {
          icon: Users,
          label: "Utilisateurs",
          value: activity.todayUsers,
          percent: userPercent,
        },
        {
          icon: FileText,
          label: "Consultations",
          value: activity.todayConsultations,
          percent: consultationPercent,
        },
        {
          icon: DollarSign,
          label: "Revenu",
          value: `${activity.todayRevenue.toLocaleString()} F`,
          percent: derivedStats?.averageRevenue ? `Moy: ${derivedStats.averageRevenue} F` : "",
        },
        {
          icon: Activity,
          label: "Croissance",
          value: `${Math.abs(activity.growth)}%`,
          percent: activity.growth >= 0 ? "Positive" : "Négative",
          trend: activity.growth,
        },
      ];
    },
    [stats, derivedStats]
  );
}
