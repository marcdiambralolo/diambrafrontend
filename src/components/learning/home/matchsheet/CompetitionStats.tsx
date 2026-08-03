'use client';
import { BarChart3, Calendar, Clock, Phone, User as UserIcon } from 'lucide-react';
import { memo } from 'react';
import InfoRow from './InfoRow';
import { User } from '@/lib/interfaces';
import { formatToHMS } from '@/lib/learning/functions';

interface CompetitionStatsProps {
    startDate: string;
    finishedDate: string;
    timeSpent?: number;
    punChangeCount: number;
    showUserInfo?: boolean;
    user: User | null;
}

// Fonction pour convertir un nombre total de secondes en "Xh Ym Zs"


const CompetitionStats = memo(function CompetitionStats({
    startDate,
    finishedDate,
    timeSpent,
    punChangeCount,
    showUserInfo = true,
    user
}: CompetitionStatsProps) {

    const getElapsedTime = () => {
        if (!startDate || !finishedDate) return null;

        const start = new Date(startDate).getTime();
        const end = new Date(finishedDate).getTime();

        if (Number.isNaN(start) || Number.isNaN(end)) return null;

        const diffSeconds = Math.floor((end - start) / 1000);
        if (diffSeconds < 0) return 'Négatif';

        return formatToHMS(diffSeconds);
    };

    const elapsedTime = getElapsedTime();

    const fullName = user ? `${user.nom || ''} ${user.prenoms || ''}`.trim() : 'Utilisateur';
    const phoneNumber = user?.phone || 'Non renseigné';

    return (
        <div className="w-full dark:from-gray-800/30 dark:to-gray-900/30 p-3 dark:border-gray-700/50 mt-1">
            {showUserInfo && user && (
                <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                    <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Informations du joueur
                    </h4>
                    <InfoRow
                        label="Nom complet"
                        value={fullName}
                        icon={<UserIcon className="w-3.5 h-3.5" />}
                    />
                    <InfoRow
                        label="Téléphone"
                        value={phoneNumber!}
                        icon={<Phone className="w-3.5 h-3.5" />}
                    />
                </div>
            )}

            <div className="space-y-1">
                <InfoRow
                    label="Date de début"
                    value={startDate}
                    icon={<Calendar className="w-3.5 h-3.5" />}
                />
                <InfoRow
                    label="Date de fin"
                    value={finishedDate}
                    icon={<Calendar className="w-3.5 h-3.5" />}
                />
                {elapsedTime && (
                    <InfoRow
                        label="Temps écoulé"
                        value={elapsedTime}
                        highlight
                        icon={<span aria-hidden="true">⏱️</span>}
                    />
                )}                
                {punChangeCount !== undefined && (
                    <InfoRow
                        label="Nombre de vues"
                        value={punChangeCount}
                        icon={<BarChart3 className="w-3.5 h-3.5" />}
                    />
                )}
            </div>
        </div>
    );
});

export default CompetitionStats;