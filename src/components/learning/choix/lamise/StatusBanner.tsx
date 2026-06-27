'use client';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { memo } from 'react';

const STATUS_BANNER_CONFIG = {
    sufficient: {
        bgGradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
        borderColor: "border-green-200 dark:border-green-800",
        iconBg: "bg-green-100 dark:bg-green-900/40",
        iconColor: "text-green-600 dark:text-green-400",
        titleColor: "text-green-800 dark:text-green-300",
        textColor: "text-green-700 dark:text-green-400/80",
        icon: CheckCircle2,
        title: "Prêt à valider"
    },
    insufficient: {
        bgGradient: "from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20",
        borderColor: "border-red-300 dark:border-red-800",
        iconBg: "bg-red-100 dark:bg-red-900/40",
        iconColor: "text-red-600 dark:text-red-400",
        titleColor: "text-red-800 dark:text-red-300",
        textColor: "text-red-700 dark:text-red-400/80",
        icon: AlertTriangle,
        title: "Jetons insuffisants"
    }
} as const;

interface StatusBannerProps {
    isSufficient: boolean;
    requiredQuantity: number;
    availableQuantity: number;
}

export const StatusBanner = memo(({ isSufficient, requiredQuantity, availableQuantity }: StatusBannerProps) => {
    const missingTokens = requiredQuantity - availableQuantity;
    const config = STATUS_BANNER_CONFIG[isSufficient ? 'sufficient' : 'insufficient'];
    const Icon = config.icon;

    const message = isSufficient
        ? `Vous disposez de ${availableQuantity} jeton${availableQuantity > 1 ? 's' : ''}`
        : `Il vous manque ${missingTokens} jeton${missingTokens > 1 ? 's' : ''}.`;

    return (
        <div className={`relative overflow-hidden mb-1 flex items-start gap-3 p-2 rounded-2xl bg-gradient-to-r ${config.bgGradient} border ${config.borderColor} w-full`}>
            <div className={`rounded-full ${config.iconBg} p-2 flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${config.iconColor}`} aria-hidden="true" />
            </div>

            <div className="flex-1">
                <div className={`text-sm font-semibold ${config.titleColor} flex items-center gap-2`}>
                    {config.title}
                    {isSufficient && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200">
                            OK
                        </span>
                    )}
                </div>

                <p className={`text-xs ${config.textColor} mt-0.5`}>
                    {message}
                    {!isSufficient && (
                        <strong className="ml-1 text-red-600 dark:text-red-400">{missingTokens}</strong>
                    )}
                </p>
            </div>
        </div>
    );
});