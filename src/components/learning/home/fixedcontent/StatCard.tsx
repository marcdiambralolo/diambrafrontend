'use client';
import { memo } from 'react';
import { formatNumber } from "@/lib/functions";

interface StatCardProps {
    value: number | null;
    label: string;
    icon: React.ReactNode;
    color: string;
}

export const StatCard = memo(function StatCard({ value, label, icon, color }: StatCardProps) {
    const formattedValue = value !== null ? formatNumber(value) : '--';

    return (
        <button
            type="button"
            className={`w-full text-left relative overflow-hidden mt-4 rounded-2xl bg-gradient-to-br ${color} p-4 text-white shadow-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50`}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-white/15 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold opacity-90">{label}</span>
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center" aria-hidden="true">
                        {icon}
                    </div>
                </div>
                <p className="text-3xl text-center font-extrabold tracking-tight">{formattedValue}</p>
            </div>
        </button>
    );
});