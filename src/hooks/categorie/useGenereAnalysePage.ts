import { getCategoryContextNavigationParams } from "@/hooks/categorie/categoryConsultation.shared";
import { buildCategoryConsultationPath } from "@/lib/consultations/navigation";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export function useGenereAnalysePage() {
    const router = useRouter();

    const category = useMonEtoileStore((s) => s.category);
    const rubriqueEnCours = useMonEtoileStore((s) => s.rubriqueEnCours);
    const choixConsultationEnCours = useMonEtoileStore((s) => s.choixConsultationEnCours);

    const estdocument = !!choixConsultationEnCours?.pdfFile;
    
    const contextInfo = {
        rubrique: rubriqueEnCours ?? undefined,
        choix: (choixConsultationEnCours as any)?.choice ?? undefined,
    };

    const navigateToProfil = useCallback(() => {
        router.push(`/star/profil?r=${Date.now()}`);
    }, [router]);

    const navigationParams = getCategoryContextNavigationParams(contextInfo);

    const consultationTitle = choixConsultationEnCours?.title || contextInfo.choix?.title || "Votre consultation";

    useEffect(() => {
        if (estdocument && typeof window !== 'undefined') {
            router.replace(buildCategoryConsultationPath(category?._id ?? '', 'documentpdf', {
                consultationId: choixConsultationEnCours._id ?? '',
                rubriqueId: navigationParams.rubriqueId,
                choiceId: navigationParams.choiceId,
                r: Date.now(),
            }));
        }
    }, [category?._id, estdocument, choixConsultationEnCours?._id, navigationParams.choiceId, navigationParams.rubriqueId, router]);

    return { navigateToProfil, consultationTitle, estdocument, };
}