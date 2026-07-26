"use client";
import { memo } from "react";

const INFO_CARD_STYLES = "flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700 transition-all duration-200";

const InfoRowGame = memo(({ icon, iconBg, iconColor, label, value }: {
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    label: string;
    value: string | number;
}) => (
    <div className={INFO_CARD_STYLES}>
        <div className={`p-1 ${iconBg} rounded-lg`}>
            <div className={iconColor}>{icon}</div>
        </div>
        <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                {label}
            </p>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
                {value}
            </p>
        </div>
    </div>
));

export default InfoRowGame;