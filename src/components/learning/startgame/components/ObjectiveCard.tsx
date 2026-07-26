"use client";
import { TrophyOutlined } from '@ant-design/icons';
import { memo } from "react";

const ObjectiveCard = memo(() => (
    <div className="relative group">
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400" />

            <div className="p-2">
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-xl p-1">
                    <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-md">
                        <TrophyOutlined className="text-xxs text-white" />
                    </div>
                    <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                        Objectif : Réorganisez P2 pour qu'il corresponde à P1!
                    </p>
                </div>
            </div>
        </div>
    </div>
));

export default ObjectiveCard;