import { api } from "@/lib/api/client";
import { mapFormDataToBackend } from "@/lib/functions";
import type { User } from "@/lib/interfaces";

export type ConsultationCreateResponse = {
    consultation?: {
        consultationId?: string;
        id?: string;
    };
};

type CreateCategoryConsultationParams = {
    user: User | null;
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
  
    user,
  
}: CreateCategoryConsultationParams): Promise<string> {
    const payload: Record<string, unknown> = {
        serviceId: process.env.NEXT_PUBLIC_SERVICE_ID,
        title:  "Jeu",
        formData: mapFormDataToBackend(user),
    };

    const response = await api.post<ConsultationCreateResponse>("/consultations", payload);
    const consultationId = response.data?.consultation?.consultationId || response.data?.consultation?.id;

    if (!consultationId) {
        throw new Error("ID de consultation manquant");
    }

    return consultationId;
}
 