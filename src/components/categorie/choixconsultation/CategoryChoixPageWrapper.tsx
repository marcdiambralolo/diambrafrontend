"use client";
import { buildShareUrl, BUTTON_BASE_STYLES, BUTTON_HOVER_SCALE, ButtonStatus, getButtonStyles, ShareState, useCategoryClientViewChoix } from "@/hooks/categorie/useCategoryClientViewChoix";
import { ConsultationChoice } from '@/lib/interfaces';
import { Clock, Eye, Loader2, LucideIcon, Share2, Sparkles } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import CategoryLoadingSpinner from "../commons/CategoryLoadingSpinner";

export interface ButtonConfig {
    label: string;
    icon: LucideIcon;
    gradient: string;
    hoverEffect: boolean;
}

export const BUTTON_CONFIGS: Record<ButtonStatus, ButtonConfig> = {
    CONSULTER: {
        label: 'Consulter',
        icon: Sparkles,
        gradient: 'from-[#2E5AA6] to-[#4F83D1]',
        hoverEffect: true,
    },
    'RÉPONSE EN ATTENTE': {
        label: 'Réponse en attente',
        icon: Clock,
        gradient: 'from-amber-500 to-orange-500',
        hoverEffect: false,
    },
    "VOIR L'ANALYSE": {
        label: "Voir la réponse",
        icon: Eye,
        gradient: 'from-emerald-600 to-teal-600',
        hoverEffect: true,
    },
    "VOIR LA RÉPONSE": {
        label: "Voir la réponse",
        icon: Eye,
        gradient: 'from-emerald-600 to-teal-600',
        hoverEffect: true,
    },
};

interface RubriqueConsultationCardProps {
    enrichedChoice: ConsultationChoice;
    onSelect: () => void;
}

const RubriqueConsultationCard = memo(function RubriqueConsultationCard({
    enrichedChoice, onSelect,
}: RubriqueConsultationCardProps) {
    const router = useRouter();
    const status = enrichedChoice.buttonStatus as ButtonStatus;
    const config = useMemo(() => BUTTON_CONFIGS[status] ?? BUTTON_CONFIGS.CONSULTER, [status]);
    const Icon = config.icon;
    const count = enrichedChoice.consultationCount ?? 0;

    const handleClick = useCallback(() => {
        if (status === 'RÉPONSE EN ATTENTE') return;
        if (status === "VOIR L'ANALYSE" || status === "VOIR LA RÉPONSE") {
            router.push(`/star/consultations/${enrichedChoice.consultationId}`);
            return;
        }
        onSelect();
    }, [status, enrichedChoice.consultationId, onSelect, router]);

    const [shareState, setShareState] = useState<ShareState>('idle');
    const resetTimerRef = useRef<number | null>(null);

    const clearResetTimer = useCallback(() => {
        if (resetTimerRef.current) {
            window.clearTimeout(resetTimerRef.current);
            resetTimerRef.current = null;
        }
    }, []);

    const armResetTimer = useCallback(() => {
        clearResetTimer();
        resetTimerRef.current = window.setTimeout(() => setShareState('idle'), 1500);
    }, [clearResetTimer]);

    const shareUrl = useMemo(() => buildShareUrl(enrichedChoice.choiceId), [enrichedChoice.choiceId]);

    const shareText = useMemo(() => {
        const title = enrichedChoice.title?.trim() || 'Consultation';
        const desc = (enrichedChoice.description || '').trim();
        return desc ? `${title} — ${desc.slice(0, 200)}${desc.length > 200 ? '…' : ''}` : title;
    }, [enrichedChoice.title, enrichedChoice.description]);

    const shareLabel = useMemo(() => {
        switch (shareState) {
            case 'copied': return 'LIEN COPIÉ';
            case 'shared': return 'PARTAGÉ';
            case 'error': return 'IMPOSSIBLE';
            default: return 'PARTAGER';
        }
    }, [shareState]);

    const handleShare = useCallback(async () => {
        try {
            setShareState('idle');

            if (navigator.share) {
                await navigator.share({
                    title: enrichedChoice.title || 'Consultation',
                    text: shareText,
                    url: shareUrl,
                });
                setShareState('shared');
                armResetTimer();
                return;
            }

            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(shareUrl);
                setShareState('copied');
                armResetTimer();
                return;
            }

            window.prompt('Copiez ce lien :', shareUrl);
            setShareState('copied');
            armResetTimer();
        } catch {
            setShareState('error');
            armResetTimer();
        }
    }, [armResetTimer, enrichedChoice.title, shareText, shareUrl]);

    const isPending = status === 'RÉPONSE EN ATTENTE';
    const showHistory = enrichedChoice.frequence !== 'UNE_FOIS_VIE';
    const buttonStyles = getButtonStyles(status);

    const gradeDisplay = useMemo(() => {
        const grade = enrichedChoice.gradeId;
        if (grade && typeof grade === 'object' && grade !== null) {
            return (
                <>
                    Niveau requis : {grade.name} (niveau {grade.level})
                </>
            );
        }
        return <span className="text-gray-400">Aucun grade requis pour ce choix</span>;
    }, [enrichedChoice.gradeId]);

    return (
        <article
            tabIndex={0}
            aria-label={enrichedChoice.title}
            className="
                group relative h-full flex flex-col items-center overflow-hidden rounded-2xl
                bg-blue-50 shadow-sm hover:shadow-xl
                border border-[#DDE7FA]
                backdrop-blur-md
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F83D1]
                transition-all duration-300 mx-auto
            "
        >
            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                    bg-[radial-gradient(50%_50%_at_50%_40%,rgba(79,131,209,0.18),transparent_70%)]
                "
            />

            <div className="relative z-10 flex-1 flex flex-col items-center w-full p-3 sm:p-4 gap-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-0.5 text-center w-full" title={enrichedChoice.title}>
                    {enrichedChoice.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-700 mb-1 text-center whitespace-pre-line min-h-[2.5em]">
                    {enrichedChoice.description}
                </p>

                <div className="mt-auto w-full flex items-end gap-2">
                    <div className="w-full flex flex-col items-stretch gap-3">
                        <div className="flex flex-col gap-3 w-full">
                            <button
                                type="button"
                                onClick={handleClick}
                                disabled={isPending}
                                aria-disabled={isPending}
                                className={buttonStyles}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{config.label}</span>
                                {isPending && <Loader2 className="h-4 w-4 animate-spin opacity-90" aria-hidden="true" />}
                            </button>

                            {showHistory && enrichedChoice._id && (
                                <Link
                                    href={`/star/consultations/history/${enrichedChoice._id}`}
                                    className={`${BUTTON_BASE_STYLES} ${BUTTON_HOVER_SCALE} bg-gradient-to-r from-amber-500 to-orange-500`}
                                    tabIndex={0}
                                    aria-label="Voir l'historique de la consultation"
                                >
                                    HISTORIQUE ({count})
                                </Link>
                            )}

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleShare();
                                }}
                                className="flex-1 min-w-0 rounded-2xl px-3 py-3 font-extrabold text-white text-xs sm:text-sm flex items-center justify-center gap-2 select-none transition-all duration-300 shadow-md bg-black hover:bg-neutral-900 active:scale-[0.99] relative overflow-hidden border border-neutral-800"
                                aria-label="Partager cette consultation"
                                title="Partager"
                            >
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] translate-x-[-140%] hover:translate-x-[320%] transition-transform duration-700"
                                />
                                <Share2 className="h-4 w-4 relative z-10" />
                                <span className="relative z-10 truncate">{shareLabel}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-1 min-h-[1.5em] w-full text-center text-xs font-semibold text-[#2E5AA6] dark:text-[#9BC2FF]">
                    <a
                        href={`/star/grade?cb=${Date.now()}`}
                        className="underline transition-colors hover:text-[#163A74] dark:hover:text-white"
                        tabIndex={0}
                        aria-label="Voir les grades requis pour ce choix de consultation"
                    >
                        {gradeDisplay}
                    </a>
                </div>
            </div>
        </article>
    );
});

