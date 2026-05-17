import { api } from "@/lib/api/client";
import { mapFormDataToBackend } from "@/lib/functions";
import type { ConsultationChoice, Rubrique, User } from "@/lib/interfaces";

export type ConsultationCreateResponse = {
    consultation?: {
        consultationId?: string;
        id?: string;
    };
};

type CreateCategoryConsultationParams = {
    choice: ConsultationChoice;
    user: User | null;
    extraPayload?: Record<string, unknown>;
};

export type CategoryContextInfo = {
    rubrique?: Rubrique;
    choix?: ConsultationChoice;
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

export async function createCategoryConsultation({
    choice,
    user,
    extraPayload,
}: CreateCategoryConsultationParams): Promise<string> {
    const payload: Record<string, unknown> = {
        serviceId: process.env.NEXT_PUBLIC_SERVICE_ID,
        title:  "Consultation",
        formData: mapFormDataToBackend(user),
        status: "PENDING",
        alternative: choice.offering?.alternative  ,
        choice,
        rubriqueId: "694cde9bde3392d3751a0fe9" ,
        ...extraPayload,
    };

    const response = await api.post<ConsultationCreateResponse>("/consultations", payload);
    const consultationId = response.data?.consultation?.consultationId || response.data?.consultation?.id;

    if (!consultationId) {
        throw new Error("ID de consultation manquant");
    }

    return consultationId;
}
 