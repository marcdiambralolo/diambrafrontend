"use client";
import ConsultationCard from "./ConsultationCard";
import EmptyState from "./EmptyState";

interface ConsultationListProps {
    hasConsultations: boolean;
    rankedConsultations: any[];
    duplicateMap: Map<string, any>;
}

export function ConsultationList({
    hasConsultations,
    rankedConsultations,
    duplicateMap,
}: ConsultationListProps) {
    if (!hasConsultations) {
        return <EmptyState />;
    }

    return (
        <div className="grid grid-cols-1  gap-4 md:gap-6">
            {rankedConsultations.map((consultation, index) => {
                const comb = consultation.timeSpent || '0';
                const duplicateInfo = duplicateMap.get(comb);
                const isDuplicate = duplicateInfo?.isDuplicate || false;
                const duplicateCount = duplicateInfo?.count || 0;
                const rank = consultation.rank;

                return (
                    <ConsultationCard
                        key={index}
                        consultation={consultation}
                        index={index}
                        isDuplicate={isDuplicate}
                        duplicateCount={duplicateCount}
                        rank={rank}
                    />
                );
            })}
        </div>
    );
}