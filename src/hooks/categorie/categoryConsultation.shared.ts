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

/**
 * Crée une consultation standard pour un jeu
 * @param monidjeu - ID du jeu
 * @returns ID de la consultation créée
 */
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

/**
 * Crée une consultation Learning avec toutes les options disponibles
 * @param monidjeu - ID du jeu (obligatoire)
 * @param options - Options supplémentaires pour la consultation Learning
 * @returns ID de la consultation créée
 */
export async function createCategoryConsultationLearning(
    monidjeu: string,
    options?: {
        tpsglobal?: number;
        niveau?: number;
        status?: 'pending' | 'in_progress' | 'completed' | 'abandoned';
        country?: string;
        clientId?: string;
        gameStartDate?: Date;
    }
): Promise<string> {
    // Construire le payload avec toutes les données Learning
    const payload: Record<string, unknown> = {
        idjeu: monidjeu,
        status: 'pending',
        tpsglobal: options?.tpsglobal || 0,
        niveau: options?.niveau || 0,
        gameStartDate: new Date(),
        timeSpent: '0.0s',

        // Initialiser les statistiques Learning
        learningStats: {
            totalTime: '0',
            averageScore: 0,
            totalMatches: 0,
            totalTrouves: 0,
            totalRates: 0,
            matchesDetails: [],
        },

        // Initialiser les autres champs Learning
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

/**
 * Crée une consultation Learning avec des matchs détaillés
 * @param monidjeu - ID du jeu
 * @param matchDetails - Détails des matchs à initialiser
 * @returns ID de la consultation créée
 */
export async function createCategoryConsultationLearningWithMatches(
    monidjeu: string,
    matchDetails: Array<{
        tpsglobal?: number;
        score?: number;
        trouves?: number;
        rates?: number;
        timeSpent?: number;
        isgameover?: boolean;
        niveau?: number;
        combinaisons?: string[];
    }> = []
): Promise<string> {
    return createCategoryConsultationLearning(monidjeu, {
        tpsglobal: matchDetails[0]?.tpsglobal || 0,
        niveau: matchDetails[0]?.niveau || 0,
        status: 'pending',
    });
}

/**
 * Met à jour une consultation Learning existante
 * @param consultationId - ID de la consultation
 * @param updates - Mises à jour à appliquer
 */
export async function updateCategoryConsultationLearning(
    consultationId: string,
    updates: {
        status?: 'pending' | 'in_progress' | 'completed' | 'abandoned';
        finalScore?: number;
        totalTimeSeconds?: number;
        matchesCompleted?: number;
        gameEndDate?: Date;
        learningStats?: {
            totalTime?: string;
            averageScore?: number;
            totalMatches?: number;
            totalTrouves?: number;
            totalRates?: number;
            matchesDetails?: Array<{
                tpsglobal?: number;
                score?: number;
                trouves?: number;
                rates?: number;
                timeSpent?: number;
                isgameover?: boolean;
                niveau?: number;
                combinaisons?: string[];
            }>;
        };
    }
): Promise<void> {
    try {
        await api.patch(`/consultations/${consultationId}`, updates);
    } catch (error) {
        const errorMessage = getCategoryErrorMessage(
            error,
            "Erreur lors de la mise à jour de la consultation Learning"
        );
        throw new Error(errorMessage);
    }
}

/**
 * Termine une consultation Learning avec les résultats finaux
 * @param consultationId - ID de la consultation
 * @param results - Résultats finaux
 */
export async function completeCategoryConsultationLearning(
    consultationId: string,
    results: {
        finalScore: number;
        totalTimeSeconds: number;
        matchesCompleted: number;
        learningStats: {
            totalTime: string;
            averageScore: number;
            totalMatches: number;
            totalTrouves: number;
            totalRates: number;
            matchesDetails: Array<{
                tpsglobal?: number;
                score?: number;
                trouves?: number;
                rates?: number;
                timeSpent?: number;
                isgameover?: boolean;
                niveau?: number;
                combinaisons?: string[];
            }>;
        };
    }
): Promise<void> {
    return updateCategoryConsultationLearning(consultationId, {
        status: 'completed',
        gameEndDate: new Date(),
        ...results,
    });
}