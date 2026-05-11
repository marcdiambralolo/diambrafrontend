// hooks/categorie/useCategoryClientViewChoix.ts
import { buildCategoryChoicePath, getCreatedConsultationDestination } from "@/hooks/categorie/categoryConsultation.shared";
import { useToast } from "@/hooks/categorie/useToast";
import { api } from "@/lib/api/client";
import { getChoicesWithCount } from "@/lib/api/services/rubriques.service";
import {
  Consultation, ConsultationStatus, ConsultationType, GRADE_LEVEL, User,
  type ConsultationChoice, type Rubrique,
} from "@/lib/interfaces";
import { useAuthStore } from "@/lib/store/auth.store";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";

export type ShareState = 'idle' | 'copied' | 'shared' | 'error';
export type ButtonStatus = 'CONSULTER' | 'RÉPONSE EN ATTENTE' | "VOIR L'ANALYSE" | "VOIR LA RÉPONSE";

 
// Styles constants
export const BUTTON_BASE_STYLES = "flex-1 min-w-0 rounded-2xl px-3 py-3 font-semibold text-white text-xs sm:text-sm flex items-center justify-center gap-2 select-none transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed";
export const BUTTON_HOVER_SCALE = "hover:scale-[1.03]";
export const ANALYSIS_BUTTON_STYLES = `${BUTTON_BASE_STYLES} ${BUTTON_HOVER_SCALE} bg-gradient-to-r from-amber-400 to-orange-500`;
export const REGULAR_BUTTON_STYLES = `${BUTTON_BASE_STYLES} ${BUTTON_HOVER_SCALE} bg-gradient-to-r from-cosmic-purple to-cosmic-indigo`;

 
export const getButtonStyles = (status: ButtonStatus): string => {
    const isAnalysis = status === "VOIR L'ANALYSE" || status === "VOIR LA RÉPONSE";
    return isAnalysis ? ANALYSIS_BUTTON_STYLES : REGULAR_BUTTON_STYLES;
};

// ==================== TYPES ====================
 
export interface EnrichedChoiceWithState extends ConsultationChoice {
    buttonStatus: ButtonStatus;
    consultationId: string | null;
    consultationCount?: number;
    shareUrl: string;
    shareText: string;
    canShare: boolean;
}

export interface CategoryChoixState {
    rubriqueCourante: Rubrique | null;
    loading: boolean;
    error: Error | null;
    nomcategory: string;
    descriptioncategory: string;
    enrichedChoices: EnrichedChoiceWithState[];
    shareStates: Record<string, 'idle' | 'copied' | 'shared' | 'error'>;
}

// ==================== CONSTANTES ====================
function createTempId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
}

function resolveRequiredLevel(choice: ConsultationChoice): number {
    const grade = choice.gradeId;
    if (!grade) return 0;
    if (typeof grade === "object" && "level" in grade && typeof grade.level === "number") {
        return grade.level;
    }
    if (typeof grade === "string") {
        return GRADE_LEVEL[grade as keyof typeof GRADE_LEVEL] ?? 0;
    }
    return 0;
}

function resolveUserGrade(user: User | null | undefined): string | null {
    if (!user?.grade) return null;
    if (typeof user.grade === "object" && user.grade !== null && "grade" in user.grade) {
        return user.grade.grade ?? null;
    }
    if (typeof user.grade === "string") {
        return user.grade;
    }
    return null;
}

function shouldUpdateUserStore(currentUser: User | null | undefined, nextUser: User | null | undefined) {
    if (!currentUser && !nextUser) return false;
    if (!currentUser || !nextUser) return true;
    const currentGrade = resolveUserGrade(currentUser);
    const nextGrade = resolveUserGrade(nextUser);
    return (
        currentUser._id !== nextUser._id ||
        currentUser.updatedAt !== nextUser.updatedAt ||
        currentGrade !== nextGrade
    );
}

export function buildShareUrl(choiceId?: string): string {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    if (choiceId) url.searchParams.set('choiceId', choiceId);
    url.searchParams.set('r', String(Date.now()));
    return url.toString();
}

function getShareText(choice: ConsultationChoice): string {
    const title = choice.title?.trim() || 'Consultation';
    const desc = (choice.description || '').trim();
    return desc ? `${title} — ${desc.slice(0, 200)}${desc.length > 200 ? '…' : ''}` : title;
}

