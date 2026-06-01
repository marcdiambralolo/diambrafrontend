// hooks/learning/endgame/useGameGenerator.ts
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useMemo, useState } from "react";

interface CompetitionSummary {
    isComplete: boolean;
    id: string;
    name: string;
    startedAt: string;
    finishedAt?: string;
    totalMatches: number;
    completedMatches: number;
    totalScore: number;
    maxPossibleScore: number;
    percentage: number;
    matches: {
        matchNumber: number;
        type: string;
        score: number;
        totalCases: number;
        timeSpent?: number;
        isComplete: boolean;
    }[];
}

export const useEndGameGenerator = () => {
    const { competitions, currentCompetitionId, clearCompletedMatches, resetGameState } = useMonEtoileStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // Transformer les compétitions en format d'affichage
    const competitionSummaries = useMemo((): CompetitionSummary[] => {
        return Array.from(competitions.values()).map(comp => {
            const totalScore = comp.matches.reduce((sum, match) => sum + (match.trouves || 0), 0);
            const maxPossibleScore = comp.matches.reduce((sum, match) => {
                const totalCases = match.listeCaseOpLab?.length || 0;
                return sum + totalCases;
            }, 0);
            const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

            return {
                id: comp.id,
                name: `Compétition du ${new Date(comp.startedAt).toLocaleDateString()}`,
                startedAt: comp.startedAt,
                finishedAt: comp.finishedAt,
                totalMatches: comp.totalMatches,
                completedMatches: comp.completedMatches,
                totalScore,
                maxPossibleScore,
                percentage,
                isComplete: comp.isComplete,
                matches: comp.matches.map((match, idx) => ({
                    matchNumber: idx + 1,
                    type: getMatchType(match.tpsglobal),
                    score: match.trouves || 0,
                    totalCases: match.listeCaseOpLab?.length || 0,
                    timeSpent: undefined, // À calculer si besoin
                    isComplete: match.isgameover || false,
                })),
            };
        }).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    }, [competitions]);

    const handleSubmitGame = async () => {
        setIsSubmitting(true);
        setSubmitMessage(null);
        
        try {
            // Logique de soumission
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubmitMessage({ text: 'Jeu soumis avec succès !', type: 'success' });
        } catch (error) {
            setSubmitMessage({ text: 'Erreur lors de la soumission', type: 'error' });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitMessage(null), 3000);
        }
    };

    const handleRecommencer = () => {
        resetGameState();
        window.location.reload(); // Ou navigation vers la page de jeu
    };

    return {
        competitions: competitionSummaries,
        currentCompetitionId,
        isSubmitting,
        submitMessage,
        handleRecommencer,
        handleSubmitGame,
    };
};

function getMatchType(tpsglobal?: number): string {
    switch (tpsglobal) {
        case 0: return 'Mots';
        case 1: return 'Chiffres';
        case 2: return 'Images';
        case 3: return 'Mixte';
        default: return 'Inconnu';
    }
}