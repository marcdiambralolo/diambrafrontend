import { api } from "@/lib/api/client";
import { isFreeCinqPortesConsultation } from "@/lib/consultations/isFreeCinqPortes";
import { buildCategoryConsultationPath, buildConsultationSearchParams } from "@/lib/consultations/navigation";
import { mapFormDataToBackend } from "@/lib/functions";
import type { CategorieAdmin, ConsultationChoice, EnrichedChoice, Rubrique, User } from "@/lib/interfaces";

export type ConsultationCreateResponse = {
    consultation?: {
        consultationId?: string;
        id?: string;
    };
};

type CreateCategoryConsultationParams = {
    category: Pick<CategorieAdmin, "typeconsultation">;
    rubrique?: Pick<Rubrique, "_id" | "typeconsultation"> | null;
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

export function getCategoryDisplayTitle(category: Pick<CategorieAdmin, "titre" | "nom">): string {
    return category.titre || category.nom || "Catégorie";
}

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


function resolveChoiceFromEntry(entry: unknown): ConsultationChoice | null {
    if (typeof entry !== "object" || entry === null) {
        return null;
    }

    if ("choice" in entry) {
        const enrichedChoice = entry as EnrichedChoice;
        return enrichedChoice.choice || null;
    }

    return entry as ConsultationChoice;
}

function choiceMatchesId(choice: ConsultationChoice | null, choiceId: string | null | undefined): boolean {
    if (!choice || !choiceId) {
        return false;
    }

    return choice._id === choiceId || choice.choiceId === choiceId;
}

export function resolveCategoryContext(
    category: Pick<CategorieAdmin, "rubriques">,
    params: {
        rubriqueId?: string | null;
        choiceId?: string | null;
    },
): CategoryContextInfo {
    const rubriques = category.rubriques || [];

    const rubrique = params.rubriqueId
        ? rubriques.find((item) => item._id === params.rubriqueId || item.id === params.rubriqueId)
        : undefined;

    if (rubrique) {
        const choix = (rubrique.consultationChoices || [])
            .map(resolveChoiceFromEntry)
            .find((choice) => choiceMatchesId(choice, params.choiceId));

        return { rubrique, choix: choix || undefined, };
    }

    if (!params.choiceId) {
        return {};
    }

    for (const rubriqueCandidate of rubriques) {
        const choix = (rubriqueCandidate.consultationChoices || [])
            .map(resolveChoiceFromEntry)
            .find((choice) => choiceMatchesId(choice, params.choiceId));

        if (choix) {
            return {
                rubrique: rubriqueCandidate,
                choix,
            };
        }
    }

    return {};
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
    category,
    rubrique,
    choice,
    user,
    extraPayload,
}: CreateCategoryConsultationParams): Promise<string> {
    const payload: Record<string, unknown> = {
        serviceId: process.env.NEXT_PUBLIC_SERVICE_ID,
        type: rubrique?.typeconsultation || category.typeconsultation,
        title: choice.title || "Consultation",
        formData: mapFormDataToBackend(user),
        description: choice.description || "",
        status: "PENDING",
        alternatives: choice.offering?.alternatives || [],
        choice,
        rubriqueId: rubrique?._id || "",
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
    consultationType,
}: ConsultationDestinationParams): string {
    const isFreeCinqPortes = isFreeCinqPortesConsultation({
        rubriqueId,
        type: consultationType,
    });

    if (isFreeCinqPortes) {
        const searchParams = new URLSearchParams({ retour: "cinqportes" });
        return `/star/consultations/${consultationId}?${searchParams.toString()}`;
    }

    return buildCategoryConsultationPath(categoryId, "consulter", {
        consultationId,
        rubriqueId,
        choiceId,
    });
}