// ==================== HOOK PRINCIPAL ====================
export function useCategoryClientViewChoix() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const toast = useToast();
    const user = useAuthStore((s) => s.user);
    const updateUser = useAuthStore((s) => s.updateUser);
    const category = useMonEtoileStore((s) => s.category);
    const setRubriqueEnCours = useMonEtoileStore((s) => s.setRubriqueEnCours);
    const setCurrentGrade = useMonEtoileStore((s) => s.setCurrentGrade);
    const setChoixConsultationEnCours = useMonEtoileStore((s) => s.setChoixConsultationEnCours);

    const rubriqueId = searchParams?.get("rubriqueId") || "";
    
    // États de partage par choix
    const [shareStates, setShareStates] = useState<Record<string, 'idle' | 'copied' | 'shared' | 'error'>>({});
    const resetTimersRef = useRef<Record<string, NodeJS.Timeout>>({});

    const clearResetTimer = useCallback((choiceId: string) => {
        if (resetTimersRef.current[choiceId]) {
            clearTimeout(resetTimersRef.current[choiceId]);
            delete resetTimersRef.current[choiceId];
        }
    }, []);

    const armResetTimer = useCallback((choiceId: string) => {
        clearResetTimer(choiceId);
        resetTimersRef.current[choiceId] = setTimeout(() => {
            setShareStates(prev => ({ ...prev, [choiceId]: 'idle' }));
        }, 1500);
    }, [clearResetTimer]);

    const {
        data: freshUser,
        isFetching: loadingUser,
    } = useQuery<User | null>({
        queryKey: ["me", user?._id],
        queryFn: async () => {
            const res = await api.get<User | null>("/users/me");
            return res.data ?? null;
        },
        enabled: Boolean(user?._id),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        retry: 1,
        initialData: user ?? undefined,
    });

    useEffect(() => {
        if (!freshUser) return;
        if (shouldUpdateUserStore(user, freshUser)) {
            updateUser(freshUser);
        }
        const nextGrade = resolveUserGrade(freshUser);
        setCurrentGrade(nextGrade);
    }, [freshUser, user, updateUser, setCurrentGrade]);

    const resolvedGrade = useMemo(
        () => resolveUserGrade(freshUser ?? user) ?? "NEOPHYTE",
        [freshUser, user]
    );

    const {
        data: rubriqueCourante,
        isLoading: loadingRubrique,
        error,
    } = useQuery<Rubrique>({
        queryKey: ["rubrique-choices", rubriqueId],
        queryFn: () => getChoicesWithCount(rubriqueId),
        enabled: Boolean(rubriqueId),
        staleTime: 1000 * 60 * 1,
        gcTime: 1000 * 60 *1,
    });

    useEffect(() => {
        if (!rubriqueCourante) return;
        setRubriqueEnCours(rubriqueCourante);
    }, [rubriqueCourante, setRubriqueEnCours]);

    const nomcategory = category?.nom || "la catégorie";
    const descriptioncategory = category?.description || "Pas de description disponible.";

    const buildFormPath = useCallback(
        (categoryId: string, segment: "form" | "formgroupe", choiceId?: string) =>
            buildCategoryChoicePath(categoryId, segment, {
                consultationId: rubriqueId,
                rubriqueId,
                choiceId: choiceId || null,
            }),
        [rubriqueId]
    );

    // ==================== PRÉPARATION DES CHOIX ENRICHIS ====================
    const enrichedChoices = useMemo(() => {
        if (!rubriqueCourante?.consultationChoices) return [];

        const userLevel = GRADE_LEVEL[resolvedGrade as keyof typeof GRADE_LEVEL] ?? 0;

        return rubriqueCourante.consultationChoices.map((choice) => {
            const requiredLevel = resolveRequiredLevel(choice);
            const hasRequiredGrade = userLevel >= requiredLevel;
            const existingConsultation = (choice as any).existingConsultation;
            const buttonStatus = ((): ButtonStatus => {
                if (!hasRequiredGrade) return 'RÉPONSE EN ATTENTE';
                if (existingConsultation) {
                    const status = existingConsultation.status;
                    if (status === 'COMPLETED') return "VOIR L'ANALYSE";
                    if (status === 'PENDING' || status === 'PROCESSING') return 'RÉPONSE EN ATTENTE';
                }
                return 'CONSULTER';
            })();

            return {
                ...choice,
                buttonStatus,
                consultationId: existingConsultation?._id,
                consultationCount: (choice as any).consultationCount || 0,
                shareUrl: buildShareUrl(choice.choiceId || choice._id),
                shareText: getShareText(choice),
                canShare: typeof navigator !== 'undefined' && (!!navigator.share || !!navigator.clipboard?.writeText),
            };
        });
    }, [rubriqueCourante, resolvedGrade]);

    // ==================== ACTIONS ====================
    const handleSelectConsultation = useCallback(
        async (choice: ConsultationChoice) => {
            if (!category?._id || !rubriqueCourante) {
                toast("⛔️ Catégorie ou rubrique introuvable.");
                return;
            }

            const activeUser = freshUser ?? user;

            if (!activeUser?._id) {
                toast("⛔️ Vous devez être connecté pour continuer.");
                return;
            }

            const requiredLevel = resolveRequiredLevel(choice);
            const userLevel = GRADE_LEVEL[resolvedGrade as keyof typeof GRADE_LEVEL] ?? 0;

            if (userLevel < requiredLevel) {
                toast("⛔️ Vous n'avez pas encore atteint le grade requis pour cette consultation.");
                return;
            }

            const choiceId = choice._id || choice.choiceId || "";
            const consultationId = createTempId();
            const now = new Date().toISOString();

            const consultation: Consultation = {
                _id: consultationId,
                id: consultationId,
                userId: activeUser._id,
                rubriqueId,
                serviceId: process.env.NEXT_PUBLIC_SERVICE_ID ?? "",
                serviceType: ConsultationType.AUTRE,
                status: ConsultationStatus.PENDING,
                isPaid: false,
                alternatives: choice.offering?.alternatives || [],
                choice,
                type: ConsultationType.AUTRE,
                title: choice.title || "Consultation",
                description: choice.description || "",
                result: null,
                price: 0,
                attachments: [],
                notes: null,
                extraPayload: {
                    pdfFile: choice.pdfFile || "",
                    choiceId,
                },
                createdAt: now,
                updatedAt: now,
            };

            setChoixConsultationEnCours(consultation);

            const nextPath = (() => {
                const { participants, frequence } = choice;
                if (participants === "GROUPE" && frequence === "LIBRE") {
                    return buildFormPath(category._id, "formgroupe", choiceId);
                }
                if (participants === "AVEC_TIERS" || participants === "POUR_TIERS") {
                    return buildFormPath(category._id, "form", choiceId);
                }
                if (participants === "SOLO") {
                    return getCreatedConsultationDestination({
                        categoryId: category._id,
                        consultationId,
                        rubriqueId,
                        choiceId,
                        consultationType: rubriqueCourante.typeconsultation || null,
                    });
                }
                return buildFormPath(category._id, "form", choiceId);
            })();

            router.push(nextPath);
        },
        [category, rubriqueCourante, freshUser, user, resolvedGrade, rubriqueId, setChoixConsultationEnCours, buildFormPath, router, toast]
    );

    const handleShare = useCallback(async (choiceId: string, shareUrl: string, title: string, shareText: string) => {
        try {
            setShareStates(prev => ({ ...prev, [choiceId]: 'idle' }));

            if (navigator.share) {
                await navigator.share({
                    title: title || 'Consultation',
                    text: shareText,
                    url: shareUrl,
                });
                setShareStates(prev => ({ ...prev, [choiceId]: 'shared' }));
                armResetTimer(choiceId);
                return;
            }

            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(shareUrl);
                setShareStates(prev => ({ ...prev, [choiceId]: 'copied' }));
                armResetTimer(choiceId);
                return;
            }

            window.prompt('Copiez ce lien :', shareUrl);
            setShareStates(prev => ({ ...prev, [choiceId]: 'copied' }));
            armResetTimer(choiceId);
        } catch {
            setShareStates(prev => ({ ...prev, [choiceId]: 'error' }));
            armResetTimer(choiceId);
        }
    }, [armResetTimer]);

    const handleViewAnalysis = useCallback((consultationId?: string) => {
        if (consultationId) {
            router.push(`/star/consultations/${consultationId}`);
        }
    }, [router]);

    const handleBack = useCallback(() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
            return;
        }
        router.replace("/star/category");
    }, [router]);

    const getShareLabel = useCallback((choiceId: string): string => {
        const state = shareStates[choiceId];
        if (state === 'copied') return 'LIEN COPIÉ';
        if (state === 'shared') return 'PARTAGÉ';
        if (state === 'error') return 'IMPOSSIBLE';
        return 'PARTAGER';
    }, [shareStates]);

    // Nettoyage des timers
    useEffect(() => {
        const timers = resetTimersRef.current;
        return () => {
            Object.values(timers).forEach(timer => clearTimeout(timer));
        };
    }, []);

    return {
        rubriqueCourante,
        loading: loadingRubrique || loadingUser,
        error,
        nomcategory,
        descriptioncategory,
        enrichedChoices,
        shareStates,
        handleSelectConsultation,
        handleShare,
        handleViewAnalysis,
        handleBack,
        getShareLabel,
    };
}