"use client";
import { Activity } from "lucide-react";
import { memo } from "react";
import LiveBadge from "./LiveBadge";

const ActivityHeader = memo(() => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
      <div className="flex-shrink-0 p-2 bg-white/15 dark:bg-white/10 rounded-xl backdrop-blur-sm shadow-lg">
        <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>

      <div className="min-w-0">
        
        <h2 className="text-base sm:text-lg font-bold text-white truncate">
          Activité du jour
        </h2>

        <p className="text-white/70 text-[10px] sm:text-xs truncate">
          Statistiques en temps réel
        </p>

      </div>
    </div>
    <LiveBadge />
  </div>
));

ActivityHeader.displayName = "ActivityHeader";

export default ActivityHeader;