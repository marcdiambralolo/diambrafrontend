import { Grade, RubriqueProgress } from '@/lib/types/grade.types';
import { api } from '../client';
import { UserType } from '@/lib/interfaces';
 

type GradeRequirements = {
    consultations: number;
    rituels: number;
    livres: number;
};

type GradeProgressResponse = {
    currentGrade: Grade | null;
    nextGrade: Grade | null;
    consultationsCompleted: number;
    rituelsCompleted: number;
    booksRead: number;
    rubriqueProgress?: RubriqueProgress[];
    nextGradeRequirements?: GradeRequirements;
    nextGradeRubriqueRequirements?: RubriqueProgress[];
};

type GradeInfoResponse = Array<{
    grade: Grade;
    level: number;
    requirements: GradeRequirements;
}>;

type WelcomeMessageResponse = { message: string };

type SubscriptionInfoResponse = {
    userType: UserType;
    premiumRubriqueId?: string;
    subscriptionStartDate?: Date;
    subscriptionEndDate?: Date;
    isActive: boolean;
    daysRemaining?: number;
};

type RubriqueAccessResponse = { hasAccess: boolean };

type SubscriptionMutationResponse = { success: boolean };

/**
 * Service pour gérer les grades utilisateurs
 * 
 * La progression repose sur 2 niveaux :
 * 1. Seuils globaux (consultationsCompleted, rituelsCompleted, booksRead)
 * 2. Exigences par rubrique (rubriqueRequirements) — vérifiées par agrégation MongoDB
 */
export const gradeService = {
    /**
     * Récupère la configuration d'un grade par son nom (accessible à tout utilisateur authentifié)
     */
    async fetchGradeConfigByName(grade: string) {
        const { data } = await api.get(`/admin/grades/by-name/${grade}`);
        return data;
    },
    /**
     * Obtenir les statistiques de progression de l'utilisateur connecté
     * Inclut le détail par rubrique et les seuils globaux
     */
    async getMyProgress(): Promise<GradeProgressResponse> {
        const response = await api.get<GradeProgressResponse>('/grades/progress');
        return response.data;
    },

    /**
     * Obtenir la progression d'un utilisateur spécifique (admin)
     */
    async getUserProgress(userId: string): Promise<GradeProgressResponse> {
        const response = await api.get<GradeProgressResponse>(`/grades/progress/${userId}`);
        return response.data;
    },

    /**
     * Obtenir les informations sur tous les grades
     */
    async getAllGradesInfo(): Promise<GradeInfoResponse> {
        const response = await api.get<GradeInfoResponse>('/grades/info');
        return response.data;
    },

    /**
     * Vérifier et mettre à jour le grade d'un utilisateur
     */
    async checkUserGrade(userId: string): Promise<void> {
        await api.post(`/grades/check/${userId}`);
    },

    /**
     * Incrémenter le compteur de consultations
     * Déclenche automatiquement la vérification du grade
     */
    async incrementMyConsultations(): Promise<void> {
        await api.patch('/grades/increment-consultations');
    },

    /**
     * Incrémenter le compteur de rituels
     * Déclenche automatiquement la vérification du grade
     */
    async incrementMyRituels(): Promise<void> {
        await api.patch('/grades/increment-rituels');
    },

    /**
     * Incrémenter le compteur de livres lus
     * Déclenche automatiquement la vérification du grade
     */
    async incrementMyBooks(): Promise<void> {
        await api.patch('/grades/increment-books');
    },

    /**
     * Récupérer le message de bienvenue personnalisé
     */
    async getWelcomeMessage(): Promise<WelcomeMessageResponse> {
        const response = await api.get<WelcomeMessageResponse>('/grades/welcome-message');
        return response.data;
    }
};

/**
 * Service pour gérer les profils utilisateurs
 */
export const profileService = {
    /**
     * Obtenir les informations d'abonnement de l'utilisateur connecté
     */
    async getMySubscription(): Promise<SubscriptionInfoResponse> {
        const response = await api.get<SubscriptionInfoResponse>('/user-access/subscription-info');
        return response.data;
    },

    /**
     * Vérifier l'accès à une rubrique pour l'utilisateur connecté
     */
    async checkMyRubriqueAccess(rubriqueId: string): Promise<RubriqueAccessResponse> {
        const response = await api.post<RubriqueAccessResponse>(`/user-access/check-access/${rubriqueId}`);
        return response.data;
    },

    /**
     * Activer un abonnement Premium
     */
    async activateMyPremium(rubriqueId: string, durationInDays?: number): Promise<SubscriptionMutationResponse> {
        const response = await api.post<SubscriptionMutationResponse>('/user-access/activate-premium', {
            rubriqueId,
            durationInDays
        });
        return response.data;
    },

    /**
     * Activer un abonnement Intégral
     */
    async activateMyIntegral(durationInDays?: number): Promise<SubscriptionMutationResponse> {
        const response = await api.post<SubscriptionMutationResponse>('/user-access/activate-integral', {
            durationInDays
        });
        return response.data;
    },

    /**
     * Annuler l'abonnement
     */
    async cancelMySubscription(): Promise<SubscriptionMutationResponse> {
        const response = await api.delete<SubscriptionMutationResponse>('/user-access/cancel-subscription');
        return response.data;
    }
};