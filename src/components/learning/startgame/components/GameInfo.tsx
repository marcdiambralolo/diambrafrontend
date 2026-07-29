'use client';

import { BarChartOutlined, EyeOutlined, TrophyOutlined } from '@ant-design/icons';
import InfoRowGame from './InfoRowGame';
import ObjectiveCard from './ObjectiveCard';
import ProgressBar from './ProgressBar';

interface GameInfoProps {
    currentGameType: string;
    progression: number;
    niveau?: number | string;
    lockedCount: number;
    totalCount: number;
    hasCases: boolean;
    punChangeCount?: number;
}

const GameInfo = ({
    currentGameType,
    progression,
    niveau,
    lockedCount,
    totalCount,
    hasCases,
    punChangeCount = 0,
}: GameInfoProps) => {
    return (
        <section aria-label="Informations de la partie" className="mt-2 w-full space-y-2">
            <InfoRowGame
                icon={<EyeOutlined />}
                iconBg="bg-blue-100 dark:bg-blue-900/30"
                iconColor="text-blue-600 dark:text-blue-400"
                label="NOMBRE DE VUES"
                value={punChangeCount}
            />

            {hasCases && (
                <ProgressBar
                    lockedCount={lockedCount}
                    totalCount={totalCount}
                    progression={progression}
                />
            )}

            <ObjectiveCard />

            <InfoRowGame
                icon={<TrophyOutlined />}
                iconBg="bg-yellow-100 dark:bg-yellow-900/30"
                iconColor="text-yellow-600 dark:text-yellow-400"
                label="JEU EN COURS"
                value={currentGameType}
            />

            <InfoRowGame
                icon={<BarChartOutlined />}
                iconBg="bg-green-100 dark:bg-green-900/30"
                iconColor="text-green-600 dark:text-green-400"
                label="NIVEAU DU JEU"
                value={niveau ?? "N/A"}
            />
        </section>
    );
};

export default GameInfo;