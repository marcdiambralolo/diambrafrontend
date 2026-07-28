import { api } from "@/lib/api/client";

export type ConsultationCreateResponse = {
    consultation?: {
        consultationId?: string;
        id?: string;
    };
};

export type CreateConsultationLearningPayload = {
    idjeu: string;
    tpsglobal?: number;
    niveau?: number;
    status?: 'pending' | 'in_progress' | 'completed' | 'abandoned';
    country?: string;
    clientId?: string;
};

export function getCategoryErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error) {
        return error.message || fallback;
    }
    if (typeof error === "object" && error !== null) {
        const maybeResponse = error as { response?: { data?: { message?: string } } };
        const maybeMessage = error as { message?: string };
        return maybeResponse.response?.data?.message || maybeMessage.message || fallback;
    }

    return fallback;
}

export async function createCategoryConsultation(monidjeu: string): Promise<string> {
    const payload: Record<string, unknown> = {
        idjeu: monidjeu,
        status: 'pending',
    };

    const response = await api.post<ConsultationCreateResponse>("/consultations", payload);
    const consultationId = response.data?.consultation?.consultationId || response.data?.consultation?.id;

    if (!consultationId) {
        throw new Error("ID de consultation manquant");
    }

    return consultationId;
}

export async function createCategoryConsultationLearning(
    monidjeu: string
): Promise<string> {
    const payload: Record<string, unknown> = {
        idjeu: monidjeu,
        status: 'pending',
        tpsglobal: 0,
        niveau: 0,
        gameStartDate: new Date(),
        timeSpent: '0',
        learningStats: {
            totalTime: '0',
            averageScore: 0,
            totalMatches: 0,
            totalTrouves: 0,
            totalRates: 0,
            matchesDetails: [],
        },
        finalScore: 0,
        totalTimeSeconds: 0,
        matchesCompleted: 0,
        gameEndDate: new Date(),
    };

    try {
        const response = await api.post<ConsultationCreateResponse>("/consultations", payload);
        const consultationId = response.data?.consultation?.consultationId || response.data?.consultation?.id;

        if (!consultationId) {
            throw new Error("ID de consultation manquant");
        }

        return consultationId;
    } catch (error) {
        const errorMessage = getCategoryErrorMessage(
            error,
            "Erreur lors de la création de la consultation Learning"
        );
        throw new Error(errorMessage);
    }
}