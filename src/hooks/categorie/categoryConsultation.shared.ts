import { api } from "@/lib/api/client";
import { mapFormDataToBackend } from "@/lib/functions";
import type { User } from "@/lib/interfaces";
import { useParams } from "next/navigation";
import { useMemo } from "react";

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

export async function createCategoryConsultation(): Promise<string> {
      const params = useParams();

      const id = useMemo(() => {
        if (!params?.id) return null;
        return Array.isArray(params.id) ? params.id[0] : params.id;
      }, [params?.id]);
      
    const payload: Record<string, unknown> = {
        idjeu: id,
    };

    const response = await api.post<ConsultationCreateResponse>("/consultations", payload);
    const consultationId = response.data?.consultation?.consultationId || response.data?.consultation?.id;

    if (!consultationId) {
        throw new Error("ID de consultation manquant");
    }

    return consultationId;
}
