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
        <div className="space-y-4 space-x-4">
            {rankedConsultations.map((consultation, index) => {
                const comb = consultation.combinaison || '????';
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