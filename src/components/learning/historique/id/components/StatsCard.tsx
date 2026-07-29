"use client";
import { memo } from "react";

interface StatsCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
    subtitle?: string;
}

const StatsCard = memo(({ icon, label, value, color, subtitle }: StatsCardProps) => (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-xl`}>
        <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -left-8 -bottom-8 w-20 h-20 rounded-full bg-white/5" />

        <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold opacity-90">{label}</span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div className="text-3xl font-black tracking-tight">{value}</div>
            {subtitle && (
                <div className="text-xs opacity-80 mt-1">{subtitle}</div>
            )}
        </div>
    </div>
));

export default StatsCard;