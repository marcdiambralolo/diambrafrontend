import { api } from "@/lib/api/client";
import { buildCategoryConsultationPath, buildConsultationSearchParams } from "@/lib/consultations/navigation";
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

type ConsultationDestinationParams = {
    categoryId: string;
    consultationId: string;
    rubriqueId?: string | null;
    choiceId?: string | null;
    consultationType?: string | null;
    refreshToken?: string | number | null;
};

export type CategoryContextInfo = {
    rubrique?: Rubrique;
    choix?: ConsultationChoice;
};

export function getCategoryContextNavigationParams(contextInfo: CategoryContextInfo): {
    rubriqueId: string | null;
    choiceId: string | null;
} {
    return {
        rubriqueId: contextInfo.rubrique?._id || contextInfo.rubrique?.id || null,
        choiceId: contextInfo.choix?._id || contextInfo.choix?.choiceId || null,
    };
}

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

export function buildCategoryChoicePath(
    categoryId: string,
    segment: "form" | "formgroupe",
    params: {
        consultationId?: string | null;
        rubriqueId?: string | null;
        choiceId?: string | null;
    },
): string {
    const query = buildConsultationSearchParams(params);
    return query
        ? `/star/category/${categoryId}/${segment}?${query}`
        : `/star/category/${categoryId}/${segment}`;
}

export async function createCategoryConsultation({
    choice,
    user,
    extraPayload,
}: CreateCategoryConsultationParams): Promise<string> {
    const payload: Record<string, unknown> = {
        serviceId: process.env.NEXT_PUBLIC_SERVICE_ID,
        title: choice.title || "Consultation",
        formData: mapFormDataToBackend(user),
        description: choice.description || "",
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

export function getCreatedConsultationDestination({
    categoryId,
    consultationId,
    rubriqueId,
    choiceId,
}: ConsultationDestinationParams): string {  

    return buildCategoryConsultationPath(categoryId,   {
        consultationId,
        rubriqueId,
        choiceId,
    });
}