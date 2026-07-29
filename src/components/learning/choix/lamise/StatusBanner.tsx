'use client';
import { AlertTriangle, CheckCircle2, type LucideIcon } from 'lucide-react';
import { memo } from 'react';

interface StatusConfig {
    bgGradient: string;
    borderColor: string;
    iconBg: string;
    iconColor: string;
    titleColor: string;
    textColor: string;
    icon: LucideIcon;
    title: string;
}

const STATUS_BANNER_CONFIG: Record<'sufficient' | 'insufficient', StatusConfig> = {
    sufficient: {
        bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        iconBg: 'bg-green-100 dark:bg-green-900/40',
        iconColor: 'text-green-600 dark:text-green-400',
        titleColor: 'text-green-800 dark:text-green-300',
        textColor: 'text-green-700 dark:text-green-400/80',
        icon: CheckCircle2,
        title: 'Prêt à valider',
    },
    insufficient: {
        bgGradient: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20', // Correction de from-red-60 -> from-red-50
        borderColor: 'border-red-300 dark:border-red-800',
        iconBg: 'bg-red-100 dark:bg-red-900/40',
        iconColor: 'text-red-600 dark:text-red-400',
        titleColor: 'text-red-800 dark:text-red-300',
        textColor: 'text-red-700 dark:text-red-400/80',
        icon: AlertTriangle,
        title: 'Jetons insuffisants',
    },
} as const;

const pluralize = (count: number, singular: string, plural: string) =>
    `${count} ${count > 1 ? plural : singular}`;

const getStatusMessage = (
    isSufficient: boolean,
    availableQuantity: number,
    requiredQuantity: number
): string => {
    if (isSufficient) {
        return `Vous disposez de ${pluralize(availableQuantity, 'jeton', 'jetons')}.`;
    }
    const missingTokens = Math.max(0, requiredQuantity - availableQuantity);
    return `Il vous manque ${pluralize(missingTokens, 'jeton', 'jetons')}.`;
};

interface StatusBannerProps {
    isSufficient: boolean;
    requiredQuantity: number;
    availableQuantity: number;
}

export const StatusBanner = memo(
    ({ isSufficient, requiredQuantity, availableQuantity }: StatusBannerProps) => {
        const statusKey = isSufficient ? 'sufficient' : 'insufficient';
        const config = STATUS_BANNER_CONFIG[statusKey];
        const Icon = config.icon;

        const message = getStatusMessage(isSufficient, availableQuantity, requiredQuantity);

        return (
            <div
                role={isSufficient ? 'status' : 'alert'}
                className={`relative overflow-hidden mb-1 flex items-start gap-3 p-2.5 rounded-2xl bg-gradient-to-r ${config.bgGradient} border ${config.borderColor} w-full transition-colors duration-200`}
            >
                <div className={`rounded-full ${config.iconBg} p-2 flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${config.iconColor}`} aria-hidden="true" />
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold ${config.titleColor} flex items-center gap-2`}>
                        {config.title}
                    </h4>
                    <p className={`text-xs ${config.textColor} mt-0.5 leading-relaxed`}>
                        {message}
                    </p>
                </div>
            </div>
        );
    }
);