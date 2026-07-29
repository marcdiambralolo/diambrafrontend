"use client";
import { History } from "lucide-react";
import { memo } from "react";

const EmptyState = memo(() => (
    <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <History className="w-12 h-12 text-purple-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Aucune compétition
        </h3>

        <p className="text-gray-500 dark:text-gray-400">
            Aucune compétition n'a été jouée dans cette édition
        </p>
    </div>
));

export default EmptyState;