export function CategoryNoConsultation() {
    return (
        <div className="w-full max-w-2xl animate-fade-in mx-auto flex flex-col items-center justify-center">
            <div className="text-center text-gray-500 py-8">Aucune consultation disponible.</div>
        </div>
    );
}

export default function CategoryChoixPageWrapper() {
    const {
        handleSelectConsultation, handleBack, rubriqueCourante, loading, nomcategory, descriptioncategory
    } = useCategoryClientViewChoix();

    if (loading) return <CategoryLoadingSpinner />;
    if (!rubriqueCourante) return <CategoryNoConsultation />;

    return (
        <div className="w-full mt-8 max-w-5xl mx-auto flex flex-col items-center justify-center">
            <div className="w-full flex">
                <button
                    type="button"
                    onClick={handleBack}
                    className="mt-1 mb-2 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-extrabold text-white shadow-lg bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F83D1]/50 dark:focus-visible:ring-[#2E5AA6]/40 animate-fade-in"
                    aria-label="Retour"
                    style={{ alignSelf: 'flex-start' }}
                >
                    ← Retour
                </button>
            </div>

            <section className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center gap-2 sm:gap-4">
                <div className="w-full space-y-2 sm:space-y-3">
                    <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-center text-slate-900 dark:text-white px-1 py-0.5">
                        {nomcategory}
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600/90 dark:text-zinc-300/90 text-center">
                        {descriptioncategory}
                    </p>
                </div>
            </section>

            <div className="w-full max-w-6xl animate-fade-in mx-auto flex flex-col items-center justify-center">
                <div className="relative flex flex-col items-center justify-center mb-6 sm:mb-8 lg:mb-10 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center gap-2 w-full">
                        <div className="flex items-center justify-center gap-2 w-full">
                            <h1
                                className="xs:text-2xl mt-4 px-1 py-0.5 text-center text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl md:text-2xl"
                                style={{ letterSpacing: "-0.01em", WebkitTextStroke: "0.5px rgba(79,131,209,0.22)" }}
                            >
                                <span className="bg-clip-text text-black dark:text-white">
                                    {rubriqueCourante.titre?.trim() || "Rubrique"}
                                </span>
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 sm:gap-8 lg:gap-8 xl:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                    {rubriqueCourante.consultationChoices.map((choice, idx) => (
                        <RubriqueConsultationCard
                            key={choice.choiceId || idx}
                            enrichedChoice={choice}
                            onSelect={() => handleSelectConsultation(choice)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}