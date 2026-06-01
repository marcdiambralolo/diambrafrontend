import { api } from "@/lib/api/client";
import { formatDate } from "@/lib/functions";
import { Consultation } from "@/lib/interfaces";
import { caldure } from "@/lib/learning/functions";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useCallback, useMemo, useState } from 'react';

const GAME_ROUTES = { LEARNING: '/star/learning', } as const;
const MESSAGE_DURATION = 3000;

export const useEndGameGenerator = () => {
    const { clearCompletedMatches, currentConsultationId, completedMatches } = useMonEtoileStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const displayMatches = useMemo(() => completedMatches ?? [], [completedMatches]);

    const datefin = new Date().toISOString();
    const monniveau = displayMatches[0]?.niveau ?? 0;
    const madatedebut = displayMatches[0]?.datedebut;

    const stats = useMemo(() => {
        let scores = 0, trouves = 0, rates = 0;
        for (const match of displayMatches) {
            scores += match.score || 0;
            trouves += match.trouves || 0;
            rates += match.rates || 0;
        }
        return { scores, trouves, rates };
    }, [displayMatches]);

    const summaryDetails = useMemo(() => [
        { label: "📅 Date de début", value: formatDate(madatedebut || datefin) },
        { label: "📅 Date de fin", value: formatDate(datefin) },
        { label: "⏱️ Temps écoulé", value: caldure(datefin, madatedebut || datefin) },
        { label: "✗ Ratés", value: stats.rates },
    ], [monniveau, stats, displayMatches.length, madatedebut, datefin]);

    const handleRecommencer = useCallback(() => {
        clearCompletedMatches();
        window.location.href = GAME_ROUTES.LEARNING;
    }, [clearCompletedMatches]);

    const showMessage = useCallback((type: 'success' | 'error', text: string) => {
        setSubmitMessage({ type, text });
        setTimeout(() => setSubmitMessage(null), MESSAGE_DURATION);
    }, []);

    const handleSubmitGame = useCallback(async () => {
        if (!currentConsultationId) {
            showMessage('error', 'Aucune consultation en cours');
            return;
        }

        if (!displayMatches.length) {
            showMessage('error', 'Aucune donnée de match à soumettre');
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            const temps = caldure(datefin, madatedebut || datefin);
            const totalScore = displayMatches.reduce((acc, match) => acc + (match.score || 0), 0);
            const averageScore = totalScore / displayMatches.length;

            const { data } = await api.get(`/consultations/${currentConsultationId}`);

            const updatedPayload = {
                ...(data as Consultation),
                timeSpent: temps,
                learningStats: {
                    totalTime: temps,
                    averageScore: averageScore.toFixed(0),
                    completedAt: datefin,
                    matchesDetails: displayMatches.map(m => ({
                        tpsglobal: m.tpsglobal,
                        score: m.score,
                        trouves: m.trouves,
                        rates: m.rates,
                        isgameover: m.isgameover,
                    })),
                },
            };

            await api.put(`/consultations/${currentConsultationId}`, updatedPayload);
            showMessage('success', 'Partie soumise avec succès !');
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            showMessage('error', 'Erreur lors de la soumission');
        } finally {
            setIsSubmitting(false);
        }
    }, [currentConsultationId, displayMatches, datefin, madatedebut, showMessage]);

    return {
        displayMatches, isSubmitting, submitMessage,
        handleRecommencer, handleSubmitGame, summaryDetails,
    };
};