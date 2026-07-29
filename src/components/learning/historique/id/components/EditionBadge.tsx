"use client";
import { Trophy } from "lucide-react";
import { memo } from "react";

const EditionBadge = memo(() => (
    <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-1.5 mb-4">
        <Trophy className="w-4 h-4 text-yellow-500" />
        <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
            Édition terminée
        </span>
    </div>
)); 

export default EditionBadge;